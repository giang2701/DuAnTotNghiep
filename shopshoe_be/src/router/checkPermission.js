import express from "express";
import {
    createPermission,
    DeletePermission,
    getAllPermissions,
    UpdatePermission,
} from "../controller/checkPermission.js";

const RouterCheckPermission = express.Router();
RouterCheckPermission.get("/", getAllPermissions);
RouterCheckPermission.post("/", createPermission);
RouterCheckPermission.post("/users/:id/permissions", UpdatePermission);
RouterCheckPermission.delete("/users/:id/permissions", DeletePermission);
export default RouterCheckPermission;
