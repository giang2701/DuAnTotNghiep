import styles from "./index.module.css";
import OverviewStats from "./OverviewStats/OverviewStats";
import RevenueChart from "./RevenueChart/RevenueChart";
import RevenueStats from "./RevenueStats/RevenueStats";
import TopSellingProducts from "./TopSellingProducts/TopSellingProducts";

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <OverviewStats />
      <TopSellingProducts />
      <RevenueChart />
      <RevenueStats />
    </div>
  );
};

export default Dashboard;
