import { Router } from "express";
import {
  createRefund,
  deleteRefund,
  getAllRefunds,
  updateRefundStatus,
} from "../controller/refundController.js";

const refundRouter = Router();

refundRouter.post("/", createRefund);
refundRouter.get("/", getAllRefunds);
refundRouter.patch("/:id/status", updateRefundStatus);
refundRouter.delete("/:id", deleteRefund);

export default refundRouter;
