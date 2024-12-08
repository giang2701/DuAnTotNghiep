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
import axios, { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { CartItem } from "../../interface/Products";
import { useCart } from "../../context/cart";
import instance from "../../api";
import Swal from "sweetalert2";
import moment from "moment";
import { Voucher } from "../../interface/Voucher";
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
  // ********************Voucher*****************
  const [couponCode, setCouponCode] = useState(""); // Mã giảm giá
  const [discount, setDiscount] = useState(0); // % giảm giá
  const [discountAmount, setDiscountAmount] = useState(0); // Số tiền giảm
  const [finalTotal, setFinalTotal] = useState(totalPrice); // Tổng tiền cuối cùng
  const [message, setMessage] = useState(""); // Thông báo lỗi/success
  // get all voucher
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const userLocal = localStorage.getItem("user");
  const userName = userLocal ? JSON.parse(userLocal)?.username : null;
  const [error, setError] = useState("");
  const validatePhone = (value: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(value)) {
      setError("Số điện thoại không hợp lệ");
    } else {
      setError("");
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("/voucher");
        // Lọc các voucher chỉ có isActive = true
        const activeVouchers = filterActiveVouchers(data.data);
        setVouchers(activeVouchers);
      } catch (error) {
        console.error("Failed to fetch vouchers", error);
      }
    })();
  }, []);

  // Hàm lọc voucher chỉ lấy các voucher isActive = true
  const filterActiveVouchers = (vouchers: Voucher[]) => {
    return vouchers.filter((voucher) => voucher.isActive);
  };

  // Hàm xử lý sự kiện khi người dùng click vào voucher
  const handleVoucherClick = (voucher: Voucher) => {
    if (moment(voucher.expiryDate).isBefore(moment())) {
      return; // Không cho chọn voucher nếu hết hạn
    }
    // Xử lý khi voucher được chọn
    console.log("Voucher selected:", voucher);
  };
  const handleCopyVoucher = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Voucher code copied to clipboard!", {
          autoClose: 2000, // Tự động đóng sau 3 giây
        });
      })
      .catch((err) => {
        alert("Failed to copy voucher code: " + err);
      });
  };
  const [hiddenVoucher, setHiddenVoucher] = useState(false);
  // Xử lý nhập mã giảm giá
  const handleApplyCoupon = async () => {
    try {
      const response = await instance.post("/voucher/verify", {
        code: couponCode,
      });
      console.log(response.data);

      const { discount, type } = response.data;

      if (type === "percent") {
        setDiscount(discount); // Giảm giá theo %
        setDiscountAmount(0); // Không áp dụng giảm giá theo số tiền
        setFinalTotal(totalPrice - (totalPrice * discount) / 100);
      } else if (type === "fixed") {
        setDiscountAmount(discount); // Giảm giá theo số tiền
        setDiscount(0); // Không áp dụng giảm giá theo %
        setFinalTotal(totalPrice - discount);
      }

      setMessage("Áp dụng mã giảm giá thành công!");
    } catch (error) {
      const errorResponse = error as AxiosError<{ message: string }>;
      setMessage(
        errorResponse.response?.data?.message ||
          "Có lỗi xảy ra. Vui lòng thử lại!"
      );
      setDiscount(0);
      setDiscountAmount(0);
      setFinalTotal(totalPrice);
    }
  };
  //-----------------end voucher-----------------------
  const { clearCart } = useCart();
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
  // Hàm ánh xạ mã thành tên
  // tỉnh
  const getProvinceName = (code: string) => {
    const province = provinces.find((p) => p.code === code);
    return province ? province.name : "Unknown";
  };
  // xã phường
  const getDistrictName = (code: string) => {
    const district = districts.find((d) => d.code === code);
    return district ? district.name : "Unknown";
  };
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
  const handleApplyVoucher = async (voucher: Voucher) => {
    console.log(`Đã áp dụng voucher: ${voucher.name}`);
    try {
      const response = await instance.post("/voucher/verify", {
        code: voucher.code,
      });
      console.log(response.data);

      const { discount, type } = response.data;

      if (type === "percent") {
        setDiscount(discount); // Giảm giá theo %
        setDiscountAmount(0); // Không áp dụng giảm giá theo số tiền
        setFinalTotal(totalPrice - (totalPrice * discount) / 100);
      } else if (type === "fixed") {
        setDiscountAmount(discount); // Giảm giá theo số tiền
        setDiscount(0); // Không áp dụng giảm giá theo %
        setFinalTotal(totalPrice - discount);
      }

      setMessage("Áp dụng mã giảm giá thành công!");
    } catch (error) {
      const errorResponse = error as AxiosError<{ message: string }>;
      setMessage(
        errorResponse.response?.data?.message ||
          "Có lỗi xảy ra. Vui lòng thử lại!"
      );
      setDiscount(0);
      setDiscountAmount(0);
      setFinalTotal(totalPrice);
    }
  };
  const handleQueryPaymentStatus = async (orderId: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/orders/query",
        { orderId }
      );
      if (response.data.status === "Completed") {
        toast.success("Thanh toán đơn hàng bằng MOMO thành công");
        navigate("/");
      } else {
        toast.error("Thanh toán chưa hoàn tất. Vui lòng thử lại.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.";
      Swal.fire({
        icon: "error",
        title: "Lỗi Khi Thanh Toán",
        text: errorMessage, // Hiển thị nội dung của message
      });
    }
  };

  const handPayment = async () => {
    let name = userName;
    if (
      !name ||
      !phone ||
      !address ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard
    ) {
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: "Vui lòng điền đầy đủ thông tin.",
      });
      return;
    }
    // validatePhone(phone);
    try {
      // Tạo thông tin đơn hàng
      const orderData = {
        userId: user?._id,
        products: cart,
        totalPrice: finalTotal,
        voucherCode: "",
        shippingAddress: {
          name: name,
          phone: phone,
          address: address,
          ward: selectedWard,
          district: getDistrictName(selectedDistrict),
          city: getProvinceName(selectedProvince),
        },
        paymentMethod: selectedValue.toUpperCase(),
        status: "PENDING",
      };
      console.log(orderData);

      let response;
      // Xử lý theo phương thức thanh toán
      if (selectedValue === "MOMO") {
        const response = await axios.post(
          "http://localhost:8000/api/orders/payWithMoMo",
          orderData
        );

        const orderId = response.data?.order._id;
        const payUrl = response.data?.payUrl;

        if (payUrl) {
          localStorage.setItem("pendingOrderId", orderId);

          window.location.href = payUrl; // Chuyển hướng sang trang thanh toán MoMo
          clearCart();
          localStorage.removeItem("cart");
        } else {
          toast.error("Không thể tạo URL thanh toán MoMo.");
        }
      } else if (selectedValue === "COD") {
        // Gửi thông tin đơn hàng đến server
        response = await axios.post(
          "http://localhost:8000/api/orders",
          orderData
        );
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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Đã xảy ra lỗi, vui lòng thử lại sau.sss";
      Swal.fire({
        icon: "error",
        title: "Lỗi Khi Thanh Toán",
        text: errorMessage,
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/CartPage");
        window.location.reload();
      });
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
                    value={userName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => validatePhone(phone)}
                    required
                    fullWidth
                    error={!!error}
                    helperText={error}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
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
                          <RadioButtonUncheckedIcon
                            sx={{
                              color: "#707070",
                            }}
                          />
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
                          <RadioButtonUncheckedIcon
                            sx={{
                              color: "#707070",
                            }}
                          />
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
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
                gutterBottom
              >
                Tóm tắt đơn hàng
              </Typography>
              <Grid
                container
                justifyContent="space-between"
                sx={{
                  marginBottom: 1,
                  // width: "570px",
                  margin: "auto",
                  width: {
                    xs: "320px", // màn hình nhỏ (mobile)
                    sm: "620px", // màn hình tablet nhỏ
                    md: "370px", // màn hình tablet lớn
                    xl: "570px",
                  },
                }}
              >
                <Typography variant="h6" mb={1}>
                  Tổng tiền hàng
                </Typography>
                <Typography variant="h6">{formatPrice(totalPrice)}</Typography>
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                sx={{
                  marginBottom: 1,
                  width: {
                    xs: "320px", // màn hình nhỏ (mobile)
                    sm: "620px", // màn hình tablet nhỏ
                    md: "370px", // màn hình tablet lớn
                    xl: "570px",
                  },
                  margin: "auto",
                }}
              >
                <Typography variant="h6" mb={1}>
                  Tạm tính
                </Typography>
                <Typography variant="h6">{formatPrice(totalPrice)}</Typography>
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                sx={{
                  marginBottom: 1,
                  width: {
                    xs: "320px", // màn hình nhỏ (mobile)
                    sm: "620px", // màn hình tablet nhỏ
                    md: "370px", // màn hình tablet lớn
                    xl: "570px",
                  },
                  margin: "auto",
                }}
              >
                <Typography variant="h6" mb={1} sx={{ marginLeft: "2px" }}>
                  Phí vận chuyển
                </Typography>
                <Typography variant="h6">0₫</Typography>
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                sx={{
                  marginBottom: 1,
                  width: {
                    xs: "320px", // màn hình nhỏ (mobile)
                    sm: "620px", // màn hình tablet nhỏ
                    md: "370px", // màn hình tablet lớn
                    xl: "570px",
                  },
                  margin: "auto",
                }}
              >
                <Typography variant="h6" mb={1} sx={{ fontWeight: "bold" }}>
                  Tiền thanh toán
                </Typography>
                <Typography
                  variant="h5"
                  color="red"
                  sx={{ fontWeight: "bold" }}
                >
                  {formatPrice(totalPrice)}
                </Typography>
              </Grid>
            </Box>
            {/* Mã giảm giá */}
            <Box
              sx={{
                // background: "red",
                borderRadius: "10px",
                height: "80px",
                paddingTop: "18px",
                marginTop: "10px",
                boxShadow: "5px 5px 5px #f2f2f2",
                border: "1px solid #f5f5f5",
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: "320px", // màn hình nhỏ (mobile)
                    sm: "620px", // màn hình tablet nhỏ
                    md: "370px", // màn hình tablet lớn
                    xl: "570px",
                  },
                  margin: "auto",
                }}
                display="flex"
                justifyContent={"space-between"}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#f6432e",
                  }}
                  variant="h5"
                >
                  <svg
                    version="1.1"
                    viewBox="0 0 2048 2048"
                    width="32"
                    height="32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      transform="translate(1780,184)"
                      d="m0 0 19 1 15 4 12 5 15 10 7 6 9 11 7 11 6 14 14 46 19 63 23 76v3h19l26 1 17 4 16 8 9 6 10 9 10 12 8 16 5 13 2 8v335l-6 11-8 7-7 3-15 2-19 2-18 4-20 7-17 9-17 12-13 12-8 8-12 17-8 14-7 15-6 20-3 17v35l3 17 5 18 8 18 9 16 10 13 11 12 10 9 16 11 16 9 21 8 17 4 15 2 15 1 11 3 6 4 7 8 4 7v336l-6 19-8 16-11 14-10 9-13 8-12 5-9 3-13 2h-282l-10-4-8-7-6-12-1-6h-58l-5 14-9 10-8 4-5 1-469 1-54 16-63 19-217 65-161 48-212 63-58 17-52 15-22 6h-14l-17-4-14-6-12-8-12-11-9-11-8-15-8-24-14-47-16-53-21-70h-25l-17-1-18-4-14-6-13-9-11-10-9-12-8-15-6-19v-1028l6-19 7-14 8-11 12-12 15-10 15-6 13-3h234l10 4 7 7 5 10 1 9h60l1-9 5-10 9-8 7-3 521-1 13-2 52-16 384-116 35-10h11l9 3 10 9 5 9 9-2 40-12 7-2-1-6v-8l4-11 7-8 8-5 25-8 169-51 37-11 9-2z"
                      fill="#FDD98E"
                    />
                    <path
                      transform="translate(516,626)"
                      d="m0 0h24l17 4 18 8 11 7 10 8 10 9 7 7 9 11 10 14h99l10-14 9-10 7-8 8-8 15-11 14-8 12-5 17-4h23l14 3 14 5 15 8 13 10 11 11 10 14 9 16 6 15 6 19 5 27 2 23v39h15l15 3 12 5 11 7 6 5 8 10 7 12 4 12 1 5v102l-3 13-8 16-9 11-10 8-17 9-13 3v243l-1 28-3 14-5 13-9 15-12 13-12 9-16 8-12 4-17 2-186 1-212-1-16-1-16-4-16-8-10-7-10-9-10-13-8-16-4-14-1-6-1-16v-254l-9-3-16-7-10-7-11-11-8-13-5-15-1-6v-99l4-16 6-12 7-9 10-10 13-8 12-4 12-2 14-1 1-34 2-26 3-17 5-21 7-19 8-16 10-15 12-13 12-10 15-9 16-6z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(1780,184)"
                      d="m0 0 19 1 15 4 12 5 15 10 7 6 9 11 7 11 6 14 14 46 19 63 23 76v3h19l26 1 17 4 16 8 9 6 10 9 10 12 8 16 5 13 2 8v335l-6 11-8 7-7 3-15 2-19 2-18 4-20 7-17 9-17 12-13 12-8 8-12 17-8 14-7 15-6 20-3 17v35l3 17 5 18 8 18 9 16 10 13 11 12 10 9 16 11 16 9 21 8 17 4 15 2 15 1 11 3 6 4 7 8 4 7v336l-6 19-8 16-11 14-10 9-13 8-12 5-9 3-13 2h-282l-10-4-8-7-6-12-1-11 4-11 8-9 8-5 4-1 278-1 10-3 8-6 6-10 1-3 1-135v-158l-10-1-26-7-21-8-23-12-15-10-14-11-13-12-7-7-9-11-9-12-10-16-8-15-9-23-5-18-4-21-2-25 1-26 4-24 5-19 7-19 10-21 10-16 13-17 11-12 14-14 14-11 15-10 18-10 19-8 24-7 17-4h3v-286l-2-10-5-8-8-7-8-3-701-1h-840l-10-2-8-4-7-7-4-8-2-9 3-12 6-9 7-6 7-3 521-1 13-2 52-16 384-116 35-10h11l9 3 10 9 5 9 9-2 40-12 7-2-1-6v-8l4-11 7-8 8-5 25-8 169-51 37-11 9-2z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(76,435)"
                      d="m0 0h234l10 4 7 7 5 10 2 12-5 12-7 8-8 5-7 2-225 1-8 4-5 4-7 11-1 5v1e3l1 9 5 10 7 7 6 3 5 1 1488 1 9 2 10 7 6 10 2 6v10l-4 10-9 10-8 4-5 1-469 1-54 16-63 19-217 65-161 48-212 63-58 17-52 15-22 6h-14l-17-4-14-6-12-8-12-11-9-11-8-15-8-24-14-47-16-53-21-70h-25l-17-1-18-4-14-6-13-9-11-10-9-12-8-15-6-19v-1028l6-19 7-14 8-11 12-12 15-10 15-6z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(334,465)"
                      d="m0 0h58l4 12 6 8 8 6 6 2 7 1h866l675 1 10 4 9 9 4 9 1 7v284l-1 2-35 9-19 7-17 8-18 11-16 12-13 12-13 13-13 17-7 10-10 18-9 20-8 26-4 21-2 24 1 27 4 25 5 19 8 21 8 16 6 11 11 16 9 11 12 13 13 12 16 12 20 12 21 10 24 8 26 6 1 2v156l-1 118-1 6h-1l-1-8-5-5-2-10-1-11-1-32-1-134-2-31v-39l-9-4-27-7-11-4-23-11-13-8-11-9-12-11-13-13-9-11-10-13-7-11-8-13-8-19-8-23-3-12-2-11-2-6-3-27v-26l3-21 6-26 6-18 7-17 7-11 3-6 8-13h2l1-4 9-12h2l2-4 3-4h2l2-5h2v-2h2l2-4 8-8 11-9 14-11 19-12 10-5 13-5 7-3 24-9 6-4v-218l-1-16v-39l-3-9-3-3v-2l-4-2-9-3h-80l-82 2-71 1h-134l-28-1-122-2-114-1h-28l-3 3 6 2 11 11 1 4 3 1v2l4 2 2 10v25l1 45-2 9-4 7h-2l-2 4-10 7-8 3-9 2h-10l-10-3-7-5v-2l-4-2v-2h-2l-4-10-3-10-3-12-1-15v-41l3-10 8-13 6-6 7-3 1-3-23-1h-38l-76 2-26 1-68 1h-54l-387-1-102-1h-38l-28 1-15-2-9-5-4-3v-2h-2l-6-10-4-9-5-3-5-1-16 1-13 2-5 6-6 12h-2v2h-2v2l-12 6-15 3h-114l-96 1-10 2-6 3-5 9-2 62-1 17v723l-1 97-1 6-3-1-1-2-1-779 1 859 2 10 7-4h9l15 2 31 1 13 1h13l25-1h53l5 1 6-2h8l7 1 7-2 7-1 7 2h32l13-1 77 1h827l16 1 4 2 3 7 3 3v3l4 1v2h3l-7-10-3-9v-73l4-9 6-7 8-5 8-2h9l11 4 6 5 6 9 2 7v70l-4 11-8 9-7 4v2h7l12-7 4-5 4-10 6-2h66l287-1h301l3 5-1 10-4 10-5 7-6 4-11 2-12 1-1-1h-227l-13-1-16 1-11 4-8 6-4 2-2 5-6 12-2 1v2l-10 2-11-1-14-1-13-1-3-6v11h-1l-3-12-5-8v-2l-4-2-6-4-9-2-1488-1-9-3-8-7-5-7-2-5-1-9v-1e3l3-9 7-9 9-6 3-1 225-1 9-3 6-4 6-7 5-12z"
                      fill="#FCCB7F"
                    />
                    <path
                      transform="translate(1783,244)"
                      d="m0 0 9 1 8 4 7 6 7 14 14 46 21 70 13 43 1 6-663 1h-47l2-2 45-14 129-39 106-32 9-5 7-8 4-11v-12l25-8 31-9 3 4 4 6 6 5 9 4h14l97-29 72-22 60-18z"
                      fill="#FBBF7D"
                    />
                    <path
                      transform="translate(185,1613)"
                      d="m0 0h709l-1 2-27 8-165 50-182 55-50 15-47 14-29 9-120 36-4 1h-13l-10-5-8-9-5-13-8-26-15-50-16-53-9-31z"
                      fill="#FCBF7E"
                    />
                    <path
                      transform="translate(710,1037)"
                      d="m0 0h196l3 1v264l-4 9-7 8-8 5-10 2h-170l-1-1v-287z"
                      fill="#60A1F7"
                    />
                    <path
                      transform="translate(455,1037)"
                      d="m0 0h192l2 1v232l-1 55-76 1h-90l-9-2-9-6-6-7-4-10-1-27v-139l1-97z"
                      fill="#60A1F7"
                    />
                    <path
                      transform="translate(334,465)"
                      d="m0 0h58l4 12 6 8 8 6 6 2 7 1h866l675 1 10 4 9 9 4 9 1 7v284l-1 2-35 9-19 7-17 8-18 11-16 12-13 12-13 13-13 17-7 10-10 18-9 20-8 26-4 21-2 24 1 27 4 25 5 19 8 21 8 16 6 11 11 16 9 11 12 13 13 12 16 12 20 12 21 10 24 8 26 6 1 2v156l-1 118-1 6h-1l-1-8-5-5-2-10-1-11-1-32-1-134-2-31v-39l-9-4-27-7-11-4-23-11-13-8-11-9-12-11-13-13-9-11-10-13-7-11-8-13-8-19-8-23-3-12-2-11-2-6-3-27v-26l3-21 6-26 6-18 7-17 7-11 3-6 8-13h2l1-4 9-12h2l2-4 3-4h2l2-5h2v-2h2l2-4 8-8 11-9 14-11 19-12 10-5 13-5 7-3 24-9 6-4v-218l-1-16v-39l-3-9-3-3v-2l-4-2-9-3h-80l-82 2-71 1h-134l-28-1-122-2-114-1h-28l-3 3 6 2 11 11 1 4 3 1v2l4 2 2 10v25l1 45-2 9-4 7h-2l-2 4-10 7-8 3-9 2h-10l-10-3-7-5v-2l-4-2v-2h-2l-4-10-3-10-3-12-1-15v-41l3-10 8-13 6-6 7-3 1-3-23-1h-38l-76 2-26 1-68 1h-54l-387-1-102-1h-38l-28 1-15-2-9-5-4-3v-2h-2l-6-10-4-9-5-3-5-1-16 1-13 2-5 6-6 12h-2v2h-2v2l-12 6-15 3h-114l-96 1-10 2-6 3-5 9-2 62-1 17v723l-1 97-1 6-3-1-1-2-1-805-1-22v-80l7-11 11-8 3-1 225-1 9-3 6-4 6-7 5-12z"
                      fill="#FEE38F"
                    />
                    <path
                      transform="translate(1493,784)"
                      d="m0 0h9l11 4 8 6 5 8 2 7v441l-4 10-6 8-7 5-5 2-10 1-8-2-8-4-8-8-3-7-1-5-1-51v-50l1-341 4-10 6-7 8-5z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(737,876)"
                      d="m0 0h218l10 1 4 4 1 2v86l-3 5-4 3-14 1-240-1v-100z"
                      fill="#97C5FC"
                    />
                    <path
                      transform="translate(407,876)"
                      d="m0 0h240l2 1v99l-1 1h-248l-6-5-1-2v-86l3-5 2-2z"
                      fill="#97C5FC"
                    />
                    <path
                      transform="translate(185,1613)"
                      d="m0 0h709l-1 2-10 2h-11l-4 1-6 2-3 3-22 7-25 7-13 4-7 1-6 3-9 2-9 3-9 1-26 4-30 2h-22l-24-1-46-1h-87l-69 1h-119l-37-1h-39l-56-1-6-3-5-13-2-7-2-1-4-14z"
                      fill="#FAB068"
                    />
                    <path
                      transform="translate(1325,391)"
                      d="m0 0h15l25 2h19l12 1h236l16-1 64 1h36l59-1 19 1h18l1 3h2l3 4 2 10 5 10 3 1 3 9v3l-663 1h-47l2-2 45-14 80-24 17-1 12-1 5-1z"
                      fill="#FAB068"
                    />
                    <path
                      transform="translate(520,619)"
                      d="m0 0h11l17 3 15 4 21 8 15 9 10 8v2h2v2l4 2 2 4h2l4 5 3 5 6 7v2l3 1 7 12v1l-10 1-12-16-12-14-9-9-16-12-14-8-12-5-17-4h-24l-17 4-15 6-14 9-11 9-7 7-9 12-10 17-8 20-5 17-4 19-2 18-1 16-1 34-1 1-21 2-12 3-12 6-9 7-9 9-8 13-4 11-2 10v99l4 16 6 12 7 9 9 9 16 9 16 5 2 2v254l1 16 4 17 6 14 9 13 10 11 14 10 15 7 16 4 16 1 215 1 183-1 17-2 15-5 13-7 12-9 7-7 9-13 8-16 3-11 1-7 1-28 1-243 15-5 15-8 10-8 9-12 7-14 3-13v-102l-3-11-4-10-8-12-5-6-12-9-13-6-12-3-21-2-1-39-2-23-5-27-9-27-8-16-10-16-12-13-9-8-13-8-15-7-14-4-7-1h-23l-17 4-12 5-11 6-14 10-12 11-12 13-14 19-10-1 3-7h2v-2h2l1-3h2l2-4 8-11 6-7 8-7 11-10 10-7 14-7 11-4 9-3h7v-2l14-1h9l16 3 15 4 18 7 8 4v2l4 1 6 4 6 5 9 11 10 15 3 10h2l7 14 5 15 5 19 3 15 2 17v30l-1 8h2l3 5 9 3 10 2 10 3 16 8 10 8 7 9 8 16 3 11 3 17v13l-1 14 1 15v56l-3 15-7 14-3 4h-2l-1 4-8 7-10 7-14 7h-4l-1 3h-2v2h-2l-1 4v38l-1 1-1 71v54l-1 96-3 21-6 15-8 11-2 3h-2l-2 4-9 8-10 6-3 3-14 7-15 5-18 2-42 1-111 2h-252l-25-3-13-4-11-6-11-8-10-9-5-6v-2h-2l-9-16-6-15-6-24-1-10-2-70v-95l-1-30-1-8v-44l-4-4-10-5-10-7-12-11-9-14-6-14-4-15-1-8v-65l1-26 4-18 8-16 8-10 11-11 7-4 6-4 11-4 21-7 3-6v-14l2-28 5-25 5-20 6-15 5-10 11-18 9-11h2l2-4 4-4h2l2-4h2l1-3 6-4h2v-2l11-6 11-5 8-2 15-4h6z"
                      fill="#FEE28F"
                    />
                    <path
                      transform="translate(1635,885)"
                      d="m0 0h13l9 3 10 9 4 8 1 3 1 237-3 12-7 10-9 6-6 2h-10l-10-3-9-7-4-6-2-5-1-6v-238l4-11 7-8 7-4z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(519,686)"
                      d="m0 0h12l12 5 14 9 12 11 8 9 6 9 2 12v74l-65 1h-45l-3-1 1-37 2-19 4-20 7-21 8-13 9-10 14-8z"
                      fill="#F44F54"
                    />
                    <path
                      transform="translate(828,687)"
                      d="m0 0h14l10 4 9 6 8 8 9 16 6 18 4 20 2 20 1 19v17l-55 1h-56l-1-1-1-50v-32l7-11 10-13 11-11 11-7z"
                      fill="#F44F54"
                    />
                    <path
                      transform="translate(967,880)"
                      d="m0 0 3 3v86l-3 5-4 3-14 1-240-1v-13l3-1 2 1v-9l2-1 2-8v-9l5-1 204-1 41 1v-52z"
                      fill="#7BB2F9"
                    />
                    <path
                      transform="translate(393,884)"
                      d="m0 0h1l1 49 2 15-1 2 3 1-2 1-1 4h2l1-4 1-5 1-6h2v-4l3-1 184-1h50l2 1 1 10v30h5v1h-248l-6-5-1-2z"
                      fill="#7AB2F9"
                    />
                    <path
                      transform="translate(1502,775)"
                      d="m0 0 14 5v2l4 1 7 7 6 9 3 9 2 12v37l-1 47-1 50-1 12v12h-2l-1-33-1-42-2-16-1-76-5-13-5-6-12-6-4-1h-9l-11 4-7 6-5 9-1 4-1 341v50l1 51 3 10 7 8 6 4 5 2 8 1 10-2 8-4 6-7 4-8 1-4h2l1-13 2-19 2 1v3h2l2 9v22l-3 11-5 8h-2v2h-2v2l-6 4h-4v2l-10 4-5 1h-8l-10-3-6-4-10-9-6-10-3-11-1-18-1-138v-118l1-123 2-43 4-12 5-8 5-4 9-6 10-4z"
                      fill="#FEE38F"
                    />
                    <path
                      transform="translate(908,1041)"
                      d="m0 0h1v261l-4 9-7 8-8 5-10 2h-170v-1l13-1 119-1 3-2h2l1-2h-12l-2-1-46-1h-7l-7 1h-23l-14 2-4-2h-3l-1 2-9-4-2-5v-5l1-1v-13h2l1-5h2v-2l18-1 153-2 8-1 3 5 1-9z"
                      fill="#4988DA"
                    />
                    <path
                      transform="translate(260,1544)"
                      d="m0 0h151l135 1h185l105 1h253l78 1 49 2 40 1v2h-1031l-43-1-1-1-21-2 3-2 4-1 5 1 7-1h52z"
                      fill="#FEDA8F"
                    />
                    <path
                      transform="translate(1276,1414)"
                      d="m0 0h9l11 4 6 5 6 9 2 7v70l-4 11-8 9-10 5h-15l-10-4-7-6-5-9-1-5v-73l4-9 6-7 8-5z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(1273,1234)"
                      d="m0 0h14l12 6 7 8 4 11v70l-3 9-7 9-10 6-4 1h-10l-10-3-8-6-6-9-2-6v-73l4-9 7-8 9-5z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(1276,512)"
                      d="m0 0 11 1 8 3 10 9 5 12v70l-4 11-7 8-8 5-7 2h-7l-10-3-9-6-6-9-2-7v-72l4-10 9-9 8-4z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(1274,693)"
                      d="m0 0h12l10 4 8 7 5 10 1 3v70l-3 9-6 9-9 6-7 2h-9l-10-3-8-6-6-9-2-6v-73l4-9 7-8 6-4z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(1276,873)"
                      d="m0 0 13 1 8 4 5 4 6 9 2 7v70l-4 11-7 8-12 6h-13l-9-3-10-9-4-8-1-4v-72l4-10 7-8 10-5z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(1272,1054)"
                      d="m0 0h16l10 5 7 7 4 8 1 5v69l-4 11-9 10-8 4-10 1-10-2-10-6-6-8-3-8v-73l4-9 7-8 8-5z"
                      fill="#010101"
                    />
                    <path
                      transform="translate(468,1283)"
                      d="m0 0h149l21 1 2 2v24l-3 6-6 1h-79l-23 1-8-1-1 2-23 1-6-2-2 1-7-2-8-4-4-6-4-10v-10z"
                      fill="#4988DA"
                    />
                    <path
                      transform="translate(1783,244)"
                      d="m0 0 9 1 8 4 7 6 7 14 14 46 21 70 2 6v4l-6-2-5-5-5-13-6-21-10-32-10-31-6-20-5-10-1-3h-2v-2l-6-2-2-1h-8l-13 3-18 7-26 8-40 12-28 8-13 4-9 3-12 3-19 6-29 9-24 8-12 1-9-2-9-6-7-7v-2l-6-2-11 1-15 5-11 6-4 14-4 10-4 6-8 6-12 4-27 6-15 4-11 3-4 2-12 3-13 3-11 3-8 3h-8l-5 1-2-2 2-2 47-14 56-17 12-4 8-5 6-7 4-11v-12l25-8 31-9 3 4 4 6 6 5 9 4h14l97-29 72-22 60-18z"
                      fill="#FCCB7F"
                    />
                    <path
                      transform="translate(1638,876)"
                      d="m0 0h7l7 2 9 3 12 12 6 10 2 12v20l-1 6-4-1-3-27-4-11-6-8-8-6-7-2h-13l-9 4-7 6-5 10-1 4v238l2 8 4 8 9 7 10 3h10l10-4 6-5 5-8 2-6h2v-5l3-1v-9l2-4v3h4v18l-4 11-8 10-4 2v2l-10 4-6 3-5 1h-10l-11-4-11-9-5-6-6-15-1-13-1-87v-58l1-52 2-31 3-9 6-12 11-8z"
                      fill="#FEE28E"
                    />
                    <path
                      transform="translate(198,1655)"
                      d="m0 0 4 1 2 4 2 1 8 21 6 20 7 25 4 13 2 10 5 17 3 9 4 9v3h2l1 4 3 1v2l9 2h7l21-6 11-4 9-2 9-3 20-6 7-2 11-3 21-6 9-3 10-3 21-6 9-3 10-3 14-4 7-3 12-3 3-2 10-2 8-3 13-4 14-4 17-5 8-3 7-2 5-2 7-1 7-3 21-6 9-3 11-4 32-10 15-5 10-2 8-3 5-1 3-2 12-3 5-2 15-4 7-1 6-2 17-2 5 1-1 2-56 17-119 36-53 16-50 15-47 14-29 9-120 36-4 1h-13l-10-5-8-9-5-13-8-26-27-90z"
                      fill="#FCCD80"
                    />
                    <path
                      transform="translate(646,757)"
                      d="m0 0h71v58h-71z"
                      fill="#F34F53"
                    />
                    <path
                      transform="translate(1276,685)"
                      d="m0 0 9 1 10 2 6 4 4 4 1 7-1-2h-5l-10-6-4-1h-12l-9 3-9 8-4 8-1 3v73l4 10 6 7 10 5 5 1h9l9-3 7-5 6-9 3-9 2-13 1-2 4 2 1 21-4 10h-2l-1 4-11 8-16 5h-14l-8-3v-2l-4-1-2-4-3-1-3-3-3-7v-12l-3-2-2-6-2-23 1-35 3-11 6-10h2v-2l5-5 7-5z"
                      fill="#FEE08D"
                    />
                    <path
                      transform="translate(1279,1406)"
                      d="m0 0h7l10 3 6 4 9 12 6 12 2 16v45l-2 9-4 5-4 3v-76l-3-9-6-8-8-5-7-2h-9l-10 3-9 7-5 9-2 5-2 64-3 1-3-3-2-12v-29l1-18 3-11 4-8 4-2v-2l8-7 12-5z"
                      fill="#FEE38F"
                    />
                    <path
                      transform="translate(1272,1227)"
                      d="m0 0h16l8 3 6 4 2 2v5l-7-1-10-5h-14l-9 4-8 7-4 8-2 5-1 23-1 44-1 2-4-2-2-11-1-14v-20l1-19 3-10 5-9 5-5 7-6z"
                      fill="#FEE490"
                    />
                    <path
                      transform="translate(1274,1046)"
                      d="m0 0 16 1 12 6 3 4 1 6-6-3v-2l-9-2-3-1h-16l-10 5-8 9-4 9-1 24-1 44-2 1-3-2-2-11-1-22 1-27 3-13 5-9 11-11z"
                      fill="#FEE490"
                    />
                    <path
                      transform="translate(1273,866)"
                      d="m0 0h11l10 2 9 6 2 3v4l-10-3-6-3-13-1-10 3-8 6-6 10-2 5-1 17-1 47-2 3-3-2-2-10-1-23 1-23 2-13 3-6h2l1-5h2v-3l5-5 8-6z"
                      fill="#FEE490"
                    />
                    <path
                      transform="translate(1314,1310)"
                      d="m0 0 3 1 1 5-1 6h2v10l-4 12-10 10-8 4-13 5h-10l-10-3-9-7-5-5-4-9v-7l3-3 2 1 4 10 6 7 10 5 5 1h10l10-4 5-4 6-9 3-8 2-15z"
                      fill="#FEE38F"
                    />
                    <path
                      transform="translate(1427,1547)"
                      d="m0 0h91v2l5-1 15-1 4 1 16-1h8l9 2 9 5 3 3-5-1-12-3-201-1-5-1v-1l42-1v-1z"
                      fill="#FDD98E"
                    />
                    <path
                      transform="translate(1313,1131)"
                      d="m0 0 4 2 1 5v17l-5 10-4 5h-2v2l-8 5-6 2h-5v2l-3 1h-14l-9-4-8-6v-2h-2l-5-9-1-6 3-5h2l4 10 5 6 12 6 11 1 8-2 8-5 6-7 5-12 2-14z"
                      fill="#FEE38F"
                    />
                    <path
                      transform="translate(1313,951)"
                      d="m0 0 4 2 1 12v10l-5 10-4 5-10 7-12 3-6 2h-8l-11-4-10-9-5-9 1-9 4 2 4 8 9 8 9 3h13l12-6 6-7 5-13 1-12z"
                      fill="#FEE38F"
                    />
                    <path
                      transform="translate(1313,771)"
                      d="m0 0 4 2 1 21-4 10h-2l-1 4-11 8-16 5h-14l-8-3v-2l-4-1-2-4-3-1-3-3-3-7v-8l1-5h2l5 12 6 7 10 5 5 1h9l9-3 7-5 6-9 3-9 2-13z"
                      fill="#FEE38F"
                    />
                    <path
                      transform="translate(1672,909)"
                      d="m0 0h1l1 12 1 64 1 39v84l-2 38-1 5h-1z"
                      fill="#FAB068"
                    />
                    <path
                      transform="translate(396,963)"
                      d="m0 0h2l2 5h2l3 3 4 2 16-1 9 2 4-1 9 1h19l6-2v2h102l24 1v1h-200l-3-3v-8z"
                      fill="#99C6FD"
                    />
                    <path
                      transform="translate(710,967)"
                      d="m0 0 2 2 2-2-1 4-1 2h3v2l7-1 50-1 14-1 2-1 10 2 28 1 38 1v1h-154z"
                      fill="#99C6FD"
                    />
                    <path
                      transform="translate(1204,494)"
                      d="m0 0h85v1l-12 1h-15v2l-4 3h-7l-5-1-2-3-103-1v-1z"
                      fill="#FCCC82"
                    />
                    <path
                      transform="translate(872,1616)"
                      d="m0 0h11l-1 2-59 18-50 15-5-1 4-2 10-3 9-3 1-1 10-2 28-8 24-7 7-2 1-3 9-2z"
                      fill="#FBC278"
                    />
                    <path
                      transform="translate(65,1522)"
                      d="m0 0 2 2 3 9 5 8 8 5 9 3 5 1-2 2h-15l-8-5-8-9-1-2v-8z"
                      fill="#FDD68B"
                    />
                    <path
                      transform="translate(1311,711)"
                      d="m0 0 5 3 1 2 1 14v10l-3 11h-1l-2-8-2-25-1-1v-5z"
                      fill="#FEE691"
                    />
                    <path
                      transform="translate(1308,890)"
                      d="m0 0h2v3l5 2 2 4v25l-2 6h-1l-3-15v-17h-2z"
                      fill="#FEE590"
                    />
                    <path
                      transform="translate(1309,1073)"
                      d="m0 0 7 3 1 6v22l-3 4-2-6-2-22-1-1z"
                      fill="#FEE590"
                    />
                    <path
                      transform="translate(396,963)"
                      d="m0 0h2l2 5h2l3 3 4 2 16-1 6 2 1 2h-34l-3-3v-8z"
                      fill="#97C4FC"
                    />
                    <path
                      transform="translate(1312,1255)"
                      d="m0 0 4 1 1 6v21l-3 4-2-6-2-25z"
                      fill="#FEE691"
                    />
                    <path
                      transform="translate(705,782)"
                      d="m0 0h2l2 6v7l-1 9-7-4-4-6v-3h2v-2h2l-1-3z"
                      fill="#020101"
                    />
                    <path
                      transform="translate(1600,1572)"
                      d="m0 0 3 3 1 4h20l17 2 11 1v1h-51z"
                      fill="#FEDA8F"
                    />
                    <path
                      transform="translate(906,1293)"
                      d="m0 0h1l1 5v7l-5 9-7 7-6 1 1-4 4-2h3l1-6 6-13z"
                      fill="#5E9EF4"
                    />
                    <path
                      transform="translate(1529,887)"
                      d="m0 0h1l2 18 1 50-2 1-1-31-1-1z"
                      fill="#FDD48A"
                    />
                    <path
                      transform="translate(805,1638)"
                      d="m0 0h5l-1 2-36 11-5-1 4-2 10-3 9-3 1-1 10-2z"
                      fill="#FCC77E"
                    />
                    <path
                      transform="translate(1307,1549)"
                      d="m0 0 47 1v1l-25 1h-29l-5-1v-1z"
                      fill="#FDD98E"
                    />
                    <path
                      transform="translate(1984,1531)"
                      d="m0 0h2l-2 6-6 8-9 6v-3l5-4 2-4 4-4z"
                      fill="#FDDB89"
                    />
                    <path
                      transform="translate(203,1672)"
                      d="m0 0h2l3 11 4 13 2 8v3h-2l-9-30z"
                      fill="#FCCE84"
                    />
                    <path
                      transform="translate(1181,425)"
                      d="m0 0h5l-2 2-4 1 1 2-7 1v2h-12l3-3z"
                      fill="#FDD084"
                    />
                    <path
                      transform="translate(872,1616)"
                      d="m0 0h11l-1 2-13 4h-8l1-3 9-2z"
                      fill="#FCC67E"
                    />
                    <path
                      transform="translate(1601,1578)"
                      d="m0 0 1 2h2v2l39-1 9 1v1h-51z"
                      fill="#FEE691"
                    />
                    <path
                      transform="translate(190,1628)"
                      d="m0 0 2 3 4 13 2 4-1 6-2-4-5-17z"
                      fill="#FBBE77"
                    />
                    <path
                      transform="translate(1511,295)"
                      d="m0 0 3 4v4l-10-3v-3z"
                      fill="#FDD78B"
                    />
                    <path
                      transform="translate(1452,336)"
                      d="m0 0 2 1-2 3h-2l-1 4-6 3-1 1h-5l4-3z"
                      fill="#FDCF85"
                    />
                    <path
                      transform="translate(589,1704)"
                      d="m0 0 2 1-9 4-7 2h-5l2-2z"
                      fill="#FDD185"
                    />
                    <path
                      transform="translate(1660,1571)"
                      d="m0 0 1 4-2 8h-7l1-2h3l2-7z"
                      fill="#FEE08D"
                    />
                    <path
                      transform="translate(1464,309)"
                      d="m0 0 2 1-5 5-3 1v2h-2l-1-6z"
                      fill="#FDD98D"
                    />
                    <path
                      transform="translate(1514,301)"
                      d="m0 0 5 5 5 6-2 1-8-7z"
                      fill="#FCCE83"
                    />
                    <path
                      transform="translate(677,1677)"
                      d="m0 0h2l-1 3-10 3h-6l2-2z"
                      fill="#FDD387"
                    />
                    <path
                      transform="translate(1590,1558)"
                      d="m0 0 4 2 1 4 3 3-1 4-5-7v-2l-3-1z"
                      fill="#FDD386"
                    />
                    <path
                      transform="translate(777,1646)"
                      d="m0 0 6 1-3 2-9 2-3-2z"
                      fill="#FCC37A"
                    />
                    <path
                      transform="translate(333,1781)"
                      d="m0 0 4 1-7 3-8 1 1-2z"
                      fill="#FCCE84"
                    />
                    <path
                      transform="translate(373,1769)"
                      d="m0 0 4 1-7 3-8 1 1-2z"
                      fill="#FDCF84"
                    />
                    <path
                      transform="translate(968,967)"
                      d="m0 0h1v5l-4 4h-3l2-5z"
                      fill="#8BBCF8"
                    />
                    <path
                      transform="translate(1329,380)"
                      d="m0 0 3 1-4 2-2 3h-5v-3z"
                      fill="#FCC67C"
                    />
                    <path
                      transform="translate(1676,1132)"
                      d="m0 0 1 4-1 9h-2v-12z"
                      fill="#FDD088"
                    />
                    <path
                      transform="translate(1161,431)"
                      d="m0 0 3 1 4 2-7 1h-8l2-2z"
                      fill="#FBBB74"
                    />
                    <path
                      transform="translate(733,1660)"
                      d="m0 0 3 1-2 2-7 2h-5l4-3z"
                      fill="#FDD587"
                    />
                    <path
                      transform="translate(1181,425)"
                      d="m0 0h5l-2 2-4 1 1 2-7 1v-3l4-2z"
                      fill="#FCC57C"
                    />
                    <path
                      transform="translate(1836,348)"
                      d="m0 0h2l2 7v6l-2-2-2-5z"
                      fill="#FCCE83"
                    />
                  </svg>
                  Voucher
                </Typography>
                <p
                  onClick={() => setHiddenVoucher(true)}
                  style={{
                    cursor: "pointer",
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "blue",
                    fontWeight: "500",
                    textDecoration: "underline",
                  }}
                >
                  Xem voucher
                </p>
              </Box>
            </Box>
            <Box
              sx={{
                // background: "red",
                borderRadius: "10px",
                height: "50px",
                paddingTop: "18px",
                marginTop: "10px",
                boxShadow: "5px 5px 5px #f2f2f2",
                border: "1px solid #f5f5f5",
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: "320px", // màn hình nhỏ (mobile)
                    sm: "620px", // màn hình tablet nhỏ
                    md: "370px", // màn hình tablet lớn
                    xl: "570px",
                  },
                  margin: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Tổng tiền:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "red" }}
                >
                  {finalTotal.toLocaleString()}đ
                </Typography>
              </Box>
            </Box>
            {/* end Mã giảm giá */}
            <Box display="flex" justifyContent="center">
              <button
                type="submit"
                className="btn_checkout mt-5"
                onClick={handPayment}
              >
                Thanh Toán
              </button>
            </Box>
          </Grid>
        </Grid>
      </div>
      {/* Overlay */}
      <div
        className={`overlayVoucher ${hiddenVoucher ? "show" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
        onClick={() => setHiddenVoucher(false)}
      ></div>
      <div className={`box__voucher  ${hiddenVoucher ? "show" : ""} bg-white`}>
        <div
          className="coupon-section d-flex align-items-center"
          style={{
            backgroundColor: "#f8f8f8",
            position: "relative",
            padding: "10px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#000",
              marginTop: "8px",
              marginRight: "10px",
            }}
          >
            Chọn Mã Voucher
          </p>
          <input
            type="text"
            value={couponCode}
            placeholder="Nhập mã giảm giá"
            onChange={(e) => setCouponCode(e.target.value)}
            style={{
              height: "30px",
              width: "200px",
              border: "1px solid #ccc",
              outline: "none",
              // borderRadius: "10px",
              paddingLeft: "10px",
              marginRight: "5px",
            }}
          />
          <button
            onClick={() => {
              handleApplyCoupon();
              setHiddenVoucher(false);
            }}
            style={{
              height: "30px",
              width: "80px",
              border: "1px solid #ccc",
            }}
          >
            Áp dụng
          </button>
          <div
            className="discount-message text-danger"
            style={{
              position: "absolute",
              left: "130px",
              top: "45px",
              backgroundColor: "#fff7f7",
              fontSize: "10px",
              fontWeight: "bold",
              width: "200px",
              paddingLeft: "10px",
              paddingTop: "10px",
              // border: "1px solid red",
            }}
          >
            {message && <p>{message}</p>}
          </div>
        </div>
        <div
          style={{
            maxHeight: "400px", // Giới hạn chiều cao của container
            overflowY: "auto", // Cho phép cuộn dọc nếu nội dung vượt quá chiều cao
            border: "1px solid #ddd", // Thêm viền để dễ nhìn
            padding: "10px", // Thêm khoảng cách bên trong
            scrollbarWidth: "thin", // Thêm thanh cuối dự nguyên (neu báo cáo)
          }}
        >
          {vouchers.map((voucher) => {
            // Kiểm tra nếu voucher đã hết hạn
            const isExpired = moment(voucher.expiryDate).isBefore(moment());
            const isBelowMinPrice = totalPrice < voucher.minPrice;
            return (
              <div
                key={voucher._id}
                style={{
                  opacity: isExpired || isBelowMinPrice ? 0.5 : 1, // Làm mờ nếu hết hạn hoặc dưới giá trị tối thiểu
                  cursor:
                    isExpired || isBelowMinPrice ? "not-allowed" : "pointer", // Không cho click
                  display: "block", // Đảm bảo voucher vẫn được hiển thị nếu là active
                  padding: "10px",
                  marginBottom: "10px", // Khoảng cách giữa các voucher
                  border: "1px solid #ccc", // Thêm viền cho mỗi voucher
                  borderRadius: "5px", // Bo góc cho các voucher
                }}
                onClick={() => {
                  if (!isExpired && !isBelowMinPrice) {
                    handleVoucherClick(voucher);
                  }
                }}
              >
                {/* <h4>{voucher.code}</h4>
                                <p>{`Hết hạn: ${moment(
                                    voucher.expiryDate
                                ).format("DD/MM/YYYY")}`}</p>
                                {isExpired && (
                                    <span style={{ color: "red" }}>
                                        Hết hạn
                                    </span>
                                )} */}
                <div
                  className="modal_voucher_admin d-flex border border-black"
                  style={{
                    height: "150px",
                    width: "100%",
                  }}
                >
                  <div
                    className="voucher_first "
                    style={{
                      backgroundColor: "#ed4d2d",
                      width: "150px",
                    }}
                  >
                    <div className="Group_circle">
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                    </div>
                    <p>Voucher</p>
                    <i
                      className="fa-solid fa-ticket"
                      style={{
                        color: "#ed4d2d",
                        fontSize: "20px",
                        width: "50px",
                        height: "50px",
                        backgroundColor: "yellow",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                      }}
                    ></i>
                  </div>
                  <div className="voucher_end bg-white w-75 pt-5 ps-4">
                    <p
                      style={{
                        fontSize: "16px",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: "var(--line-clamp, 1)",
                        overflow: "hidden",
                      }}
                    >
                      {voucher.name}
                    </p>
                    <p>
                      Đơn hàng từ:{" "}
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(voucher.minPrice)}
                      </span>
                    </p>

                    <p
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (!isExpired && !isBelowMinPrice) {
                          handleCopyVoucher(voucher.code);
                        }
                      }}
                    >
                      <strong>Mã:</strong>
                      {voucher.code}
                      {/* Nút Copy Voucher */}
                      <i className="fa-regular fa-copy text-dark ms-2"></i>
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      <i className="fa-regular fa-clock me-2"></i>
                      <span>
                        Ngày hết hạn:{" "}
                        {
                          new Date(voucher.expiryDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </span>
                    </p>
                  </div>
                  {/* Nút Áp dụng ngay */}
                  <button
                    onClick={() => {
                      handleApplyVoucher(voucher);
                      setHiddenVoucher(false);
                    }}
                    disabled={isExpired || isBelowMinPrice} // Vô hiệu hóa nếu không khả dụng
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#ed4d2b";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        isExpired || isBelowMinPrice ? "#ccc" : "white";
                      e.currentTarget.style.color = "#ed4d2b";
                    }}
                    style={{
                      height: "40px",
                      width: "100px",
                      marginTop: "60px",
                      marginRight: "10px",
                      // padding: "10px 20px",
                      backgroundColor:
                        isExpired || isBelowMinPrice ? "#ccsc" : "white",
                      color: "#ed4d2b",
                      border: "1px solid #ed4d2b",
                      borderRadius: "5px",
                      cursor:
                        isExpired || isBelowMinPrice
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Áp dụng ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Checkout;
