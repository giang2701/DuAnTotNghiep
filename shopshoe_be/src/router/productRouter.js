import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    removeProductById,
    updateProductById,
} from "../controller/products.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import productSchema from "../validSchema/productSchema.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkIsAdmin } from "../middlewares/checkAdmin.js";
// import { upload } from "../middlewares/upoads.js";

const productRouter = Router();

productRouter.get("/:id", getProductById);
productRouter.get("/", getAllProducts);

// admin mới đk làm!
productRouter.use("/", checkAuth, checkIsAdmin); //middleware này sẽ chạy trước các middleware ở dưới nó
productRouter.post(
    "/",
    // upload.single("images"),
    validBodyRequest(productSchema),
    createProduct
);
productRouter.put(
    "/:id",
    // upload.single("images"),
    validBodyRequest(productSchema),
    updateProductById
);
productRouter.delete("/:id", removeProductById);

export default productRouter;
