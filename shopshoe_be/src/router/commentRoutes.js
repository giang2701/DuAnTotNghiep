import { Router } from "express";
import {
  createComment,
  getAllComments,
  getCommentsByProductId,
  hideComment,
} from "../controller/commentController.js";

const commentRouter = Router();

commentRouter.post("/", createComment);
commentRouter.get("/product/:productId", getCommentsByProductId);
commentRouter.get("/", getAllComments);
commentRouter.put("/:commentId/hide", hideComment);
export default commentRouter;
