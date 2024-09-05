import { Router } from "express";
import productRouter from "./productRouter.js";
import authRouter from "./authRouter.js";
import categoryRouter from "./categoryRouter.js";

const router = Router();
router.use("/products", productRouter);
router.use("/categorys", categoryRouter);
router.use("/auth", authRouter);

export default router;
