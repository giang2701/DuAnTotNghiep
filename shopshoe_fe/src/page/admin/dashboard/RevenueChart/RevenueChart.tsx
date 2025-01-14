import { useState, useEffect, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Grid, TextField, Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import instance from "../../../../api"; // Đường dẫn đến file cấu hình Axios của bạn

// Đăng ký các thành phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: { position: "top" as const },
        title: { display: true, text: "Doanh thu theo giai đoạn" },
    },
};

interface RevenueByMonthData {
    label: string; // Nhãn ngày, tháng hoặc năm
    totalRevenue: number; // Tổng doanh thu
}

const RevenueByMonth = () => {
    const [data, setData] = useState<RevenueByMonthData[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(
        dayjs().startOf("year")
    );
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("year"));
    const [groupBy, setGroupBy] = useState<string>("month"); // Nhóm theo tháng mặc định
    const [error, setError] = useState<string | null>(null);

    // Gọi API để lấy dữ liệu doanh thu
    const fetchRevenueData = async () => {
        setError(null); // Reset lỗi trước khi gọi API
        try {
            if (!startDate || !endDate) {
                throw new Error("Ngày bắt đầu hoặc kết thúc không hợp lệ!");
            }

            const response = await instance.get(
                "/statistics/revenue-by-month",
                {
                    params: {
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        groupBy, // Gửi tham số groupBy
                    },
                }
            );

            if (response.data && Array.isArray(response.data)) {
                setData(response.data); // Cập nhật dữ liệu
            } else {
                throw new Error("Dữ liệu trả về không đúng định dạng!");
            }
        } catch (error: any) {
            console.error("Lỗi khi tải dữ liệu doanh thu:", error.message);
            setError(error.message || "Lỗi không xác định.");
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, [startDate, endDate, groupBy]); // Tự động gọi API khi có thay đổi

    // Dữ liệu biểu đồ
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return { labels: [], datasets: [] };
        }

        const labels = data.map((item) => item.label); // Sử dụng nhãn trả về từ backend
        const revenues = data.map((item) => item.totalRevenue); // Tổng doanh thu

        return {
            labels,
            datasets: [
                {
                    label: "Doanh thu (VND)",
                    data: revenues,
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
            ],
        };
    }, [data]);

    return (
        <Box sx={{ p: 4 }}>
            <h2>Doanh thu theo giai đoạn</h2>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
            >
                {/* Từ ngày */}
                <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Từ ngày"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true } }} // Thay thế renderInput
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Đến ngày"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true } }} // Thay thế renderInput
                        />
                    </LocalizationProvider>
                </Grid>
                {/* Nhóm theo */}
                <Grid item xs={2}>
                    <TextField
                        select
                        label="Nhóm theo"
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        fullWidth
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="day">Ngày</option>
                        <option value="month">Tháng</option>
                        <option value="year">Năm</option>
                    </TextField>
                </Grid>
            </Grid>

            {/* Hiển thị lỗi */}
            {error && (
                <Box sx={{ mt: 2, color: "red" }}>
                    <p>{error}</p>
                </Box>
            )}

            {/* Hiển thị biểu đồ */}
            <Box sx={{ mt: 4 }}>
                {data.length > 0 ? (
                    <Bar options={options} data={chartData} />
                ) : (
                    <p>Không có dữ liệu để hiển thị.</p>
                )}
            </Box>
        </Box>
    );
};

export default RevenueByMonth;
