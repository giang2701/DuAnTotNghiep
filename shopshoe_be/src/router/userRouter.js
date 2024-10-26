import { Router } from "express";
import {
  deleteUserById,
  getAllUser,
  updateUserById,
  updateUserStatus,
} from "../controller/User.js";
const userRouter = Router();
userRouter.get("/", getAllUser);
userRouter.put("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put("/status/:id", updateUserStatus);
export default userRouter;
