import Category from "../model/Category.js";
import Products from "../model/Products.js";
import Older from "../model/Older.js";

export const createProduct = async (req, res, next) => {
  try {
    console.log("createProduct");
    console.log("Request Body:", req.body);
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
      sizes: req.body.sizes,
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
    console.log(req.body);
    const data = await Products.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        sizes: req.body.sizes, // Cập nhật lại mảng sizes từ body
      },
      {
        new: true,
      }
    );

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
    const orderProducts = await Older.find({
      products: { $elemMatch: { product: req.params.id } },
    });

    console.log(orderProducts);
    // Kiểm tra nếu có đơn hàng đang sử dụng sản phẩm này
    if (orderProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa sản phẩm vì đang được sử dụng trong đơn hàng!",
      });
    }

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
    const data = await Products.findById(req.params.id)
      .populate("category")
      .populate("brand");
    // console.log(data);
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
export const getProductByIdSize = async (req, res, next) => {
  try {
    const data = await Products.findById(req.params.id)
      .populate("sizeStock.size") // đảm bảo tên đúng và có mô hình tương ứng
      .exec();

    if (!data) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Tìm sản phẩm thành công!",
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllProducts = async (req, res, next) => {
  try {
    const data = await Products.find().populate("category").populate("brand");
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
