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
import { PhotoCamera } from "@mui/icons-material";
import { Order } from "../../interface/Order";
import { toast } from "react-toastify";
import instance from "../../api";

interface RefundFormProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  refreshAfterRefund: (data: any) => void;
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

  // State cho lỗi validate
  const [bankNameError, setBankNameError] = useState<string | null>(null);
  const [accountNumberError, setAccountNumberError] = useState<string | null>(
    null
  );
  const [accountNameError, setAccountNameError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [qrCodeImageError, setQrCodeImageError] = useState<string | null>(null);

  // Các hàm xử lý sự kiện cho các trường input
  const handleBankNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setQrCodeImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!order) return;

    // Validate tên ngân hàng
    if (bankName.trim() === "") {
      setBankNameError("Vui lòng nhập tên ngân hàng.");
    } else {
      setBankNameError(null);
    }

    // Validate số tài khoản
    if (accountNumber.trim() === "") {
      setAccountNumberError("Vui lòng nhập số tài khoản.");
    } else {
      setAccountNumberError(null);
    }

    // Validate tên tài khoản
    if (accountName.trim() === "") {
      setAccountNameError("Vui lòng nhập tên tài khoản.");
    } else {
      setAccountNameError(null);
    }

    // Validate số điện thoại
    if (phoneNumber.trim() === "" || !/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Vui lòng nhập số điện thoại hợp lệ.");
    } else {
      setPhoneNumberError(null);
    }

    // Validate ảnh QR code
    if (!qrCodeImage) {
      setQrCodeImageError("Vui lòng chọn ảnh QR code.");
    } else {
      setQrCodeImageError(null);
    }

    // Kiểm tra nếu có bất kỳ lỗi nào
    if (
      bankNameError ||
      accountNumberError ||
      accountNameError ||
      phoneNumberError ||
      qrCodeImageError
    ) {
      return; // Dừng gửi yêu cầu nếu có lỗi
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
      } else {
        setError(
          response.data.message || "Có lỗi xảy ra khi gửi yêu cầu hoàn tiền."
        );
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi gửi yêu cầu hoàn tiền.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      // Reset form fields khi đóng dialog
      setBankName("");
      setAccountNumber("");
      setAccountName("");
      setPhoneNumber("");
      setQrCodeImage(null);
      setError(null);
      // Reset lỗi validate khi đóng form
      setBankNameError(null);
      setAccountNumberError(null);
      setAccountNameError(null);
      setPhoneNumberError(null);
      setQrCodeImageError(null);
    } else {
      // Có thể lấy thông tin user từ order để điền sẵn vào form
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
        {/* Hiển thị lỗi tên ngân hàng */}
        {bankNameError && (
          <Typography color="error" paragraph>
            {bankNameError}
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
          error={!!bankNameError} // Thêm error prop cho TextField
          helperText={bankNameError} // Hiển thị thông báo lỗi
        />
        {/* Hiển thị lỗi số tài khoản */}
        {accountNumberError && (
          <Typography color="error" paragraph>
            {accountNumberError}
          </Typography>
        )}
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
        {/* Hiển thị lỗi tên tài khoản */}
        {accountNameError && (
          <Typography color="error" paragraph>
            {accountNameError}
          </Typography>
        )}
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
        {/* Hiển thị lỗi số điện thoại */}
        {phoneNumberError && (
          <Typography color="error" paragraph>
            {phoneNumberError}
          </Typography>
        )}
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
          {/* Hiển thị lỗi ảnh QR code */}
          {qrCodeImageError && (
            <Typography color="error" variant="caption" display="block">
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
