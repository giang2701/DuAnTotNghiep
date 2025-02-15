import express from "express";
import {
    createFlashSale,
    getAllFlashSales,
    getFlashSaleById,
    updateFlashSale,
    deleteFlashSale,
    updateFlashSaleStatus,
} from "../controller/FlashSale.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import flashSaleSchema from "../validSchema/flashSaleSchema.js";
import checkPermission from "../middlewares/checkPermission.js";
export const RouterFlashSale = express.Router();
RouterFlashSale.get("/", getAllFlashSales);
RouterFlashSale.post(
    "/",
    checkPermission("add-flaseSale"),
    validBodyRequest(flashSaleSchema),
    createFlashSale
);
RouterFlashSale.get("/:id", getFlashSaleById);
RouterFlashSale.put("/:id", updateFlashSale);
RouterFlashSale.put("/status/:id", updateFlashSaleStatus);
RouterFlashSale.delete(
    "/:id",
    checkPermission("delete-flaseSale"),
    deleteFlashSale
);
export default RouterFlashSale;
