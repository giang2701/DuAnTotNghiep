import { Router } from "express";
import {
    deleteUserById,
    getAllUser,
    getUserById,
    updateUserAddress,
    updateUserById,
    updateUserStatus,
} from "../controller/User.js";
import checkPermission from "../middlewares/checkPermission.js";
const userRouter = Router();
userRouter.get("/", getAllUser);
userRouter.get("/:id", getUserById);
userRouter.put("/address/:id", updateUserAddress);
userRouter.put("/:id", checkPermission("edit-user"), updateUserById);
userRouter.delete("/:id", checkPermission("delete-user"), deleteUserById);
userRouter.put("/status/:id", checkPermission("edit-user"), updateUserStatus);
export default userRouter;
