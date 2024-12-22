import { Router } from "express";
import {
    createComment,
    getAllComments,
    getCommentsByProductId,
    hideComment,
} from "../controller/commentController.js";
import checkPermission from "../middlewares/checkPermission.js";

const commentRouter = Router();

commentRouter.post("/", createComment);
commentRouter.get("/product/:productId", getCommentsByProductId);
//adminadmin
commentRouter.get("/", getAllComments);
commentRouter.put("/:commentId/hide", checkPermission("edit-cmt"), hideComment);
export default commentRouter;
