import Size from "../model/Size.js";

export const getAllSize = async (req, res, next) => {
    try {
        const data = await Size.find();
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Lay size thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};
export const CreateSize = async (req, res, next) => {
    try {
        const data = await Size.create(req.body);
        if (data) {
            return res.status(201).json({
                success: true,
                data,
                message: "Tao size thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};
export const UpdateSize = async (req, res, next) => {
    try {
        const data = await Size.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Update size thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};
export const DeleteSize = async (req, res, next) => {
    try {
        const data = await Size.findByIdAndDelete(req.params.id);
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Xoa size thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};
export const getSizeById = async (req, res, next) => {
    try {
        const data = await Size.findById(req.params.id);
        console.log(data);
        if (data) {
            return res.status(200).json({
                success: true,
                data,
                message: "Tim size thanh cong!",
            });
        }
    } catch (error) {
        next(error);
    }
};
