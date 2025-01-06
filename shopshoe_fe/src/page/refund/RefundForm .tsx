import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
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
import { PhotoCamera } from "@mui/icons-material";
import { Order } from "../../interface/Order";
import { toast } from "react-toastify";
import instance from "../../api";

interface RefundFormProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
    refreshAfterRefund: (data: any) => void;

    isRefundRequested: { [key: string]: boolean };

    setIsRefundRequested: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

const RefundForm: React.FC<RefundFormProps> = ({
    open,
    onClose,
    order,
    refreshAfterRefund,
}) => {
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [qrCodeImage, setQrCodeImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRefundRequested, setIsRefundRequested] = useState<{
        [key: string]: boolean;
    }>({});

    const [bankNameError, setBankNameError] = useState<string | null>(null);
    const [accountNumberError, setAccountNumberError] = useState<string | null>(
        null
    );
    const [accountNameError, setAccountNameError] = useState<string | null>(
        null
    );
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(
        null
    );
    const [qrCodeImageError, setQrCodeImageError] = useState<string | null>(
        null
    );

    const handleBankNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setBankName(event.target.value);
    };

    const handleAccountNumberChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAccountNumber(event.target.value);
    };

    const handleAccountNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAccountName(event.target.value);
    };

    const handlePhoneNumberChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPhoneNumber(event.target.value);
    };

    const handleQrCodeImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

            if (allowedTypes.includes(file.type)) {
                setQrCodeImage(file);
                setQrCodeImageError(null);
            } else {
                setQrCodeImage(null);
                setQrCodeImageError(
                    "Vui lòng chọn file ảnh (JPEG, PNG) hoặc video (MP4)."
                );
            }
        }
    };

    const handleSubmit = async () => {
        if (!order) return;

        if (bankName.trim() === "") {
            setBankNameError("Vui lòng nhập tên ngân hàng.");
        } else {
            setBankNameError(null);
        }

        if (accountNumber.trim() === "") {
            setAccountNumberError("Vui lòng nhập số tài khoản.");
        } else {
            setAccountNumberError(null);
        }

        if (accountName.trim() === "") {
            setAccountNameError("Vui lòng nhập tên tài khoản.");
        } else {
            setAccountNameError(null);
        }

        if (phoneNumber.trim() === "" || !/^\d{10}$/.test(phoneNumber)) {
            setPhoneNumberError("Vui lòng nhập số điện thoại hợp lệ.");
        } else {
            setPhoneNumberError(null);
        }

        if (!qrCodeImage) {
            setQrCodeImageError("Vui lòng chọn ảnh QR code.");
        } else {
            setQrCodeImageError(null);
        }

        if (
            bankNameError ||
            accountNumberError ||
            accountNameError ||
            phoneNumberError ||
            !qrCodeImage
        ) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("orderId", order._id);
            formData.append("userId", order.userId);
            formData.append("bankName", bankName);
            formData.append("accountNumber", accountNumber);
            formData.append("accountName", accountName);
            formData.append("phoneNumber", phoneNumber);
            if (qrCodeImage) {
                formData.append("qrCodeImage", qrCodeImage);
            }

            const response = await instance.post("/refunds", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                onClose();
                await refreshAfterRefund(response.data);
                toast.success("Yêu cầu hoàn tiền đã được gửi thành công!");
                setIsRefundRequested({
                    ...isRefundRequested,
                    [order._id]: true,
                });
            } else {
                setError(
                    response.data.message ||
                        "Có lỗi xảy ra khi gửi yêu cầu hoàn tiền."
                );
            }
        } catch (error: any) {
            setError(
                error.message || "Có lỗi xảy ra khi gửi yêu cầu hoàn tiền."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) {
            setBankName("");
            setAccountNumber("");
            setAccountName("");
            setPhoneNumber("");
            setQrCodeImage(null);
            setError(null);

            setBankNameError(null);
            setAccountNumberError(null);
            setAccountNameError(null);
            setPhoneNumberError(null);
            setQrCodeImageError(null);
        } else {
            setAccountName(order?.userId.name || "");
            setPhoneNumber(order?.userId.phone || "");
        }
    }, [open, order]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h6" component="div">
                    Yêu Cầu Hoàn Tiền
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
                    id="bankName"
                    label="Tên Ngân Hàng"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={bankName}
                    onChange={handleBankNameChange}
                    error={!!bankNameError}
                    helperText={bankNameError}
                />
                <TextField
                    margin="dense"
                    id="accountNumber"
                    label="Số Tài Khoản"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    error={!!accountNumberError}
                    helperText={accountNumberError}
                />
                <TextField
                    margin="dense"
                    id="accountName"
                    label="Tên Tài Khoản"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={accountName}
                    onChange={handleAccountNameChange}
                    error={!!accountNameError}
                    helperText={accountNameError}
                />
                <TextField
                    margin="dense"
                    id="phoneNumber"
                    label="Số Điện Thoại"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    error={!!phoneNumberError}
                    helperText={phoneNumberError}
                />
                <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                        Ảnh QR Code Ngân Hàng:
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="qr-code-image-upload"
                        type="file"
                        onChange={handleQrCodeImageChange}
                    />
                    <label htmlFor="qr-code-image-upload">
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                        >
                            <PhotoCamera />
                        </IconButton>
                    </label>
                    {qrCodeImage && (
                        <Typography variant="caption" display="inline">
                            {qrCodeImage.name}
                        </Typography>
                    )}
                    {qrCodeImageError && (
                        <Typography
                            color="error"
                            variant="caption"
                            display="block"
                        >
                            {qrCodeImageError}
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

export default RefundForm;
