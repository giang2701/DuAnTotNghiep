import styles from "./index.module.css";
import OverviewStats from "./OverviewStats/OverviewStats";
import PieChart from "./PieChart/PieChart";
import RevenueChart from "./RevenueChart/RevenueChart";
import RevenueStats from "./RevenueStats/RevenueStats";
import TopCustomers from "./TopCustomers/TopCustomers";

import TopSellingProducts from "./TopSellingProducts/TopSellingProducts";

const Dashboard = () => {
    return (
        <div className={styles.wrapper}>
            <OverviewStats />
            <TopSellingProducts />
            <PieChart />
            <TopCustomers />
            <RevenueChart />
            <RevenueStats />
        </div>
    );
};

export default Dashboard;
