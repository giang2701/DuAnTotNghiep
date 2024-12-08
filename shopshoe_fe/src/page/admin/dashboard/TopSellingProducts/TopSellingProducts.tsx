import { useEffect, useMemo, useState } from "react";
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
import moment from "moment";

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
};

import styles from "./index.module.css";
import instance from "../../../../api";

interface IStatsData {
  name: string;
  totalQuantity: number;
}

const TopSellingProducts = () => {
  const [statsData, setStatsData] = useState<IStatsData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
    const startOfLastMonth = moment()
      .subtract(2, "month")
      .startOf("month")
      .toISOString();
    const endOfThisMonth = moment().endOf("month").toISOString();

    try {
      const r = await instance.get("/statistics/top-product-best-selling", {
        params: {
          start: startOfLastMonth,
          end: endOfThisMonth,
        },
      });
      setStatsData(r.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <br />
      <br />
      <br />
      <h2 className={styles.title}>
        Top 10 sản phẩm bán chạy (2 tháng gần nhất)
      </h2>
      <div className="chart-container">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default TopSellingProducts;
