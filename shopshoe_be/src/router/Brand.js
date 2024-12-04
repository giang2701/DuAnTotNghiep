import express from "express";
import {
    createBrand,
    deleteBrandById,
    getAllBrand,
    getBrandById,
    updateBrandById,
} from "../controller/Brand.js";
export const RouterBrand = express.Router();
RouterBrand.get("/", getAllBrand);
RouterBrand.post("/", createBrand);
RouterBrand.get("/:id", getBrandById);
RouterBrand.put("/:id", updateBrandById);
RouterBrand.delete("/:id", deleteBrandById);
export default RouterBrand;
