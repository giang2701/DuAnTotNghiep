import express from "express";
import {
    checkAndUpdatePaymentStatus,
    createDetail,
    createOrder,
    createOrderAndPayment,
    createOrderAndPaymentDetail,
    deleteOrder,
    getAllOrders,
    getOrderDetail,
    getOrderDetailById,
    momoWebhook,
    updateOrderStatus,
    updateStatusCancel,
    updateStatusGoodsreceived,
} from "../controller/Orders.js";
import checkPermission from "../middlewares/checkPermission.js";
const RouterOrder = express.Router();
RouterOrder.post("/", createOrder);
RouterOrder.post("/detail", createDetail);
RouterOrder.get("/user/:id", getOrderDetailById);
RouterOrder.put("/statusCancel/:id", updateStatusCancel);
RouterOrder.put("/statusGoodsreceived/:id", updateStatusGoodsreceived);
RouterOrder.delete("/:id", deleteOrder);
RouterOrder.post("/payWithMoMo", createOrderAndPayment);
RouterOrder.post("/payWithMoMoDetail", createOrderAndPaymentDetail);
RouterOrder.post("/query", checkAndUpdatePaymentStatus);
RouterOrder.post("/webhook", momoWebhook);
//admin
RouterOrder.get("/", getAllOrders);
RouterOrder.get("/:id", getOrderDetail);
RouterOrder.put(
    "/status/:id",
    checkPermission("edit-order"),
    updateOrderStatus
);
export default RouterOrder;
