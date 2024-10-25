import { Router } from "express";
import {
  deleteUserById,
  getAllUser,
  updateUserById,
} from "../controller/User.js";
const userRouter = Router();
userRouter.get("/", getAllUser);
userRouter.put("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);
export default userRouter;
