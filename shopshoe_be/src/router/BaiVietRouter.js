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

const baivietRouter = express.Router();

// Lấy tất cả bài viết
baivietRouter.get("/", getAllBaiViets);

// Lấy bài viết theo ID
baivietRouter.get("/:id", getBaiVietById);

// Tạo bài viết mới

baivietRouter.post("/", createBaiViet);

// Cập nhật bài viết theo ID
baivietRouter.put("/:id", updateBaiVietById);

// Xóa bài viết theo ID
baivietRouter.delete("/:id", removeBaiVietById);

// Cập nhật trạng thái bài viết (active/deactive)
baivietRouter.patch("/:id/status", updateBaiVietStatus);

export default baivietRouter;
