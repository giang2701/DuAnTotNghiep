import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Box, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import instance from "../../../../api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface CustomerData {
    username: string | null;
    totalSpent: number;
}

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Top 10 Khách hàng mua nhiều nhất",
        },
    },
};

const TopCustomers = () => {
    const [data, setData] = useState<CustomerData[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(
        dayjs().startOf("year")
    );
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("year"));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        setError(null);
        try {
            if (!startDate || !endDate) {
                throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc!");
            }
            const response = await instance.get<CustomerData[]>(
                "/statistics/top-customers",
                {
                    params: {
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                    },
                }
            );
            setData(response.data);
        } catch (error) {
            console.error("Lỗi:", error);
            setError("Lỗi không xác định.");
        }
    };

    const chartData = useMemo(() => {
        const labels = data.map(
            (item) => item.username || "chưa có khách hàng nào mua"
        );
        const totalSpent = data.map((item) => item.totalSpent);

        return {
            labels,
            datasets: [
                {
                    label: "Tổng tiền (VND)",
                    data: totalSpent,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    }, [data]);

    return (
        <div>
            <h2>Top 10 Khách hàng mua nhiều nhất</h2>

            {/* Phần lọc giai đoạn */}
            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Từ ngày"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true } }}
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
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            {/* Hiển thị lỗi */}
            {error && (
                <Box sx={{ mt: 2, color: "red" }}>
                    <p>{error}</p>
                </Box>
            )}

            <Bar data={chartData} options={options} />
        </div>
    );
};

export default TopCustomers;
