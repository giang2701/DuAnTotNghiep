import axios from "axios";
import { useCart } from "../context/cart";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
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
            <div
                className="cart-page"
                style={{
                    width: "100%",
                    paddingLeft: "500px",
                    paddingTop: "50px",
                    paddingBottom: "50px",
                }}
            >
                <img
                    src="../../public/images/images.png"
                    alt=""
                    width={"400px"}
                />
            </div>
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
        const totalItems = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );
        if (totalItems === 0) {
            toast.error("Số lượng sản phẩm trong giỏ không hợp lệ.");
            return;
        }
        if (!isCartValid()) {
            toast.error(
                "Đặt hàng thất bại. Vui lòng kiểm tra giỏ hàng của bạn."
            );
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
                    <div className="cart-table-header ">
                        <div>Tên Sản Phẩm</div>
                        <div>Số Lượng</div>
                        <div>Tổng Tiền</div>
                        <div>Hành động</div>
                    </div>
                    {cart
                        ? cart.map((item: any) => {
                              const sizeProducts = item.product.sizeStock;
                              const key = `${item.product._id}-${item.size}`;
                              const sizeData = sizes[item.size]; // Lấy dữ liệu size từ state
                              const IdSize = sizeData?._id;

                              // Lọc sản phẩm theo IdSize
                              const stockBySize = sizeProducts.filter(
                                  (size: any) => size.size === IdSize
                              );
                              // Lấy giá trị stock từ sản phẩm đã lọc
                              const stockValue =
                                  stockBySize.length > 0
                                      ? stockBySize[0].stock
                                      : 0; // Nếu không có sản phẩm nào thì trả về 0

                              // Kiểm tra xem sản phẩm có active không
                              const isActive = item.product.isActive;

                              return (
                                  <div key={key} className="cart-item">
                                      <div
                                          className="cart-item-info"
                                          style={{
                                              opacity: isActive ? 1 : 0.3,
                                          }} // Thêm điều kiện opacity
                                      >
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
                                              <p className="text-danger">
                                                  Số lượng còn lại {stockValue}
                                              </p>
                                          </div>
                                      </div>
                                      <div
                                          className="cart-item-quantity"
                                          style={{
                                              opacity: isActive ? 1 : 0.3,
                                          }} // Thêm điều kiện opacity
                                      >
                                          <button
                                              onClick={() =>
                                                  handleQuantityChange(
                                                      item.product
                                                          ._id as string,
                                                      item.size as string,
                                                      false
                                                  )
                                              }
                                              disabled={!isActive} // Vô hiệu hóa nút nếu sản phẩm không active
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
                                              disabled={!isActive} // Vô hiệu hóa nút nếu sản phẩm không active
                                          >
                                              +
                                          </button>
                                      </div>
                                      <div className="cart-item-total">
                                          {formatPrice(
                                              item.price * tempQuantities[key]
                                          )}
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
                <div className="cart-table-mobile">
                    <table className="table ">
                        <thead>
                            <tr>
                                <th className="w-50">Tên Sản Phẩm</th>
                                <th>Số Lượng</th>
                                <th>Tổng Tiền</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart ? (
                                cart.map((item: any) => {
                                    // console.log(item.product.isActive);
                                    // điều kiện nếu isActive ===false thì sẽ ko dc ấn chỉ dc xóa
                                    // lấy b1 : lấy dc isActive

                                    const key = `${item.product._id}-${item.size}`;
                                    const sizeData = sizes[item.size]; // Lấy dữ liệu size từ state
                                    // Kiểm tra xem sản phẩm có active không
                                    const isActive = item.product.isActive;

                                    return (
                                        <tr key={key}>
                                            <td
                                                className="d-flex align-items-center "
                                                style={{
                                                    opacity: isActive ? 1 : 0.3,
                                                }}
                                            >
                                                {/* // Thêm điều kiện opacity} */}
                                                <img
                                                    src={item.product.images}
                                                    alt={item.product.title}
                                                    width={"50px"}
                                                    className="me-2"
                                                />
                                                <div
                                                    style={{
                                                        fontSize: "7px",
                                                    }}
                                                >
                                                    <p className="w-75">
                                                        {item.product.title}
                                                    </p>
                                                    <p>
                                                        Size:{" "}
                                                        {sizeData
                                                            ? sizeData.nameSize
                                                            : "Đang tải..."}
                                                    </p>
                                                    {/* Hiển thị tên size */}
                                                </div>
                                            </td>
                                            <td
                                                style={{
                                                    opacity: isActive ? 1 : 0.3,
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.product
                                                                ._id as string,
                                                            item.size as string,
                                                            false
                                                        )
                                                    }
                                                    disabled={!isActive}
                                                    className="w-25 border-0 rounded-3 me-2"
                                                >
                                                    -
                                                </button>
                                                <span>
                                                    {tempQuantities[key]}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.product._id,
                                                            item.size,
                                                            true
                                                        )
                                                    }
                                                    disabled={!isActive}
                                                    className="w-25 border-0 rounded-3 ms-2   "
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td
                                                className="text-danger"
                                                style={{ fontWeight: "600" }}
                                            >
                                                {formatPrice(
                                                    item.price *
                                                        tempQuantities[key]
                                                )}
                                            </td>
                                            <td>
                                                <p
                                                    className="ms-2"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.product._id
                                                        )
                                                    }
                                                >
                                                    🗑️
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <>
                                    <div>
                                        <img
                                            src="https://salanest.com/img/empty-cart.webp"
                                            alt=""
                                            width={"200px"}
                                        />
                                    </div>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="cart-summary">
                    <h3>Tổng tiền giỏ hàng</h3>
                    <p>Tổng sản phẩm: {cart.length}</p>
                    <p>Tổng tiền hàng: {formatPrice(Number(totalPrice))}</p>
                    <p>Thành tiền: {formatPrice(Number(totalPrice))}</p>
                    <p>Tạm tính: {formatPrice(Number(totalPrice))}</p>
                    <Link
                        to={
                            cart.some((item) => !item.product.isActive)
                                ? "#"
                                : "/checkOut"
                        }
                        onClick={(e) => {
                            if (cart.some((item) => !item.product.isActive)) {
                                e.preventDefault(); // Ngăn điều hướng khi có sản phẩm không hoạt động
                                Swal.fire({
                                    icon: "error",
                                    title: "Có Lỗi Xảy ra",
                                    text: "Sản Phẩm Bạn Đặt Không Còn Tại!!!",
                                });
                            } else {
                                handleCheckout();
                            }
                        }}
                        state={{ cart, totalPrice }}
                        className="checkout-button nav-link text-center text-white"
                    >
                        {cart.some((item) => !item.product.isActive)
                            ? "Vui Lòng Kiêm Tra Lại Sản Phẩm"
                            : "Đặt hàng"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
