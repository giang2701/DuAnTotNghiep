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

  const fetchData = async () => {
    try {
      const r = await instance.get("/statistics/general");
      setData(r.data);
    } catch (error) {
      console.log(error);
    }
  };

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

      <DashboardCard
        title="Sản phẩm"
        value={data?.productCount ?? 0}
        color="#FFC107"
        description="Số lượng sản phẩm hiện có"
      />

      <DashboardCard
        title="Người dùng"
        value={data?.userCount ?? 0}
        color="#17A2B8"
        description="Tổng số người dùng"
      />
    </div>
  );
};

export default OverviewStats;
