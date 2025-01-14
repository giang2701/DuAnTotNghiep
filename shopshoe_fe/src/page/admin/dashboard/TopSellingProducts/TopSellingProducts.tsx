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
import { Box, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import instance from "../../../../api";
import styles from "./index.module.css";

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
        legend: {
            position: "top",
            display: false,
        },
        title: {
            display: true,
        },
    },
    maintainAspectRatio: true,
};

interface IStatsData {
    name: string;
    totalQuantity: number;
}

const TopSellingProducts = () => {
    const [statsData, setStatsData] = useState<IStatsData[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(
        dayjs().startOf("year")
    );
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("year"));
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setError(null);
        try {
            if (!startDate || !endDate) {
                throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc!");
            }

            const r = await instance.get(
                "/statistics/top-product-best-selling",
                {
                    params: {
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                    },
                }
            );
            setStatsData(r.data);
        } catch (error: any) {
            console.error("Lỗi khi tải dữ liệu:", error.message);
            setError(error.message || "Lỗi không xác định.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const data = useMemo(() => {
        const labels = statsData.map((it) => it.name);

        return {
            labels,
            datasets: [
                {
                    data: statsData.map((it) => it.totalQuantity),
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                    barPercentage: 0.2,
                },
            ],
        };
    }, [statsData]);

    return (
        <div className={styles.wrapper}>
            <br />
            <h2 className={styles.title}>Top 10 sản phẩm bán chạy</h2>

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

            <div className="chart-container">
                <Bar options={options} data={data} />
            </div>
        </div>
    );
};

export default TopSellingProducts;
