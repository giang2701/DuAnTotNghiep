import Comment from "../model/Comment.js";
import { censorComment } from "../utils/censor.js";
export const createComment = async (req, res) => {
  try {
    const { productId, userId, rating, comment, orderId } = req.body;

    const sanitizedComment = censorComment(comment);

    const newComment = new Comment({
      productId,
      userId,
      rating,
      comment: sanitizedComment,
      hidden: true,
      orderId,
    });

    await newComment.save();

    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Có lỗi xảy ra." });
  }
};

export const getCommentsByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.find({ productId })
      .populate("userId", "username")
      .sort({ createdAt: -1 }); // Sắp xếp giảm dần theo `createdAt`
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "username")
      .populate("productId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.log("Lỗi khi lấy tất cả bình luận:", error);
    next(error);
  }
};

// Trong commentController.js
export const hideComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { hidden } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { hidden },
      { new: true }
    );

    if (!updatedComment) {
      return res
        .status(404)
        .json({ success: false, message: "Bình luận không tồn tại." });
    }

    res.status(200).json({
      success: true,
      message: `Bình luận đã được ${hidden ? "hiện" : "ẩn"}.`,
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};
