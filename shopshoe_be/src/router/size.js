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

const sizeRouter = Router();
sizeRouter.get("/", getAllSize);
sizeRouter.get("/:id", getSizeById);

// admin mới đk làm!
// categoryRouter.use("/", checkAuth, checkIsAdmin); //middleware này sẽ chạy trước các middleware ở dưới nó
sizeRouter.post("/", validBodyRequest(SizeSchema), CreateSize);
sizeRouter.put("/:id", validBodyRequest(SizeSchema), UpdateSize);
sizeRouter.delete("/:id", DeleteSize);
export default sizeRouter;
