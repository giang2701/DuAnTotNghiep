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
      text: "Chart.js Line Chart",
    },
  },
};

import styles from "./index.module.css";
import instance from "../../../../api";

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
  const [statsData, setStatsData] = useState<IStatsData>();

  useEffect(() => {
    fetchData();
  }, []);

  const { label, currentMonth } = useMemo(() => {
    const currentMonth = dayjs().get("month") + 1;

    const label = `Doanh thu T${currentMonth - 1} - ${currentMonth}`;

    return {
      label,
      currentMonth,
    };
  }, []);

  const data = useMemo(() => {
    const labels = Array.from({ length: 31 }).map((_, index) => index + 1);

    const data = {
      labels,
      datasets: [
        {
          label: `Tháng ${currentMonth - 1}`,
          data: statsData?.lastMonth.map((it) => it.totalRevenue),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: `Tháng ${currentMonth}`,
          data: statsData?.currentMonth.map((it) => it.totalRevenue),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    return data;
  }, [currentMonth, statsData?.currentMonth, statsData?.lastMonth]);

  const fetchData = async () => {
    try {
      const r = await instance.get("/statistics/revenue");
      setStatsData(r.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{label}</h2>

      <Line options={options} data={data} />
    </div>
  );
};

export default RevenueStats;
