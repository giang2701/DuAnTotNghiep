import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation } from "react-router-dom";

const PaymentSuccessPage = () => {
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };

    const location = useLocation();
    const { _id, totalPrice, paymentMethod } = location.state || {};
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="90vh"
        >
            <Card
                sx={{
                    width: "450px",
                    textAlign: "center",
                    paddingLeft: "12px",
                    boxShadow: "4px 4px 10px #C0C0C0",
                    marginTop: 15,
                    // backgroundColor: "red",
                }}
            >
                <CardContent>
                    <CheckCircleIcon
                        sx={{ fontSize: 100, color: "green", marginBottom: 2 }}
                    />
                    <Typography variant="h6" sx={{ fontSize: 25 }} gutterBottom>
                        Đặt hàng thành công!
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ fontSize: 20, color: "orange" }}
                        gutterBottom
                    >
                        Cảm ơn bạn đã đặt hàng!!😍😍😍
                    </Typography>
                    <Box
                        sx={{
                            marginTop: 4,
                            textTransform: "uppercase",
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "start",
                            alignItems: "start",
                            marginLeft: 6,
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ fontSize: 11, marginBottom: 3 }}
                            gutterBottom
                        >
                            <strong>Mã đơn hàng:</strong>{" "}
                            {_id || "Không tìm thấy mã đơn hàng"}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontSize: 11, marginBottom: 3 }}
                            gutterBottom
                        >
                            <strong>Thành tiền:</strong>{" "}
                            {formatPrice(totalPrice) || "Không xác định"}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontSize: 11, marginBottom: 3 }}
                            gutterBottom
                        >
                            <strong>Phương thức thanh toán:</strong>{" "}
                            {paymentMethod || "Không xác định"}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            fontSize: 20,
                            textTransform: "none",
                            padding: "10px 20px",
                            marginLeft: "-1px",
                            marginTop: 2,
                        }}
                        href="/"
                    >
                        Tiếp tục mua hàng
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PaymentSuccessPage;
