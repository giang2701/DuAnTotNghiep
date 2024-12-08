import Products from "../model/Products.js";
import Size from "../model/Size.js";

export const getAllSize = async (req, res, next) => {
  try {
    const data = await Size.find().populate("products");
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
    // Tìm tất cả sản phẩm có sử dụng size này
    const linkedProducts = await Products.find({
      sizeStock: { $elemMatch: { size: req.params.id } },
    });
    console.log(linkedProducts);

    // Kiểm tra nếu có sản phẩm đang sử dụng size này
    if (linkedProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa size vì đang được sử dụng trong sản phẩm!",
      });
    }

    // Thực hiện xóa size
    const size = await Size.findByIdAndDelete(req.params.id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: "Size không tồn tại!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa size thành công!",
    });
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
