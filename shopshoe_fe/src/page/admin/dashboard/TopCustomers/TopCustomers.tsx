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
    username: string | null; // Có thể null nếu username không tồn tại
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await instance.get<CustomerData[]>(
                "/statistics/top-customers"
            );
            setData(response.data);
        } catch (error) {
            console.error("dât lỗi:", error);
        }
    };

    const chartData = useMemo(() => {
        const labels = data.map(
            (item) => item.username || "chưa có khách hàng nào muamua"
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
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default TopCustomers;
