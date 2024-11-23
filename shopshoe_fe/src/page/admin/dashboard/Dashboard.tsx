import styles from "./index.module.css";
import OverviewStats from "./OverviewStats/OverviewStats";
import RevenueStats from "./RevenueStats/RevenueStats";
import TopSellingProducts from "./TopSellingProducts/TopSellingProducts";

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <OverviewStats />
      <TopSellingProducts />
      <RevenueStats />
    </div>
  );
};

export default Dashboard;
