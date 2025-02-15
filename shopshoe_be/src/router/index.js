import { Router } from "express";
import productRouter from "./productRouter.js";
import authRouter from "./authRouter.js";
import categoryRouter from "./categoryRouter.js";
import sizeRouter from "./size.js";
import userRouter from "./userRouter.js";
import RouterCart from "./cart.js";
import RouterOrder from "./order.js";
import RouterVoucher from "./Voucher.js";
import RouterHeart from "./heart.js";
import statisticsRouter from "./statisticsRouter.js";
import RouterBrand from "./Brand.js";
import commentRouter from "./commentRoutes.js";
import RouterCheckPermission from "./checkPermission.js";
import returnRouter from "./return.js";
import refundRouter from "./refund.js";
import RouterFlashSale from "./FlashSale.js";
import baivietRouter from "./BaiVietRouter.js";

const router = Router();
router.use("/products", productRouter);
router.use("/categorys", categoryRouter);
router.use("/brand", RouterBrand);
router.use("/auth", authRouter);
router.use("/size", sizeRouter);
router.use("/user", userRouter);
router.use("/cart", RouterCart);
router.use("/orders", RouterOrder);
router.use("/voucher", RouterVoucher);
router.use("/heart", RouterHeart);
router.use("/statistics", statisticsRouter);
router.use("/comments", commentRouter);
router.use("/permissions", RouterCheckPermission);
router.use("/returns", returnRouter);
router.use("/refunds", refundRouter);
router.use("/flashsale", RouterFlashSale);
router.use("/baiviet", baivietRouter); 

export default router;
