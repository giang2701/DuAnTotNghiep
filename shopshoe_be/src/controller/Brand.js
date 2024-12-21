import Brand from "../model/Brand.js";
import Products from "../model/Products.js";

export const createBrand = async (req, res, next) => {
    try {
        const data = await Brand.create(req.body);
        if (data) {
            return res.status(201).json({
                success: true,
                data,
                message: "Tao thuong hieu thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateBrandById = async (req, res, next) => {
    try {
        const data = await Brand.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Update thương hiệu thành công!",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteBrandById = async (req, res, next) => {
    try {
        // Tìm tất cả sản phẩm có sử dụng size này
        const BrandProducts = await Products.find({
            brand: req.params.id,
        });
        console.log(BrandProducts);

        // Kiểm tra nếu có sản phẩm đang sử dụng size này
        if (BrandProducts.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Không thể xóa brand  vì đang được sử dụng trong sản phẩm!",
            });
        }
        const data = await Brand.findByIdAndDelete(req.params.id);
        if (data) {
            return res.status(200).json({
                message: "Xóa thương hiệu thành công!",
            });
        }
    } catch (error) {
        next(error);
    }
};
export const getBrandById = async (req, res, next) => {
    try {
        const data = await Brand.findById(req.params.id).populate("products");
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Tìm thương hiệu thành công!",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllBrand = async (req, res, next) => {
    try {
        const data = await Brand.find();
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
