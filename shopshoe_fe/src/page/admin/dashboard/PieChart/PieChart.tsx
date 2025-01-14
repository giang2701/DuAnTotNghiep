import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Box, Grid } from "@mui/material";
import instance from "../../../../api";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

// Đăng ký các phần tử cần thiết bao gồm ArcElement
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
    }[];
}

const PieChart = () => {
    const [data, setData] = useState<ChartData>({ labels: [], datasets: [] });
    const [startDate, setStartDate] = useState<Dayjs | null>(
        dayjs().startOf("year")
    );
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("year"));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPaymentData();
    }, [startDate, endDate]);

    const fetchPaymentData = async () => {
        setError(null);
        try {
            if (!startDate || !endDate) {
                throw new Error("Vui lòng chọn ngày bắt đầu và kết thúc!");
            }

            const response = await instance.get("/statistics/payment-method", {
                params: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                },
            });
            const responseData = response.data;
            const momoSales = responseData.find(
                (item: any) => item.paymentMethod === "MOMO"
            );
            const codSales = responseData.find(
                (item: any) => item.paymentMethod === "COD"
            );

            const momoTotal = momoSales?.totalSales || 0;
            const codTotal = codSales?.totalSales || 0;

            setData({
                labels: ["MOMO", "COD"],
                datasets: [
                    {
                        data: [momoTotal, codTotal],
                        backgroundColor: ["#FF6384", "#36A2EB"],
                    },
                ],
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <h2 style={{ marginLeft: "-30" }}>
                Thống kê doanh thu theo phương thức thanh toán
            </h2>
            <br />

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

            {error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Pie
                        data={data}
                        options={{
                            responsive: false,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: "top",
                                },
                                tooltip: {
                                    enabled: true,
                                },
                            },
                        }}
                        width={400}
                        height={400}
                    />
                </Box>
            )}
        </Box>
    );
};

export default PieChart;
