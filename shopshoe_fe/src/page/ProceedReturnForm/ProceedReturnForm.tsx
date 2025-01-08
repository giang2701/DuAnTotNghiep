import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
} from "@mui/material";
import { Order } from "../../interface/Order";
import { toast } from "react-toastify";
import instance from "../../api";

interface Props {
    open: boolean;
    onClose: () => void;
    order: Order | null; // Thêm prop order
    refreshAfterProceedReturn: () => void;
}

const ProceedReturnForm: React.FC<Props> = ({
    open,
    onClose,
    order,
    refreshAfterProceedReturn,
}) => {
    const [selectedValue, setSelectedValue] = useState("a");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue((event.target as HTMLInputElement).value);
    };
    const handleConfirm = async () => {
        try {
            console.log(order);
            if (!order || !order.return?._id) return; // Kiểm tra order và returnId

            // Gọi API để cập nhật trạng thái hoàn trả
            await instance.patch(`/returns/${order.return._id}/status`, {
                status: "Đang hoàn hàng",
            });
            toast.success(
                "Đã cập nhật trạng thái hoàn trả sang 'Đang hoàn hàng'"
            );

            // Refresh lại danh sách đơn hàng trong HistoryOrders
            refreshAfterProceedReturn();

            onClose();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái hoàn trả:", error);
            toast.error("Lỗi khi cập nhật trạng thái hoàn trả.");
        }
    };

    if (!open) return null;
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography
                    variant="h6"
                    component="div"
                    align="center"
                    style={{ textTransform: "capitalize" }}
                    sx={{ fontSize: "15px" }}
                >
                    hình thức trả hàng Zukong
                </Typography>
            </DialogTitle>
            <DialogContent dividers className="dialog-content">
                <Box>
                    <FormControl>
                        <FormLabel
                            id="demo-radio-buttons-group-label"
                            sx={{ fontSize: "15px" }}
                        >
                            Hình thức
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={selectedValue}
                            onChange={handleChange}
                        >
                            {/* <FormControlLabel
                                value="a"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle1">
                                            Lấy hàng hoàn trả theo địa chỉ yêu
                                            cầu
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            (Miễn phí trả hàng)
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 1: Chọn thời gian và
                                                    địa chỉ lấy hàng
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 2: Đóng gói hàng trong
                                                    hộp vận chuyển
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 3: Dán phiếu gửi hàng
                                                    hoặc viết tay trực tiếp mã
                                                    vận đơn được Zukong cung cấp
                                                    lên hộp vận chuyển
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 4: Đơn vị vận chuyển sẽ
                                                    đến lấy hàng theo địa chỉ và
                                                    thời gian đã chọn
                                                </Typography>
                                            </li>
                                        </ul>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value="b"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle1">
                                            Trả hàng tại bưu cục
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            (Miễn phí trả hàng)
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 1: Chọn một trong đơn
                                                    vị vận chuyển
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 2: Đóng gói hàng trong
                                                    hộp vận chuyển
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 3: Dán phiếu gửi hàng
                                                    hoặc viết tay trực tiếp mã
                                                    vận đơn được Zukong cung cấp
                                                    lên hộp vận chuyển
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body2">
                                                    Bước 4: Đem gói hàng tới gửi
                                                    trả tại bưu cục đã chọn.
                                                </Typography>
                                            </li>
                                        </ul>
                                    </Box>
                                }
                            /> */}
                            <FormControlLabel
                                value="c"
                                control={<Radio />}
                                label={
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontSize: "15px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            Tự sắp xếp
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: "15px",
                                                        color: "black",
                                                    }}
                                                >
                                                    Bước 1: Đóng gói hàng
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: "15px",
                                                        color: "black",
                                                    }}
                                                >
                                                    Bước 2: Mang hàng đến bưu
                                                    cục bất kỳ để gửi trả theo
                                                    địa chỉ Zukong cung cấp
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: "15px",
                                                        color: "black",
                                                    }}
                                                >
                                                    Bước 3: Bạn cần thanh toán
                                                    trước phí trả hàng. Zukong
                                                    sẽ hoàn lại bạn khoản phí
                                                    này theo{""}
                                                    <a
                                                        href="/contact" // Thay thế bằng link chính sách của Shopee
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Chính sách hỗ trợ phí
                                                        trả hàng
                                                    </a>
                                                    {""}
                                                    bằng hình thức hoàn Zukong.
                                                </Typography>
                                            </li>
                                        </ul>
                                    </Box>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} variant="outlined" color="primary">
                    Hủy bỏ
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProceedReturnForm;
