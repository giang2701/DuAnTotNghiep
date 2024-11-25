import express from "express";
import {
    AddToCart,
    deleteCart,
    getAllCarts,
    getCartDetail,
    getCartIdUser,
    removeCart,
    updateCart,
} from "../controller/Cart.js";
const RouterCart = express.Router();
RouterCart.get("/", getAllCarts); //Lay thong tin cart của mọi người dùng
RouterCart.get("/:id", getCartDetail); //Lay thong tin cart theo id user
RouterCart.get("/user/:id", getCartIdUser); //Lay thong tin cart theo id user
RouterCart.post("/", AddToCart);
RouterCart.put("/:id", updateCart);
RouterCart.delete("/:id", removeCart);
RouterCart.delete("/all/:id", deleteCart);
export default RouterCart;
