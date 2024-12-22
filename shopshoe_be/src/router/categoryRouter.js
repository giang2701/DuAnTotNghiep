import { Router } from "express";

import {
    createCategory,
    getAllCategorys,
    getCategoryById,
    removeCategoryById,
    updateCategoryById,
} from "../controller/Category.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import { categorySchema } from "../validSchema/categorySchema.js";
import { checkAuth } from "./../middlewares/checkAuth.js";
import { checkIsAdmin } from "./../middlewares/checkAdmin.js";
import checkPermission from "./../middlewares/checkPermission.js";

const categoryRouter = Router();

categoryRouter.get("/:id", getCategoryById);
categoryRouter.get("/", getAllCategorys);

// admin mới đk làm!
categoryRouter.use("/", checkAuth, checkIsAdmin); //middleware này sẽ chạy trước các middleware ở dưới nó
categoryRouter.post(
    "/",
    validBodyRequest(categorySchema),
    checkPermission("add-category"),
    createCategory
);
categoryRouter.put(
    "/:id",
    validBodyRequest(categorySchema),
    checkPermission("edit-category"),
    updateCategoryById
);
categoryRouter.delete(
    "/:id",
    checkPermission("delete-category"),
    removeCategoryById
);

export default categoryRouter;
