import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import { Order } from "../../interface/Order";
import { useState } from "react";
import { toast } from "react-toastify";
import instance from "../../api";
import { censorComment } from "./../../../../shopshoe_be/src/utils/censor";

// Component đánh giá từng sản phẩm (đã được cập nhật)
const CommentFormItem = ({
  productName,
  productId,
  userId,
  size, // Thêm prop size
  rating,
  comment,
  setRating,
  setComment,
  onSubmit,
}: {
  productName: string;
  productId: string;
  userId: string;
  size: string; // Thêm kiểu dữ liệu cho size
  rating: number | null;
  comment: string;
  setRating: (rating: number | null) => void;
  setComment: (comment: string) => void;
  onSubmit: VoidFunction;
}) => {
  return (
    <Box marginBottom="12px">
      <Typography>
        {productName} - Size: {size}
      </Typography>{" "}
      {/* Hiển thị size */}
      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        sx={{ marginBottom: "10px" }}
      />
      <TextField
        label="Viết bình luận..."
        multiline
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: "10px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSubmit}
        sx={{ textTransform: "none" }}
      >
        Đánh giá sản phẩm
      </Button>
    </Box>
  );
};

// Component chính
interface ICommentFormProps {
  open: boolean;
  onClose: VoidFunction;
  selectedOrder: Order | null;
  refreshAfterComment: ({
    type,
    productId,
    orderId,
  }: {
    type: "SINGLE_RATE" | "RATE_ALL";
    productId?: string;
    orderId: string;
  }) => void;
}

const CommentForm = ({
  open,
  onClose,
  selectedOrder,
  refreshAfterComment,
}: ICommentFormProps) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user._id : null;

  const [submittedProducts, setSubmittedProducts] = useState<string[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number | null }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  // Cập nhật trạng thái khi đánh giá thành công
  const handleSingleSuccess = (productId: string, size: string) => {
    setSubmittedProducts((prev) => [...prev, `${productId}-${size}`]);
  };

  // Không lọc sản phẩm trùng lặp
  const uniqueProducts = selectedOrder?.products || [];

  // Submit a single comment (đã được cập nhật)
  const submitSingleComment = async (productId: string, size: string) => {
    const rating = ratings[`${productId}-${size}`] || 0;
    const comment = comments[`${productId}-${size}`] || "";
    if (comment.length > 200) {
      toast.error("Bình luận không được vượt quá 200 ký tự.");
      return;
    }

    // Kiểm duyệt bình luận trước khi gửi
    const sanitizedComment = censorComment(comment);
    try {
      await instance.post("/comments", {
        productId,
        userId,
        rating,
        comment: sanitizedComment,
        orderId: selectedOrder?._id,
        size, // Gửi size đến API
      });
      toast.success(`Đánh giá sản phẩm thành công!`);
      handleSingleSuccess(productId, size);
      onClose();
      refreshAfterComment({
        type: "SINGLE_RATE",
        orderId: selectedOrder!._id,
        productId,
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  // Submit all comments (cần được cập nhật)
  const submitAllComments = async () => {
    for (const product of uniqueProducts) {
      const productId = product.product._id;
      const size = product.size.nameSize; // Lấy size từ product
      const rating = ratings[`${productId}-${size}`] || 0; // Lấy rating theo productId và size
      const comment = comments[`${productId}-${size}`] || ""; // Lấy comment theo productId và size
      if (comment.length > 200) {
        toast.error(
          `Bình luận cho sản phẩm "${product.product.title}" - Size: ${size} không được vượt quá 200 ký tự.`
        );
        return;
      }

      // Kiểm duyệt bình luận trước khi gửi
      const sanitizedComment = censorComment(comment);
      try {
        await instance.post("/comments", {
          productId,
          userId,
          rating,
          comment: sanitizedComment,
          orderId: selectedOrder?._id,
          size, // Gửi size đến API
        });
        toast.success(
          `Đánh giá sản phẩm "${product.product.title}" - Size: ${size} thành công!`
        );
      } catch (error) {
        toast.error(
          `Có lỗi xảy ra khi gửi đánh giá cho sản phẩm "${product.product.title}" - Size: ${size}. Vui lòng thử lại sau.`
        );
        return;
      }
    }
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 999,
          cursor: "pointer",
        }}
        onClick={onClose}
      ></div>
      {/* Form Popup */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          zIndex: 1000,
          minWidth: "300px",
          border: "2px solid #ccc",
        }}
      >
        <Typography
          variant="h6"
          sx={{ marginBottom: "10px", fontWeight: "bold" }}
        >
          Viết bình luận
        </Typography>

        {uniqueProducts.map((it) => (
          <CommentFormItem
            key={`${it.product._id}-${it.size.nameSize}`} // Sử dụng key kết hợp productId và size
            productName={it.product.title}
            productId={it.product._id!}
            userId={userId}
            size={it.size.nameSize} // Truyền size vào CommentFormItem
            rating={ratings[`${it.product._id}-${it.size.nameSize}`] || 0} // Lưu rating theo productId và size
            comment={comments[`${it.product._id}-${it.size.nameSize}`] || ""} // Lưu comment theo productId và size
            setRating={(rating) =>
              setRatings((prev) => ({
                ...prev,
                [`${it.product._id}-${it.size.nameSize}`]: rating,
              }))
            }
            setComment={(comment) =>
              setComments((prev) => ({
                ...prev,
                [`${it.product._id}-${it.size.nameSize}`]: comment,
              }))
            }
            onSubmit={() =>
              submitSingleComment(it.product._id!, it.size.nameSize)
            } // Truyền size vào hàm submit
          />
        ))}

        {/* Conditionally render the "Rate All Products" button */}
        {uniqueProducts.length > 1 && (
          <Box display="flex" justifyContent="space-between" marginTop="10px">
            <Button
              variant="contained"
              color="primary"
              onClick={submitAllComments}
              sx={{ textTransform: "none" }}
            >
              Đánh giá tất cả sản phẩm
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{ textTransform: "none" }}
            >
              Đóng
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default CommentForm;
