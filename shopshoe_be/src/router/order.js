import express from "express";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderDetail,
    updateOrderStatus,
} from "../controller/Orders.js";
const RouterOrder = express.Router();
RouterOrder.post("/", createOrder);
RouterOrder.get("/", getAllOrders);
RouterOrder.get("/:id", getOrderDetail);
RouterOrder.put("/:id", updateOrderStatus);
RouterOrder.delete("/:id", deleteOrder);
export default RouterOrder;
