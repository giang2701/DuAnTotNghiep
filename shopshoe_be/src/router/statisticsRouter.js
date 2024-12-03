import { Router } from "express";
import {
  generalStatistics,
  monthlyRevenueStats,
  productBestSellingStats,
  revenueStats,
} from "../controller/Statistics.js";

const statisticsRouter = Router();

statisticsRouter.get("/top-product-best-selling", productBestSellingStats);
statisticsRouter.get("/revenue", revenueStats);
statisticsRouter.get("/general", generalStatistics);
statisticsRouter.get("/revenue-by-month", monthlyRevenueStats);

export default statisticsRouter;
