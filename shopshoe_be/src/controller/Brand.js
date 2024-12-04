import Brand from "../model/Brand.js";

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
                message: "Update thuong hieu thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteBrandById = async (req, res, next) => {
    try {
        const data = await Brand.findByIdAndDelete(req.params.id);
        if (data) {
            return res.status(200).json({
                message: "Xoa thuong hieu thanh cong!",
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
                message: "Tim thuong hieu thanh cong!",
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
