import User from "../model/User.js";
export const getAllUser = async (req, res, next) => {
  try {
    const data = await User.find();
    console.log(data);
    if (data) {
      return res.status(200).json({
        message: "Lay danh sach thanh cong",
        success: true,
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};
export const updateUserById = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("Day la id:", req.params.id);
    if (data) {
      return res.status(200).json({
        message: "Update thong tin nguoi dung thanh cong",
        success: true,
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};
export const deleteUserById = async (req, res, next) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    if (data) {
      return res.status(200).json({
        message: "Xoa thong tin nguoi dung thanh cong",
        success: true,
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};
