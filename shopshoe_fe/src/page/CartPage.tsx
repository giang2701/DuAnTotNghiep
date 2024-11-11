import axios from "axios";
import { useCart } from "../context/cart";
import { useState, useEffect } from "react";


interface Size {
    _id: string;
    name: string;
    description: string;
}

const CartPage = () => {
    const { cart, getTotalPrice, removeFromCart, updateQuantity } = useCart();
    // State lưu trữ thông tin size của các sản phẩm
    const [sizes, setSizes] = useState<{ [key: string]: Size }>({});

    // State lưu trữ số lượng tạm thời cho từng sản phẩm trong giỏ
    const [tempQuantities, setTempQuantities] = useState<{ [key: string]: number }>({});

    // Hàm lấy thông tin size từ API
    const fetchSize = async (sizeId: string) => {
        try {
            const response = await axios.get<{ success: boolean; data: Size; message: string }>(`http://localhost:8000/api/size/${sizeId}`);
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
                if (!sizes[item.size]) {
                    fetchSize(item.size); // Tải thông tin size theo ID
                }
            });
        }
    }, [cart, sizes]);

    if (cart.length === 0) {
        return <div className="cart-page">Giỏ hàng của bạn hiện tại trống.</div>;
    }

    const totalPrice = getTotalPrice();

    // Hàm xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (productId: string, size: string, increment: boolean) => {
        const key = `${productId}-${size}`;
        const currentQuantity = tempQuantities[key] || 0;
        const newQuantity = increment ? currentQuantity + 1 : Math.max(currentQuantity - 1, 1); // Đảm bảo số lượng không nhỏ hơn 1

        // Cập nhật số lượng tạm thời
        setTempQuantities((prev) => ({
            ...prev,
            [key]: newQuantity,
        }));

        // Cập nhật số lượng thực tế trong giỏ (từ tempQuantities)
        updateQuantity(productId, newQuantity, size);
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
                    {cart ? cart.map((item) => {
                        const key = `${item.product._id}-${item.size}`;
                        const sizeData = sizes[item.size]; // Lấy dữ liệu size từ state

                        return (
                            <div key={key} className="cart-item">
                                <div className="cart-item-info">
                                    <img src={item.product.images} alt={item.product.title} className="product-image" />
                                    <div className="cart-item-details">
                                        <p>{item.product.title}</p>
                                        <p>Size: {sizeData ? sizeData.nameSize : "Đang tải..."}</p> {/* Hiển thị tên size */}
                                    </div>
                                </div>
                                <div className="cart-item-quantity">
                                    <button onClick={() => handleQuantityChange(item.product._id, item.size, false)}>-</button>
                                    <span>{tempQuantities[key]}</span>
                                    <button onClick={() => handleQuantityChange(item.product._id, item.size, true)}>+</button>
                                </div>
                                <div className="cart-item-total">{item.product.price * tempQuantities[key]}đ</div>
                                <div>
                                    <button onClick={() => removeFromCart(item.product._id)} className="remove-item">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    }) : ""}
                </div>
                <div className="cart-summary">
                    <h3>Tổng tiền giỏ hàng</h3>
                    <p>Tổng sản phẩm: {cart.length}</p>
                    <p>Tổng tiền hàng: {totalPrice}đ</p>
                    <p>Thành tiền: {totalPrice}đ</p>
                    <p>Tạm tính: {totalPrice}đ</p>
                    <button className="checkout-button">Đặt hàng</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
