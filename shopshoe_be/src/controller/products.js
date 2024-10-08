import Category from "../model/Category.js";
import Products from "../model/Products.js";

export const createProduct = async (req, res, next) => {
    try {
        console.log("createProduct");

        // Kiểm tra và upload ảnh danh mục (nếu có)
        let imgCategoryUrls = [];
        if (req.body.imgCategory && Array.isArray(req.body.imgCategory)) {
            // Giả sử mỗi ảnh đã được upload từ frontend và là URL hợp lệ
            imgCategoryUrls = req.body.imgCategory; // Nhận URL các ảnh danh mục từ request
        }

        // Tạo sản phẩm mới với các ảnh danh mục
        const data = await Products.create({
            ...req.body,
            imgCategory: imgCategoryUrls, // Lưu URL các ảnh danh mục vào DB
        });

        // Cập nhật danh mục liên quan
        const updateCategory = await Category.findByIdAndUpdate(
            req.body.category,
            { $push: { products: data._id } },
            { new: true }
        );

        if (data && updateCategory) {
            return res.status(201).json({
                success: true,
                data,
                message: "Tạo sản phẩm thành công!",
            });
        }
    } catch (error) {
        console.error("Error creating product:", error);
        next(error);
    }
};

export const updateProductById = async (req, res, next) => {
    try {
        // // Kiểm tra và lưu đường dẫn file ảnh vào cơ sở dữ liệu
        // if (req.file) {
        //     req.body.images = req.file.path; // Lưu đường dẫn của tệp hình ảnh
        // }
        const data = await Products.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (data) {
            return res.status(200).json({
                message: "Update san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const removeProductById = async (req, res, next) => {
    try {
        const data = await Products.findByIdAndDelete(req.params.id);
        if (data) {
            return res.status(200).json({
                message: "Remove san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const data = await Products.findById(req.params.id).populate(
            "category"
        );
        if (data) {
            return res.status(200).json({
                message: "Tim san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllProducts = async (req, res, next) => {
    try {
        const data = await Products.find().populate("category");
        if (data) {
            return res.status(200).json({
                message: "Lay san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};
