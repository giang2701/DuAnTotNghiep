import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { CartItem } from "../../interface/Products";
import { useCart } from "../../context/cart";

interface Province {
    code: string;
    name: string;
}

interface District {
    code: string;
    name: string;
}

interface Ward {
    code: string;
    name: string;
}
const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<{ _id: string } | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 }; // Lấy dữ liệu từ state
    const [selectedValue, setSelectedValue] = useState("COD");

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const [name, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const { clearCart } = useCart()
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };
    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem("user");
        if (userFromLocalStorage) setUser(JSON.parse(userFromLocalStorage));
        else setLoading(false);
    }, []);



    // call api đia chỉ
    useEffect(() => {
        axios
            .get("https://provinces.open-api.vn/api/p/")
            .then((response) => setProvinces(response.data))
            .catch((error) => console.error("Error fetching provinces:", error));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((response) => setDistricts(response.data.districts))
                .catch((error) => console.error("Error fetching districts:", error));
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            axios
                .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((response) => setWards(response.data.wards))
                .catch((error) => console.error("Error fetching wards:", error));
        }
    }, [selectedDistrict]);

    useEffect(() => {
        const pendingOrderId = localStorage.getItem("pendingOrderId");
        if (pendingOrderId) {
            handleQueryPaymentStatus(pendingOrderId);
            localStorage.removeItem("pendingOrderId");
        }
    }, []);

    const handleChange = (value: string) => {

        setSelectedValue(value);
    };


    const handleQueryPaymentStatus = async (orderId: any) => {
        try {
            const response = await axios.post("http://localhost:8000/api/orders/query", { orderId });
            if (response.data.status === "Completed") {
                toast.success("Thanh toán đơn hàng bằng MOMO thành công")
                navigate("/");
            } else {
                toast.error("Thanh toán chưa hoàn tất. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi kiểm tra thanh toán:", error);
            toast.error("Có lỗi xảy ra khi kiểm tra thanh toán.");
        }
    };

    const handPayment = async () => {
        if (!name || !phone || !address || !selectedProvince || !selectedDistrict || !selectedWard) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            // Tạo thông tin đơn hàng
            const orderData = {
                userId: user?._id,
                products: cart,
                totalPrice: totalPrice,
                voucherCode: "",
                shippingAddress: {
                    name: name,
                    phone: phone,
                    address: address,
                    ward: selectedWard,
                    district: selectedDistrict,
                    city: selectedProvince,
                },
                paymentMethod: selectedValue.toUpperCase(),
                status: "PENDING",
            };

            let response;
            // Xử lý theo phương thức thanh toán
            if (selectedValue === "MOMO") {
                const response = await axios.post("http://localhost:8000/api/orders/payWithMoMo", orderData);

                const orderId = response.data?.order._id;
                const payUrl = response.data?.payUrl;

                if (payUrl) {

                    localStorage.setItem("pendingOrderId", orderId);

                    window.location.href = payUrl;  // Chuyển hướng sang trang thanh toán MoMo
                    clearCart();
                    localStorage.removeItem("cart");
                } else {
                    toast.error("Không thể tạo URL thanh toán MoMo.");
                }

            } else if (selectedValue === "COD") {
                // Gửi thông tin đơn hàng đến server
                response = await axios.post("http://localhost:8000/api/orders", orderData);
                const { _id, totalPrice, paymentMethod } = response.data.newOrder;
                toast.success("Đơn hàng sẽ được thanh toán khi giao hàng!");
                clearCart(); // Xóa giỏ hàng
                localStorage.removeItem("cart");
                navigate("/paymentSuccess", {
                    state: {
                        _id,
                        totalPrice: totalPrice,
                        paymentMethod,
                    },
                });
            }

        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
        }

    };



    return (
        <>
            <div className="container">
                <div className="checkout mb-5">
                    <div className="progress-container">
                        <ul className="progressbar">
                            <li className="active">Giỏ hàng</li>
                            <li className="active">Đặt hàng</li>
                            <li>Thanh toán</li>
                            <li>Hoàn thành đơn</li>
                        </ul>
                    </div>
                </div>

                <Grid container spacing={4} justifyContent="center">
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                padding: 3,
                                borderRadius: 1,
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
                                backgroundColor: "#fff",
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Địa chỉ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        label="Họ tên"
                                        fullWidth
                                        variant="outlined"
                                        value={name}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        label="Số điện thoại"
                                        fullWidth
                                        variant="outlined"
                                        type="number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} >
                                    <FormControl fullWidth>
                                        <InputLabel>Tỉnh/Thành phố</InputLabel>
                                        <Select
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                        >
                                            {provinces.map((province: Province) => (
                                                <MenuItem key={province.code} value={province.code}>
                                                    {province.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Quận/Huyện</InputLabel>
                                        <Select
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            disabled={!districts.length}
                                        >
                                            {districts.map((district: District) => (
                                                <MenuItem key={district.code} value={district.code}>
                                                    {district.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Phường/xã</InputLabel>
                                        <Select
                                            value={selectedWard}
                                            onChange={(e) => setSelectedWard(e.target.value)}
                                            disabled={!wards.length}
                                        >
                                            {wards.map((ward: Ward) => (
                                                <MenuItem key={ward.code} value={ward.name}>
                                                    {ward.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Địa chỉ"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box
                            sx={{
                                marginTop: 4,
                                padding: 3,
                                borderRadius: "10px",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
                                backgroundColor: "#fff",
                            }}
                        >
                            <Typography variant="h4">Phương thức thanh toán</Typography>


                            <Typography
                                variant="body2"
                                sx={{ marginBottom: 2, color: "#707070" }}
                            >
                                Mọi giao dịch đều được bảo mật và mã hóa. Thông tin thẻ tín dụng
                                sẽ không bao giờ được lưu lại.
                            </Typography>
                            <FormControl component="fieldset">
                                <RadioGroup>
                                    <FormControlLabel
                                        value="momo"
                                        control={
                                            <IconButton onClick={() => handleChange("MOMO")}>
                                                {selectedValue === "MOMO" ? (
                                                    <CheckCircleIcon sx={{ color: "#000" }} />
                                                ) : (
                                                    <RadioButtonUncheckedIcon sx={{ color: "#707070" }} />
                                                )}
                                            </IconButton>
                                        }
                                        label="Thanh toán bằng Momo"
                                    />
                                    <FormControlLabel
                                        value="cod"
                                        control={
                                            <IconButton onClick={() => handleChange("COD")}>
                                                {selectedValue === "COD" ? (
                                                    <CheckCircleIcon sx={{ color: "#000" }} />
                                                ) : (
                                                    <RadioButtonUncheckedIcon sx={{ color: "#707070" }} />
                                                )}
                                            </IconButton>
                                        }
                                        label="Thanh toán khi giao hàng"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                padding: 3,
                                borderRadius: "10px",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
                                backgroundColor: "#fff",
                            }}
                        >
                            <Typography variant="h4">Phương thức giao hàng</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup defaultValue="cod">
                                    <FormControlLabel
                                        value="cod"
                                        control={<CheckCircleIcon sx={{ color: "#000" }} />}
                                        label="Chuyển phát nhanh"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: 2, color: "#707070" }}
                            >
                                Thời gian dự kiến:30/10/2024
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                marginTop: 4,
                                padding: "20px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                backgroundColor: "#fff",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                        >
                            <Typography variant="h4" gutterBottom>
                                Tóm tắt đơn hàng
                            </Typography>
                            <Grid
                                container
                                justifyContent="space-between"
                                sx={{ marginBottom: 1 }}
                            >
                                <Typography>Tổng tiền hàng</Typography>
                                <Typography>{formatPrice(totalPrice)}</Typography>
                            </Grid>
                            <Grid
                                container
                                justifyContent="space-between"
                                sx={{ marginBottom: 1 }}
                            >
                                <Typography>Tạm tính</Typography>
                                <Typography>{formatPrice(totalPrice)}</Typography>
                            </Grid>
                            <Grid
                                container
                                justifyContent="space-between"
                                sx={{ marginBottom: 2 }}
                            >
                                <Typography>Phí vận chuyển</Typography>
                                <Typography>0₫</Typography>
                            </Grid>
                            <Grid
                                container
                                justifyContent="space-between"
                                sx={{ marginBottom: 2 }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    Tiền thanh toán
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {formatPrice(totalPrice)}
                                </Typography>

                            </Grid>

                            <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                sx={{ marginBottom: 4 }}
                            >
                                <Grid item xs={6}>
                                    <TextField label="Mã giảm giá" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="contained" color="primary" fullWidth>
                                        ÁP DỤNG
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box display="flex" justifyContent="center">
                            <button type="submit" className="btn_checkout mt-5" onClick={handPayment}>Thanh Toán</button>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default Checkout;