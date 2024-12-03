import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import instance from "../../../../api";
import { Grid, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "So sánh doanh thu",
    },
  },
};

interface IStatsData {
  lastMonth: {
    _id: string;
    totalRevenue: number;
  }[];
  currentMonth: {
    _id: string;
    totalRevenue: number;
  }[];
}

const RevenueStats = () => {
  const [statsData, setStatsData] = useState<IStatsData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const { label, currentMonth } = useMemo(() => {
    const currentMonth = dayjs().get("month") + 1;

    const label = `Tăng trưởng 2 Tháng gần nhất: ${
      currentMonth - 1
    } - ${currentMonth}`;

    return {
      label,
      currentMonth,
    };
  }, []);

  const data = useMemo(() => {
    const labels = Array.from({ length: 31 }).map((_, index) => index + 1);

    const lastMonthData = Array(31).fill(0);
    const currentMonthData = Array(31).fill(0);

    statsData?.lastMonth.forEach((item) => {
      const day = dayjs(item._id).date();
      lastMonthData[day - 1] = item.totalRevenue;
    });

    statsData?.currentMonth.forEach((item) => {
      const day = dayjs(item._id).date();
      currentMonthData[day - 1] = item.totalRevenue;
    });

    return {
      labels,
      datasets: [
        {
          label: `Tháng ${currentMonth - 1}`,
          data: lastMonthData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: `Tháng ${currentMonth}`,
          data: currentMonthData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  }, [statsData, currentMonth]);

  const fetchData = async () => {
    try {
      const r = await instance.get("/statistics/revenue");
      setStatsData(r.data);
    } catch (error) {
      console.log(error);
    }
  };
  if (!statsData) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div>
      <h2>{label}</h2>
      <div className="chart-container">
        <Line options={options} data={data} />
      </div>

      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={6}>
          <Typography variant="h6" align="center">
            Tổng doanh thu tháng trước:{" "}
            <strong>
              {statsData.lastMonth
                .reduce((acc, cur) => acc + cur.totalRevenue, 0)
                .toLocaleString()}{" "}
              VND
            </strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" align="center">
            Tổng doanh thu tháng này:{" "}
            <strong>
              {statsData.currentMonth
                .reduce((acc, cur) => acc + cur.totalRevenue, 0)
                .toLocaleString()}{" "}
              VND
            </strong>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default RevenueStats;
