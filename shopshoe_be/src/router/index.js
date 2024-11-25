import { Router } from "express";
import productRouter from "./productRouter.js";
import authRouter from "./authRouter.js";
import categoryRouter from "./categoryRouter.js";
import sizeRouter from "./size.js";
import userRouter from "./userRouter.js";
import RouterCart from "./cart.js";
import RouterOrder from "./order.js";

const router = Router();
router.use("/products", productRouter);
router.use("/categorys", categoryRouter);
router.use("/auth", authRouter);
router.use("/size", sizeRouter);
router.use("/user", userRouter);
router.use("/cart", RouterCart);
router.use("/orders", RouterOrder);

export default router;
