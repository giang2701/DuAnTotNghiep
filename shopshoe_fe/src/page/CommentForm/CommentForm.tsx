// CommentForm.tsx
import React, { useState } from "react";
import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import instance from "../../api";
import { censorComment } from "./../../../../shopshoe_be/src/utils/censor";

interface Product {
  _id: string;
  title: string;
  images: string;
  price: number;
}

interface Size {
  nameSize: string;
}

interface OrderProduct {
  product: Product;
  size: Size;
  quantity: number;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  // ... other properties
}

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
  onSizeChange: (size: string) => void;
}

const CommentFormItem = ({
  productName,
  productId,
  userId,
  size,
  rating,
  comment,
  setRating,
  setComment,
  onSubmit,
}: {
  productName: string;
  productId: string;
  userId: string;
  size: string;
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
      </Typography>
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

const CommentForm = ({
  open,
  onClose,
  selectedOrder,
  refreshAfterComment,
  onSizeChange,
}: ICommentFormProps) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user._id : null;

  const [submittedProducts, setSubmittedProducts] = useState<string[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number | null }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const handleSingleSuccess = (productId: string, size: string) => {
    setSubmittedProducts((prev) => [...prev, `${productId}-${size}`]);
  };

  const uniqueProducts = selectedOrder?.products || [];

  const submitSingleComment = async (productId: string, size: string) => {
    const rating = ratings[`${productId}-${size}`] || 0;
    const comment = comments[`${productId}-${size}`] || "";
    if (comment.length > 200) {
      toast.error("Bình luận không được vượt quá 200 ký tự.");
      return;
    }

    const sanitizedComment = censorComment(comment);
    try {
      await instance.post("/comments", {
        productId,
        userId,
        rating,
        comment: sanitizedComment,
        orderId: selectedOrder?._id,
        size,
      });
      toast.success(`Đánh giá sản phẩm thành công!`);
      onClose();
      handleSingleSuccess(productId, size);
      onSizeChange(size);

      if (submittedProducts.length === uniqueProducts.length) {
        onClose();
      }

      refreshAfterComment({
        type: "SINGLE_RATE",
        orderId: selectedOrder!._id,
        productId,
      });
    } catch (error) {
      // toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  const submitAllComments = async () => {
    for (const product of uniqueProducts) {
      const productId = product.product._id;
      const size = product.size.nameSize;
      const rating = ratings[`${productId}-${size}`] || 0;
      const comment = comments[`${productId}-${size}`] || "";
      if (comment.length > 200) {
        toast.error(
          `Bình luận cho sản phẩm "${product.product.title}" - Size: ${size} không được vượt quá 200 ký tự.`
        );
        return;
      }

      const sanitizedComment = censorComment(comment);
      try {
        await instance.post("/comments", {
          productId,
          userId,
          rating,
          comment: sanitizedComment,
          orderId: selectedOrder?._id,
          size,
        });
        toast.success(
          `Đánh giá sản phẩm "${product.product.title}" - Size: ${size} thành công!`
        );
      } catch (error) {
        toast
          .error
          // `Có lỗi xảy ra khi gửi đánh giá cho sản phẩm "${product.product.title}" - Size: ${size}. Vui lòng thử lại sau.`
          ();
        return;
      }
    }
    onClose();
    refreshAfterComment({
      type: "RATE_ALL",
      orderId: selectedOrder!._id,
    });
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
        <Typography variant="h6" component="h2">
          Viết bình luận
        </Typography>

        {uniqueProducts.map((it) => {
          const productKey = `${it.product._id}-${it.size.nameSize}`;
          if (submittedProducts.includes(productKey)) {
            return null; // Hoặc bạn có thể hiển thị thông báo "Đã đánh giá"
          }

          return (
            <CommentFormItem
              key={productKey}
              productName={it.product.title}
              productId={it.product._id}
              userId={userId!}
              size={it.size.nameSize}
              rating={ratings[`${it.product._id}-${it.size.nameSize}`] || null}
              comment={comments[`${it.product._id}-${it.size.nameSize}`] || ""}
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
                submitSingleComment(it.product._id, it.size.nameSize)
              }
            />
          );
        })}

        {/* Nút "Đánh giá tất cả sản phẩm" */}
        {uniqueProducts.length > 1 && (
          <Box display="flex" justifyContent="flex-end" marginTop="10px">
            <Button
              variant="contained"
              color="primary"
              onClick={submitAllComments}
              sx={{ textTransform: "none" }}
            >
              Đánh giá tất cả sản phẩm
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default CommentForm;
