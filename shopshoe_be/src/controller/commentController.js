import Comment from "../model/Comment.js";
export const createComment = async (req, res, next) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    const newComment = await Comment.create({
      productId,
      userId,
      rating,
      comment,
    });
    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    console.log(error);
    next(error);
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

export const updateCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
