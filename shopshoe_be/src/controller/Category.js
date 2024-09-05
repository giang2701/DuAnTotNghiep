import slugify from "slugify";
import Category from "../model/Category.js";
import Products from "../model/Products.js";

export const createCategory = async (req, res, next) => {
    try {
        const slug = slugify(req.body.title, {
            replacement: "-",
            lower: true,
            strict: true,
            locale: "vi",
            trim: true,
        });
        console.log(slug);
        const data = await Category.create({ ...req.body, slug });
        if (data) {
            return res.status(201).json({
                success: true,
                data,
                message: "Tao danh muc thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateCategoryById = async (req, res, next) => {
    try {
        const data = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        // findByIdAndUpdate = patch;
        // findByIdAndReplace = put;
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Update danh muc thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const removeCategoryById = async (req, res, next) => {
    try {
        const defaultCategoryId = "66add3f79957be752707a054"; // Thêm dòng này để định nghĩa ID của danh mục mặc định

        // Kiểm tra nếu danh mục là danh mục mặc định
        // Sửa req.param.id thành req.params.id
        if (req.params.id === defaultCategoryId) {
            return res.status(400).json({
                message: "Không xóa được danh mục mặc định", // Sửa lỗi chính tả trong thông báo
                success: false,
            });
        }

        // Xóa danh mục
        const data = await Category.findByIdAndDelete(req.params.id);

        // Chuyển toàn bộ sản phẩm thuộc danh mục bị xóa về danh mục mặc định
        if (data) {
            // Thêm điều kiện kiểm tra nếu danh mục tồn tại và đã được xóa
            const productsToUpdate = await Products.find({
                category: req.params.id,
            });

            await Promise.all(
                productsToUpdate.map(async (product) => {
                    product.category = defaultCategoryId; // Sửa dòng này để sử dụng defaultCategoryId đã định nghĩa
                    await product.save();
                })
            );

            return res.status(200).json({
                success: true,
                data,
                message: "Xóa danh mục thành công!", // Sửa lỗi chính tả trong thông báo
            });
        } else {
            // Thêm khối else để xử lý trường hợp danh mục không tồn tại
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        console.log("alo");
        const data = await Category.findById(req.params.id).populate(
            "products"
        );
        console.log(data);
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Tim danh muc thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllCategorys = async (req, res, next) => {
    try {
        const data = await Category.find();
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Lay danh muc thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};
