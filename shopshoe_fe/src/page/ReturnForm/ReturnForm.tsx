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

    // State cho lỗi validate
    const [reasonError, setReasonError] = useState<string | null>(null);
    const [imagesError, setImagesError] = useState<string | null>(null);
    const [videosError, setVideosError] = useState<string | null>(null);
    const [userNameError, setUserNameError] = useState<string | null>(null);
    const [userPhoneError, setUserPhoneError] = useState<string | null>(null);

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

        // Validate lý do
        if (reason.trim() === "") {
            setReasonError("Vui lòng nhập lý do hoàn trả.");
        } else {
            setReasonError(null);
        }
        // Validate hình ảnh (nếu có)
        if (images.length === 0) {
            setImagesError("Vui lòng chọn ít nhất một hình ảnh.");
        } else if (images.length > 5) {
            setImagesError("Chỉ được chọn tối đa 5 hình ảnh.");
        } else {
            setImagesError(null);
        }

        // Validate video (nếu có)
        if (videos.length === 0) {
            setVideosError("Vui lòng chọn ít nhất một video.");
        } else if (videos.length > 2) {
            setVideosError("Chỉ được chọn tối đa 2 video.");
        } else {
            setVideosError(null);
        }

        // Validate tên người dùng
        if (userName.trim() === "") {
            setUserNameError("Vui lòng nhập tên người dùng.");
        } else {
            setUserNameError(null);
        }

        // Validate số điện thoại
        if (userPhone.trim() === "" || !/^\d{10}$/.test(userPhone)) {
            // Kiểm tra số điện thoại có 10 chữ số
            setUserPhoneError("Vui lòng nhập số điện thoại hợp lệ.");
        } else {
            setUserPhoneError(null);
        }

        // Kiểm tra nếu có bất kỳ lỗi nào
        if (
            reasonError ||
            imagesError ||
            videosError ||
            userNameError ||
            userPhoneError ||
            images.length === 0 ||
            videos.length === 0
        ) {
            return; // Dừng gửi yêu cầu nếu có lỗi
        }

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
                    errorData.message ||
                        "Có lỗi xảy ra khi gửi yêu cầu hoàn trả."
                );
            }
        } catch (error: any) {
            setError(
                error.message || "Có lỗi xảy ra khi gửi yêu cầu hoàn trả."
            );
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
            // Reset lỗi validate khi đóng form
            setReasonError(null);
            setImagesError(null);
            setVideosError(null);
            setUserNameError(null);
            setUserPhoneError(null);
        } else {
            setUserName(order?.userId.name || "");
            setUserPhone(order?.userId.phone || "");
        }
    }, [open, order]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: "20px" }}
                >
                    Yêu Cầu Hoàn Trả Đơn Hàng
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                {error && (
                    <Typography color="error" paragraph>
                        {error}
                    </Typography>
                )}
                {/* Hiển thị lỗi tên người dùng */}
                {userNameError && (
                    <Typography color="error" paragraph>
                        {userNameError}
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
                    error={!!userNameError} // Thêm error prop cho TextField
                    helperText={userNameError} // Hiển thị thông báo lỗi
                />
                {/* Hiển thị lỗi số điện thoại */}
                {userPhoneError && (
                    <Typography color="error" paragraph>
                        {userPhoneError}
                    </Typography>
                )}
                <TextField
                    margin="dense"
                    id="userPhone"
                    label="Số Điện Thoại"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={userPhone}
                    onChange={handlePhoneChange}
                    error={!!userPhoneError} // Thêm error prop cho TextField
                    helperText={userPhoneError} // Hiển thị thông báo lỗi
                />
                {/* Hiển thị lỗi lý do */}
                {reasonError && (
                    <Typography color="error" paragraph>
                        {reasonError}
                    </Typography>
                )}
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
                    error={!!reasonError} // Thêm error prop cho TextField
                    helperText={reasonError} // Hiển thị thông báo lỗi
                />

                <Box mt={2}>
                    <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontSize: "15px" }}
                    >
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
                    <Typography
                        variant="caption"
                        display="inline"
                        sx={{ fontSize: "15px" }}
                    >
                        {images.length > 0
                            ? `${images.length} ảnh đã chọn`
                            : "Chọn ảnh"}
                    </Typography>
                    {/* Hiển thị lỗi hình ảnh */}
                    {imagesError && (
                        <Typography
                            color="error"
                            variant="caption"
                            display="block"
                        >
                            {imagesError}
                        </Typography>
                    )}
                </Box>
                <Box mt={2}>
                    <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontSize: "15px" }}
                    >
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
                    <Typography
                        variant="caption"
                        display="inline"
                        sx={{ fontSize: "15px" }}
                    >
                        {videos.length > 0
                            ? `${videos.length} video đã chọn`
                            : "Chọn video"}
                    </Typography>
                    {/* Hiển thị lỗi video */}
                    {videosError && (
                        <Typography
                            color="error"
                            variant="caption"
                            display="block"
                        >
                            {videosError}
                        </Typography>
                    )}
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
