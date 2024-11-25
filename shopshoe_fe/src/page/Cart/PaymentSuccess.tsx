import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLocation } from 'react-router-dom';

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
                    width: '100%',
                    textAlign: 'center',
                    padding: 5,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0)',
                    marginTop: 10,
                }}
            >
                <CardContent>
                    <CheckCircleIcon
                        sx={{ fontSize: 150, color: 'green', marginBottom: 2 }}
                    />
                    <Typography variant="h4" sx={{ fontSize: 30, }} gutterBottom>
                        Thanh toán thành công!
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize: 20, }} gutterBottom>
                        Cảm ơn bạn đã đặt hàng!
                    </Typography>
                    <Box sx={{ marginTop: 4, textTransform: "uppercase" }}>
                        <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 3, }} gutterBottom>
                            <strong>Mã đơn hàng:</strong> {_id || "Không tìm thấy mã đơn hàng"}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 3, }} gutterBottom>
                            <strong>Thành tiền:</strong> {formatPrice(totalPrice) || "Không xác định"}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 3, }} gutterBottom>
                            <strong>Phương thức thanh toán:</strong> {paymentMethod || "Không xác định"}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            fontSize: 20,
                            textTransform: 'none',
                            padding: '10px 20px',
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
