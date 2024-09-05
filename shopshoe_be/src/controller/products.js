import Category from "../model/Category.js";
import Products from "../model/Products.js";

export const createProduct = async (req, res, next) => {
    try {
        console.log("createProduct");
        const data = await Products.create(req.body);
        console.log(data);
        // // Kiểm tra và lưu đường dẫn file ảnh vào cơ sở dữ liệu
        // if (req.file) {
        //     req.body.images = req.file.path; // Lưu đường dẫn của tệp hình ảnh
        // }
        const updateCategory = await Category.findByIdAndUpdate(
            req.body.category,
            {
                $push: { products: data._id },
            },
            { new: true }
        );
        if (data && updateCategory) {
            return res.status(201).json({
                success: true,
                data,
                message: "Tao san pham thanh cong!",
            });
        }
    } catch (error) {
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
