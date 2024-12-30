import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { PhotoCamera, VideoLibrary } from "@mui/icons-material";
import { Order } from "../../interface/Order";
import { toast } from "react-toastify";
import instance from "../../api";

interface ReturnFormProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  refreshAfterReturn: (data: any) => void;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const ReturnForm: React.FC<ReturnFormProps> = ({
  open,
  onClose,
  order,
  refreshAfterReturn,
}) => {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("Pending");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(0, 5);
      setImages(files);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(0, 2);
      setVideos(files);
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPhone(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("orderId", order?._id ?? "");
      formData.append("userId", order.userId);

      formData.append("userName", userName ?? "");
      formData.append("userPhone", userPhone ?? "");
      formData.append("reason", reason);
      formData.append("status", status);

      images.forEach((image) => {
        formData.append("images", image);
      });

      videos.forEach((video) => {
        formData.append("videos", video);
      });

      const response = await instance.post("/returns", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        const data = response.data;
        onClose();
        await refreshAfterReturn(data);
        toast.success("Yêu cầu hoàn trả đã được gửi thành công!");
      } else {
        const errorData = response.data;
        setError(
          errorData.message || "Có lỗi xảy ra khi gửi yêu cầu hoàn trả."
        );
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi gửi yêu cầu hoàn trả.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setReason("");
      setStatus("Đang chờ xử lý");
      setImages([]);
      setVideos([]);
      setError(null);
      setUserName("");
      setUserPhone("");
    } else {
      setUserName(order?.userId.name || "");
      setUserPhone(order?.userId.phone || "");
    }
  }, [open, order]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" component="div">
          Yêu Cầu Hoàn Trả Đơn Hàng
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" paragraph>
            {error}
          </Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="orderId"
          label="ID Đơn Hàng"
          type="text"
          fullWidth
          variant="outlined"
          value={order?._id || ""}
          disabled
        />
        <TextField
          margin="dense"
          id="userName"
          label="Tên Người Dùng"
          type="text"
          fullWidth
          variant="outlined"
          value={userName}
          onChange={handleNameChange}
        />
        <TextField
          margin="dense"
          id="userPhone"
          label="Số Điện Thoại"
          type="tel"
          fullWidth
          variant="outlined"
          value={userPhone}
          onChange={handlePhoneChange}
        />
        <TextField
          margin="dense"
          id="reason"
          label="Lý Do Hoàn Trả"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={7}
          value={reason}
          onChange={handleReasonChange}
        />

        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Hình ảnh:
          </Typography>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="images-upload"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="images-upload">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography variant="caption" display="inline">
            {images.length > 0 ? `${images.length} ảnh đã chọn` : "Chọn ảnh"}
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Video:
          </Typography>
          <input
            accept="video/*"
            style={{ display: "none" }}
            id="videos-upload"
            multiple
            type="file"
            onChange={handleVideoChange}
          />
          <label htmlFor="videos-upload">
            <IconButton
              color="primary"
              aria-label="upload video"
              component="span"
            >
              <VideoLibrary />
            </IconButton>
          </label>
          <Typography variant="caption" display="inline">
            {videos.length > 0
              ? `${videos.length} video đã chọn`
              : "Chọn video"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          Gửi Yêu Cầu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnForm;
