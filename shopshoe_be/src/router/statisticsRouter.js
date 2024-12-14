import { Router } from "express";
import {
    generalStatistics,
    paymentMethodStats,
    productBestSellingStats,
    revenueStats,
    revenueStats2,
    topCustomersStats,
} from "../controller/Statistics.js";

const statisticsRouter = Router();

statisticsRouter.get("/top-product-best-selling", productBestSellingStats);
statisticsRouter.get("/revenue", revenueStats);
statisticsRouter.get("/general", generalStatistics);
statisticsRouter.get("/revenue-by-month", revenueStats2);
statisticsRouter.get("/payment-method", paymentMethodStats);
statisticsRouter.get("/top-customers", topCustomersStats);

export default statisticsRouter;
