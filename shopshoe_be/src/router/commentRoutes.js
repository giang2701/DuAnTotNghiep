import { Router } from "express";
import {
  createComment,
  getCommentsByProductId,
  updateCommentById,
  deleteCommentById,
} from "../controller/commentController.js";

const commentRouter = Router();

commentRouter.post("/", createComment);
commentRouter.get("/:productId", getCommentsByProductId);
commentRouter.put("/:id", updateCommentById);
commentRouter.delete("/:id", deleteCommentById);

export default commentRouter;
