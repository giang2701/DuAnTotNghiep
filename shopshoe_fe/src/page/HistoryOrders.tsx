import { useEffect, useState } from "react";
import instance from "../api";
import { toast } from "react-toastify";
import { Order } from "../interface/Order";
import Swal from "sweetalert2";
const HistoryOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [detailOrderById, setDetailOrderById] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCopyOrderId = () => {
        const orderId = detailOrderById?._id;
        if (orderId) {
            navigator.clipboard
                .writeText(orderId)
                .then(() => {
                    toast.success("Mã đơn hàng đã được sao chép!");
                })
                .catch((err) => {
                    toast.error("Sao chép thất bại: ", err);
                });
        }
    };
    const support = () => {
        Swal.fire({
            title: "Liên hệ với shop để nhận hỗ trơ: 0385137427",
            showClass: {
                popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
            },
            hideClass: {
                popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
            },
        });
    };

    useEffect(() => {
        // console.log("Filtered Orders:", filteredOrders);
        if (user?._id) {
            (async () => {
                try {
                    const { data } = await instance.get(
                        `/orders/user/${user._id}`
                    );
                    // console.log(data);

                    const sortedOrders = [...data].sort((a, b) => {
                        if (a.status === "Pending" && b.status !== "Pending")
                            return -1;
                        if (a.status !== "Pending" && b.status === "Pending")
                            return 1;
                        // Sắp xếp theo ngày nếu có các đơn hàng có cùng trạng thái
                        const dateA = new Date(a.createdAt).getTime();
                        const dateB = new Date(b.createdAt).getTime();
                        return dateB - dateA; // Đảm bảo đơn hàng mới nhất lên đầu
                        return 0;
                    });

                    setOrders(sortedOrders);
                    setFilteredOrders(data);
                } catch (error) {
                    setError("Có lỗi khi tải đơn hàng.");
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            setLoading(false);
        }
    }, [user?._id]);

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            Pending: "Đang  xử lý",
            Shipping: "vận chuyển",
            Completed: "Hoàn thành",
            Cancelled: "Đã hủy đơn",
        };
        return statusMap[status] || "Trạng thái không xác định";
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            // Gửi yêu cầu hủy đơn hàng tới API
            await instance.put(`/orders/statusCancel/${orderId}`);
            toast.success("Đơn hàng đã được hủy.");

            // Cập nhật trạng thái đơn hàng trong local state
            const updatedOrders = orders.map((order) =>
                order._id === orderId
                    ? { ...order, status: "Cancelled" }
                    : order
            );

            // Sắp xếp lại danh sách đơn hàng theo thời gian, đơn mới nhất lên đầu
            const sortedOrders = updatedOrders.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Đảm bảo đơn mới nhất lên đầu
            });

            // Cập nhật lại danh sách đơn hàng sau khi sắp xếp
            setOrders(sortedOrders);

            // Nếu người dùng đang lọc theo trạng thái 'Đã hủy', thì lọc lại đơn hàng
            setFilteredOrders(
                sortedOrders.filter((order) => order.status === "Cancelled")
            );

            // Cập nhật lại trạng thái lọc hiện tại
            setSelectedStatus("Cancelled");
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi Chuyển trạng Thái",
                text: errorMessage, // Hiển thị nội dung của message
            }).then(() => {
                // Reload lại trang sau khi nhấn OK
                window.location.reload();
            });
        }
    };

    const handleFilter = (status: string) => {
        setSelectedStatus(status);
        if (status === "") {
            const sortedOrders = [...orders].sort((a, b) => {
                if (a.status === "Pending" && b.status !== "Pending") return -1;
                if (a.status !== "Pending" && b.status === "Pending") return 1;
                return 0;
            });
            setFilteredOrders(sortedOrders);
        } else {
            setFilteredOrders(
                orders.filter((order) => order.status === status)
            );
        }
    };

    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <p>{error}</p>;
    const detailOrder = async (orderId: string) => {
        try {
            const { data } = await instance.get(`/orders/${orderId}`);
            console.log(data);
            setDetailOrderById(data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi xem chi tiếttiết",
                text: "Đã xảy ra lỗi, vui lòng thử lagi sau.",
            });
        }
    };
    return (
        <>
            <div
                className="container_History"
                style={{ paddingTop: "190px", marginBottom: "500px" }}
            >
                <div
                    style={{
                        position: "relative",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        width: "798px",
                        marginLeft: "403px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        height: "50px",
                        marginTop: "-40px",
                    }}
                    className="menu_historyOrder"
                >
                    <div
                        className="status-links-container"
                        style={{ cursor: "pointer" }}
                    >
                        <p
                            className={`status-links ${
                                selectedStatus === "" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("")}
                        >
                            Tất cả
                        </p>
                        <p
                            className={`status-link ${
                                selectedStatus === "Pending" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Pending")}
                        >
                            Đang xử lý
                        </p>
                        <p
                            className={`status-link ${
                                selectedStatus === "Shipping" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Shipping")}
                        >
                            Đang vận chuyển
                        </p>
                        <p
                            className={`status-link ${
                                selectedStatus === "Completed" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Completed")}
                        >
                            Hoàn thành
                        </p>
                        <p
                            className={`status-link  linkAHistory ${
                                selectedStatus === "Cancelled" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Cancelled")}
                        >
                            Đã hủy
                        </p>
                    </div>
                </div>
                {/* Kiểm tra và hiển thị thông báo nếu không có đơn hàng */}
                {filteredOrders.length === 0 ? (
                    <div
                        style={{
                            border: "2px solid #ccc",
                            width: "798px",
                            marginLeft: "403px",
                            borderRadius: "5px",
                            marginBottom: "10px",
                            padding: "20px",
                            textAlign: "center",
                            height: "500px",
                            paddingTop: "100px",
                        }}
                        className="menu_HistoryOrder"
                    >
                        <img
                            src="../../public/images/image no order.jpeg"
                            alt=""
                            style={{ width: "200px" }}
                        />
                        <p
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#f84d2e",
                                // paddingTop: "150px",
                                // marginBottom: "500px",
                            }}
                        >
                            Chưa có đơn hàng nào
                        </p>
                    </div>
                ) : (
                    <div>
                        {filteredOrders.map((item) => (
                            <div
                                key={item._id}
                                style={{
                                    // border: "2px solid #ccc",
                                    boxShadow:
                                        "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                    padding: "20px 10px 50px",
                                    marginBottom: "15px",
                                    borderRadius: "8px",
                                    width: "800px",
                                    marginLeft: "400px",
                                    position: "relative",
                                    // backgroundColor: "red",
                                }}
                                className="menu_HistoryOrder"
                            >
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        color: "red",
                                        paddingLeft: "670px",
                                    }}
                                    className="pStatus"
                                >
                                    {getStatusText(item.status)}
                                </p>
                                {item.products.map((child) => (
                                    <div
                                        key={child.product._id}
                                        style={{ marginBottom: "20px" }}
                                        className="historyOrder"
                                    >
                                        <p className="pHistory">
                                            <span
                                                className="pOrder"
                                                style={{ fontSize: "18px" }}
                                            >
                                                {child.product.title}
                                            </span>
                                        </p>
                                        <p
                                            className="p_Order"
                                            style={{ fontSize: "12px" }}
                                        >
                                            Size: {child.size.nameSize}
                                        </p>
                                        <div className="imageOrder">
                                            <img
                                                src={child.product.images}
                                                style={{
                                                    width: "100px",
                                                    marginLeft: "20px",
                                                }}
                                                className="Pimager"
                                                alt={child.product.title}
                                            />
                                        </div>
                                        <p
                                            className="p_History"
                                            style={{ fontSize: "12px" }}
                                        >
                                            Số lượng: {child.quantity}
                                        </p>
                                    </div>
                                ))}
                                {/* Hiển thị mã đơn hàng và phương thức thanh toán */}
                                {/* <div
                                    style={{
                                        position: "absolute",
                                        bottom: "55px",
                                        right: "10px",
                                        textAlign: "right",
                                        fontSize: "12px",
                                    }}
                                >
                                    <p
                                        style={{ marginTop: "-60px" }}
                                        className="payMethod"
                                    >
                                        <strong>Phương thức thanh toán:</strong>{" "}
                                        <strong
                                            style={{ fontSize: "13px" }}
                                            className="payMethod"
                                        >
                                            {item.paymentMethod}
                                        </strong>
                                    </p>
                                    <p
                                        style={{ margin: 0 }}
                                        className="maDonHang"
                                    >
                                        <strong>Mã đơn hàng:</strong>{" "}
                                        <strong style={{ color: "red" }}>
                                            {item._id}
                                        </strong>
                                    </p>
                                </div> */}
                                {item.status === "Cancelled" && (
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "gray",
                                            position: "absolute",
                                            // top: "260px",
                                            bottom: "0px",
                                            // backgroundColor: "red",
                                        }}
                                    >
                                        Đã hủy bởi bạn
                                    </p>
                                )}
                                <p
                                    style={{
                                        fontSize: "18px",
                                        position: "absolute",
                                        bottom: "5px",
                                        right: "50px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <span className="totalPrice">
                                        Thành tiền:{" "}
                                    </span>
                                    <span
                                        className="totalPrice2"
                                        style={{ color: "red" }}
                                    >
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(item.totalPrice)}
                                    </span>
                                </p>

                                {item.status === "Cancelled" ? (
                                    <div>
                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "10px",
                                                right: "10px",
                                                backgroundColor: "#817876", // Màu khi đã hủy
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                cursor: "not-allowed", // Thêm hiệu ứng không cho click
                                                width: "120px",
                                            }}
                                            disabled // Ngăn không cho nút "Đã hủy" được nhấn
                                        >
                                            Đã hủy
                                        </button>
                                    </div>
                                ) : item.status === "Shipping" ? (
                                    <button
                                        style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            right: "10px",
                                            backgroundColor: "#817876", // Màu khi vận chuyển
                                            color: "white",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "5px",
                                            fontSize: "12px",
                                            cursor: "not-allowed", // Ngăn không cho nút nhấn
                                            width: "120px",
                                        }}
                                        disabled
                                    >
                                        Không thể hủy
                                    </button>
                                ) : item.status === "Completed" ? (
                                    <button
                                        style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            right: "10px",
                                            backgroundColor: "#817876", // Màu khi vận chuyển
                                            color: "white",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "5px",
                                            fontSize: "12px",
                                            cursor: "not-allowed", // Ngăn không cho nút nhấn
                                            width: "120px",
                                        }}
                                    >
                                        {" "}
                                        Không thể hủy
                                    </button>
                                ) : item.paymentMethod === "MOMO" ? (
                                    <button
                                        onClick={() => support()}
                                        style={{
                                            position: "absolute",
                                            bottom: "15px",
                                            right: "10px",
                                            backgroundColor: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            // marginBottom: "30px",
                                        }}
                                    >
                                        Liên Hệ với Shop
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleCancelOrder(item._id)
                                        }
                                        style={{
                                            position: "absolute",
                                            bottom: "15px",
                                            right: "10px",
                                            backgroundColor: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            // marginBottom: "30px",
                                        }}
                                    >
                                        Hủy đơn hàng
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        detailOrder(item._id);
                                        setIsModalOpen(!isModalOpen);
                                    }}
                                    style={{
                                        position: "absolute",
                                        bottom: "12px",
                                        right: "140px",
                                        backgroundColor: "red",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 20px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        // marginBottom: "30px",
                                    }}
                                >
                                    Chi Tiết Đơn Hàng
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Overlay */}
            <div
                className={`overlayOrderDetail ${isModalOpen ? "show" : ""}`}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                    cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(false)}
            ></div>
            <div
                className={`orderById ${isModalOpen ? "show" : ""}`}
                style={{
                    position: "fixed",
                    top: 0,
                    left: "35%",
                    width: "500px",
                    height: "100%",
                    bottom: "0",
                    backgroundColor: "white",
                    zIndex: 999,
                }}
            >
                <div className="container__orderById">
                    <div className="header__orderById d-flex align-items-center">
                        <i
                            className="fa-regular fa-circle-xmark"
                            style={{ fontSize: "25px", cursor: "pointer" }}
                            onClick={() => setIsModalOpen(false)}
                        ></i>
                        &nbsp;&nbsp;&nbsp;
                        <h2>Chi Tiết Đơn Hàng</h2>
                    </div>
                    <div className="body__orderById">
                        <p>
                            <i className="fa-brands fa-amazon-pay"></i>
                            &nbsp; Thanh Toán bằng{" "}
                            {detailOrderById?.paymentMethod}
                        </p>
                        <p>Địa Chỉ Nhận Hàng</p>
                        <div className="address_body__orderById d-flex ">
                            <i className="fa-regular fa-map"></i>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="address">
                                <p>
                                    {detailOrderById?.shippingAddress.name}
                                    &nbsp;&nbsp;
                                    <span style={{ color: "#828282" }}>
                                        {detailOrderById?.shippingAddress.phone}
                                    </span>
                                </p>
                                <p>
                                    {detailOrderById?.shippingAddress.address}
                                    ,&nbsp;&nbsp;
                                    {detailOrderById?.shippingAddress.ward}
                                    ,&nbsp;&nbsp;
                                    {detailOrderById?.shippingAddress.district}
                                    ,&nbsp;&nbsp;
                                    {detailOrderById?.shippingAddress.city}
                                    &nbsp;&nbsp;
                                    {detailOrderById?.shippingAddress.city}
                                    &nbsp;&nbsp;
                                </p>
                            </div>
                        </div>
                        <p>Thông tin sản phẩm</p>
                        <div className="info_order__body__orderById">
                            {detailOrderById?.products.map((item) => (
                                <>
                                    <div className="sub_info_order__body__orderById">
                                        <div className="d-flex">
                                            <img
                                                src={`${item.product.images}`}
                                                alt=""
                                                style={{
                                                    width: "100px",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                            <p
                                                style={{
                                                    display: "-webkit-box", // Bắt buộc để sử dụng -webkit-line-clamp
                                                    WebkitBoxOrient: "vertical", // Xác định cách sắp xếp hộp
                                                    WebkitLineClamp: "1", // Số dòng tối đa
                                                    overflow: "hidden", // Ẩn phần nội dung dư thừa
                                                    textOverflow: "ellipsis", // Thêm dấu ba chấm
                                                    whiteSpace: "nowrap", // Ngăn không cho xuống dòng
                                                    width: "310px", // Đặt chiều rộng cố định
                                                }}
                                            >
                                                {item.product.title}
                                            </p>
                                        </div>
                                        <div className="info d-flex justify-content-around">
                                            <p>
                                                Size:&nbsp;{item.size.nameSize}
                                            </p>
                                            <p>x{item.quantity}</p>
                                        </div>
                                        <div className="info_price">
                                            <p>
                                                đ&nbsp;
                                                {item.product.price.toLocaleString(
                                                    "vi-VN",
                                                    {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                        <div className="footer__orderById">
                            <p>
                                Tổng Tiền: &nbsp;
                                {detailOrderById?.totalPrice.toLocaleString(
                                    "vi-VN",
                                    {
                                        style: "currency",
                                        currency: "VND",
                                    }
                                )}
                            </p>
                            <p>
                                Mã Đơn Hàng :&nbsp;{" "}
                                <span style={{ textTransform: "uppercase" }}>
                                    {detailOrderById?._id}
                                </span>
                                &nbsp;&nbsp;
                                <i
                                    className="fa-regular fa-copy"
                                    style={{ cursor: "pointer" }}
                                    onClick={handleCopyOrderId}
                                ></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HistoryOrders;
