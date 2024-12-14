import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Box } from "@mui/material";
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPaymentData();
    }, []);

    const fetchPaymentData = async () => {
        try {
            const response = await instance.get("/statistics/payment-method");
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
