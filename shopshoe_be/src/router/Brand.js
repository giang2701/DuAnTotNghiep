import express from "express";
import {
    createBrand,
    deleteBrandById,
    getAllBrand,
    getBrandById,
    updateBrandById,
} from "../controller/Brand.js";
import { brandValidate } from "../validSchema/brandSchema.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
export const RouterBrand = express.Router();
RouterBrand.get("/", getAllBrand);
RouterBrand.post("/", validBodyRequest(brandValidate), createBrand);
RouterBrand.get("/:id", getBrandById);
RouterBrand.put("/:id", updateBrandById);
RouterBrand.delete("/:id", deleteBrandById);
export default RouterBrand;
