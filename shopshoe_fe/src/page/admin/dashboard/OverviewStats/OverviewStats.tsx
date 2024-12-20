import { useEffect, useState } from "react";
import DashboardCard from "../DashboardCard/DashboardCard";
import instance from "../../../../api";
import { formatNumber } from "../../../utils/formatNumber";

interface IGeneralStats {
  categoryCount: number;
  currentMonthRevenue: number;
  productCount: number;
  userCount: number;
}

const OverviewStats = () => {
  const [data, setData] = useState<IGeneralStats>();

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <DashboardCard
        title="Doanh thu"
        value={formatNumber(data?.currentMonthRevenue ?? 0)}
        color="#28A745"
        description="Doanh thu tháng này"
      />

      <DashboardCard
        title="Danh mục"
        value={data?.categoryCount ?? 0}
        color="#DC3545"
        description="Tổng số danh mục"
      />

  );
};

export default OverviewStats;
