import { Router } from "express";
import {
    applyFlashSaleToMultipleProducts,
    createProduct,
    getAllProducts,
    getFlashSaleProducts,
    getProductById,
    getProductByIdSize,
    removeProductById,
    updateExpiredFlashSales,
    updateProductById,
    updateProductsStatus,
    updateProductWithFlashSale,
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

productRouter.put("/flashSale/:id", updateProductWithFlashSale);
productRouter.get("/flashSale/:id", updateExpiredFlashSales);
productRouter.get("/flashSale", getFlashSaleProducts);
productRouter.post(
    "/flashSaleAll",
    checkPermission("add-discount"),
    applyFlashSaleToMultipleProducts
);
export default productRouter;
