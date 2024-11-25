import axios from "axios";
import { useCart } from "../context/cart";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

interface Size {
    _id: string;
    name: string;
    description: string;
}

const CartPage = () => {
    const { cart, getTotalPrice, removeFromCart, updateQuantity } = useCart();
    // console.log(cart);

    // State lưu trữ thông tin size của các sản phẩm
    const [sizes, setSizes] = useState<{ [key: string]: Size }>({});

    // State lưu trữ số lượng tạm thời cho từng sản phẩm trong giỏ
    const [tempQuantities, setTempQuantities] = useState<{
        [key: string]: number;
    }>({});


    const formatPrice = (price: number): string => {
        if (typeof price !== "number" || isNaN(price)) {
            return "Invalid Price";
        }
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };

    const isCartValid = () => {
        if (!cart || cart.length === 0) {
            return false;
        }

        // Kiểm tra từng sản phẩm trong giỏ
        for (const item of cart) {
            if (!item.product || !item.size || item.quantity <= 0) {
                return false;
            }
        }

        return true;
    };
    // Hàm lấy thông tin size từ API
    const fetchSize = async (sizeId: string) => {
        try {
            const response = await axios.get<{
                success: boolean;
                data: Size;
                message: string;
            }>(`http://localhost:8000/api/size/${sizeId}`);
            if (response.data.success) {
                setSizes((prev) => ({
                    ...prev,
                    [sizeId]: response.data.data,
                }));
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin size:", error);
        }
    };

    // Thiết lập số lượng ban đầu cho mỗi sản phẩm trong giỏ
    useEffect(() => {
        if (cart) {
            const initialQuantities = cart.reduce((acc, item) => {
                acc[`${item.product._id}-${item.size}`] = item.quantity;
                return acc;
            }, {} as { [key: string]: number });
            setTempQuantities(initialQuantities);
        }
    }, [cart]);

    // Gọi API lấy thông tin size cho mỗi sản phẩm trong giỏ hàng
    useEffect(() => {
        if (cart) {
            cart.forEach((item) => {
                if (!sizes[item.size as string]) {
                    fetchSize(item.size as string); // Tải thông tin size theo ID
                }
            });
        }
    }, [cart, sizes]);

    if (cart.length === 0) {
        return (
            <div className="cart-page">Giỏ hàng của bạn hiện tại trống.</div>
        );
    }

    const totalPrice = getTotalPrice();





    // Hàm xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (
        productId: string,
        size: string,
        increment: boolean
    ) => {
        const key = `${productId}-${size}`;
        const currentQuantity = tempQuantities[key] || 0;
        const item = cart.find(
            (item) => item.product._id === productId && item.size === size
        );
        const sizeStock = item?.product.sizeStock.find((s) => s.size === size);
        const stock = sizeStock ? sizeStock.stock : 0;
        const newQuantity = increment
            ? Math.min(currentQuantity + 1, stock)
            : Math.max(currentQuantity - 1, 1);

        // Cập nhật số lượng tạm thời
        setTempQuantities((prev) => ({
            ...prev,
            [key]: newQuantity,
        }));

        // Cập nhật số lượng thực tế trong giỏ
        updateQuantity(productId, newQuantity, size);
    };

    // Hàm xử lý dữ liệu khi chuyển đến trang thanh toán
    const handleCheckout = async () => {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (totalItems === 0) {
            toast.error("Số lượng sản phẩm trong giỏ không hợp lệ.");
            return;
        }
        if (!isCartValid()) {
            toast.error("Đặt hàng thất bại. Vui lòng kiểm tra giỏ hàng của bạn.");
            return;
        }

    };

    return (
        <div className="cart-page">
            <h2>
                Giỏ hàng của bạn <span>{cart.length} Sản Phẩm</span>
            </h2>
            <div className="cart-content">
                <div className="cart-table">
                    <div className="cart-table-header">
                        <div>Tên Sản Phẩm</div>
                        <div>Số Lượng</div>
                        <div>Tổng Tiền</div>
                        <div>Hành động</div>
                    </div>
                    {cart
                        ? cart.map((item: any) => {
                            const key = `${item.product._id}-${item.size}`;
                            const sizeData = sizes[item.size]; // Lấy dữ liệu size từ state

                            return (
                                <div key={key} className="cart-item">
                                    <div className="cart-item-info">
                                        <img
                                            src={item.product.images}
                                            alt={item.product.title}
                                            className="product-image"
                                        />
                                        <div className="cart-item-details">
                                            <p>{item.product.title}</p>
                                            <p>
                                                Size:{" "}
                                                {sizeData
                                                    ? sizeData.nameSize
                                                    : "Đang tải..."}
                                            </p>
                                            {/* Hiển thị tên size */}
                                        </div>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.product
                                                        ._id as string,
                                                    item.size as string,
                                                    false
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                        <span>{tempQuantities[key]}</span>
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.product._id,
                                                    item.size,
                                                    true
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="cart-item-total">
                                        {formatPrice(item.price * tempQuantities[key])}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() =>
                                                removeFromCart(
                                                    item.product._id
                                                )
                                            }
                                            className="remove-item"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                        : ""}
                </div>
                <div className="cart-summary">
                    <h3>Tổng tiền giỏ hàng</h3>
                    <p>Tổng sản phẩm: {cart.length}</p>
                    <p>Tổng tiền hàng:{formatPrice(Number(totalPrice))}</p>
                    <p>Thành tiền: {formatPrice(Number(totalPrice))}</p>
                    <p>Tạm tính:{formatPrice(Number(totalPrice))}</p>
                    <Link to={"/checkOut"} onClick={handleCheckout} state={{ cart, totalPrice }} className="checkout-button nav-link text-center">Đặt hàng</Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;