import express from "express";
import {
    addLikeProduct,
    deleteHeartByIdUser,
    getHeartByIdUser
} from "../controller/Heart.js";
const RouterHeart = express.Router();
RouterHeart.get("/user/:id", getHeartByIdUser);
RouterHeart.post("/", addLikeProduct);
RouterHeart.delete("/:userId/:productId", deleteHeartByIdUser);
export default RouterHeart;
