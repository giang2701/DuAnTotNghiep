import BaiViet from "../model/BaiViet.js";
// Tạo bài viết mới
export const createBaiViet = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body);

        // Lưu bài viết mới
        const data = await BaiViet.create({
            title: req.body.title,
            content: req.body.content,
            images: req.body.images || [],
            isActive: req.body.isActive ?? true,
        });

        return res.status(201).json({
            success: true,
            data,
            message: "Tạo bài viết thành công!",
        });
    } catch (error) {
        console.error("Error creating bai viet:", error);
        next(error);
    }
};

// Cập nhật bài viết theo ID
export const updateBaiVietById = async (req, res, next) => {
    try {
        const data = await BaiViet.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                images: req.body.images,
                isActive: req.body.isActive,
            },
            { new: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài viết để cập nhật!",
            });
        }

        return res.status(200).json({
            success: true,
            data,
            message: "Cập nhật bài viết thành công!",
        });
    } catch (error) {
        console.error("Error updating bai viet:", error);
        next(error);
    }
};

// Xóa bài viết theo ID
export const removeBaiVietById = async (req, res, next) => {
    try {
        const data = await BaiViet.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài viết để xóa!",
            });
        }

        return res.status(200).json({
            success: true,
            data,
            message: "Xóa bài viết thành công!",
        });
    } catch (error) {
        console.error("Error deleting bai viet:", error);
        next(error);
    }
};

// Lấy bài viết theo ID
export const getBaiVietById = async (req, res, next) => {
    try {
        const data = await BaiViet.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài viết!",
            });
        }

        return res.status(200).json({
            success: true,
            data,
            message: "Lấy bài viết thành công!",
        });
    } catch (error) {
        console.error("Error fetching bai viet:", error);
        next(error);
    }
};

// Lấy tất cả bài viết
export const getAllBaiViets = async (req, res, next) => {
    try {
        const data = await BaiViet.find();

        return res.status(200).json({
            success: true,
            data,
            message: "Lấy tất cả bài viết thành công!",
        });
    } catch (error) {
        console.error("Error fetching all bai viet:", error);
        next(error);
    }
};

// Cập nhật trạng thái active/deactive
export const updateBaiVietStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const data = await BaiViet.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài viết để cập nhật trạng thái!",
            });
        }

        return res.status(200).json({
            success: true,
            data,
            message: "Cập nhật trạng thái bài viết thành công!",
        });
    } catch (error) {
        console.error("Error updating status:", error);
        next(error);
    }
};
