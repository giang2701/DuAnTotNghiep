import express from "express";
import {
    createBaiViet,
    updateBaiVietById,
    removeBaiVietById,
    getBaiVietById,
    getAllBaiViets,
    updateBaiVietStatus,
    // updateBaiVietsStatus,
} from "../controller/BaiViet.js";
import checkPermission from "../middlewares/checkPermission.js";

const baivietRouter = express.Router();

// Lấy tất cả bài viết
baivietRouter.get("/", getAllBaiViets);

// Lấy bài viết theo ID
baivietRouter.get("/:id", getBaiVietById);

// Tạo bài viết mới

baivietRouter.post("/", checkPermission("add-newspaperArticle"), createBaiViet);

// Cập nhật bài viết theo ID
baivietRouter.put(
    "/:id",
    checkPermission("edit-newspaperArticle"),
    updateBaiVietById
);

// Xóa bài viết theo ID
baivietRouter.delete(
    "/:id",
    checkPermission("delete-newspaperArticle"),
    removeBaiVietById
);

// Cập nhật trạng thái bài viết (active/deactive)
baivietRouter.patch(
    "/:id/status",
    checkPermission("edit-newspaperArticle"),
    updateBaiVietStatus
);

export default baivietRouter;
