import express from "express";
import {
  checkAndUpdatePaymentStatus,
  createDetail,
  createOrder,
  createOrderAndPayment,
  deleteOrder,
  getAllOrders,
  getOrderDetail,
  getOrderDetailById,
  momoWebhook,
  updateOrderStatus,
} from "../controller/Orders.js";
const RouterOrder = express.Router();
RouterOrder.post("/", createOrder);
RouterOrder.post("/detail", createDetail);
RouterOrder.get("/", getAllOrders);
RouterOrder.get("/:id", getOrderDetail);
RouterOrder.get("/user/:id", getOrderDetailById);
RouterOrder.put("/status/:id", updateOrderStatus);
RouterOrder.delete("/:id", deleteOrder);
RouterOrder.post("/payWithMoMo", createOrderAndPayment);
RouterOrder.post("/query", checkAndUpdatePaymentStatus);
RouterOrder.post("/webhook", momoWebhook);
export default RouterOrder;
