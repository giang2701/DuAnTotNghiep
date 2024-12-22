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
import checkPermission from "../middlewares/checkPermission.js";
export const RouterBrand = express.Router();
RouterBrand.get("/", getAllBrand);
RouterBrand.post(
    "/",
    checkPermission("add-brand"),
    validBodyRequest(brandValidate),
    createBrand
);
RouterBrand.get("/:id", getBrandById);
RouterBrand.put("/:id", checkPermission("edit-brand"), updateBrandById);
RouterBrand.delete("/:id", checkPermission("delete-brand"), deleteBrandById);
export default RouterBrand;
