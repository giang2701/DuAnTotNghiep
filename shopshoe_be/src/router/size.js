import { Router } from "express";
import {
    CreateSize,
    DeleteSize,
    getAllSize,
    getSizeById,
    UpdateSize,
} from "../controller/Size.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import { SizeSchema } from "./../validSchema/sizeSchema.js";
import checkPermission from "../middlewares/checkPermission.js";

const sizeRouter = Router();
sizeRouter.get("/", getAllSize);
sizeRouter.get("/:id", getSizeById);

// admin mới đk làm!
// categoryRouter.use("/", checkAuth, checkIsAdmin); //middleware này sẽ chạy trước các middleware ở dưới nó
sizeRouter.post(
    "/",
    checkPermission("add-size"),
    validBodyRequest(SizeSchema),
    CreateSize
);
sizeRouter.put(
    "/:id",
    checkPermission("edit-size"),
    validBodyRequest(SizeSchema),
    UpdateSize
);
sizeRouter.delete("/:id", checkPermission("delete-size"), DeleteSize);
export default sizeRouter;
