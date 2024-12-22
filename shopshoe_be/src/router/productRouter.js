import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByIdSize,
    removeProductById,
    updateProductById,
    updateProductsStatus,
} from "../controller/products.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import productSchema from "../validSchema/productSchema.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkIsAdmin } from "../middlewares/checkAdmin.js";
// import { upload } from "../middlewares/upoads.js";
import checkPermission from "./../middlewares/checkPermission.js";

const productRouter = Router();

productRouter.get("/:id", getProductById);
productRouter.get("/:id", getProductByIdSize);
productRouter.get("/", getAllProducts);

// admin mới đk làm!
productRouter.use("/", checkAuth, checkIsAdmin); //middleware này sẽ chạy trước các middleware ở dưới nó
productRouter.post(
    "/",
    validBodyRequest(productSchema),
    checkPermission("add-product"),
    createProduct
);
productRouter.put("/:id", checkPermission("edit-product"), updateProductById);
productRouter.put(
    "/status/:id",
    checkPermission("delete-product"),
    updateProductsStatus
);
productRouter.delete(
    "/:id",
    checkPermission("delete-product"),
    removeProductById
);

export default productRouter;
