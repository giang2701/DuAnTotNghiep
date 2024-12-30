import { Router } from "express";

import checkPermission from "../middlewares/checkPermission.js";
import {
  createReturn,
  deleteReturn,
  getAllReturns,
  updateReturnStatus,
} from "../controller/returnController.js";

const returnRouter = Router();

returnRouter.post("/", createReturn);
returnRouter.get("/", getAllReturns);
returnRouter.patch("/:id/status", updateReturnStatus);
returnRouter.delete("/:id", checkPermission("delete-return"), deleteReturn);
export default returnRouter;
// , checkPermission("read-return")
// , checkPermission("edit-return")
