import { useEffect, useState } from "react";
import instance from "../api";
import { toast } from "react-toastify";
import { Order } from "../interface/Order";
import Swal from "sweetalert2";
import CommentForm from "./CommentForm/CommentForm";
import { Link } from "react-router-dom";
import ReturnForm from "./ReturnForm/ReturnForm";
import ProceedReturnForm from "./ProceedReturnForm/ProceedReturnForm";
import RefundForm from "./refund/RefundForm ";

const RateButton = ({ order, onClick }: { order: Order; onClick: any }) => {
    const isRateAll = order?.products?.every((it) => it.isRated);

    if (isRateAll) return;

    return (
        <button
            onClick={onClick} // Hiển thị form
            style={{
                position: "absolute",
                bottom: "14px",
                right: "1300px", // Đặt khoảng cách với nút "Không thể hủy"
                backgroundColor: "#4caf50", // Màu xanh cho nút đánh giá
                color: "white",
                textTransform: "none",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "12px",
                cursor: "pointer",
                width: "120px",
            }}
        >
            Đánh giá
        </button>
    );
};
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
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReturnFormOpen, setIsReturnFormOpen] = useState(false);
    const [isProceedReturnFormOpen, setIsProceedReturnFormOpen] =
        useState(false);
    const [isRefundFormOpen, setIsRefundFormOpen] = useState(false);
    // console.log("isProceedReturnFormOpen", isProceedReturnFormOpen);

    const [isReturnRequested, setIsReturnRequested] = useState<{
        [key: string]: boolean;
    }>({}); // State theo dõi trạng thái yêu cầu hoàn trả
    const [isRefundRequested, setIsRefundRequested] = useState<{
        [key: string]: boolean;
    }>({});
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
    const getOrderByid = async () => {
        try {
            const { data } = await instance.get(`/orders/user/${user._id}`);
            const ids = data.map((order: any) => order._id); // Lấy tất cả các `id` trong danh sách
            console.log("ids", ids);

            const uniqueIds = new Set(ids); // Set tự động loại bỏ giá trị trùng lặp

            if (ids.length !== uniqueIds.size) {
                console.log("Dữ liệu bị trùng lặp:", ids);
            } else {
                console.log("Không có dữ liệu trùng lặp.");
            }

            const sortedOrders = [...data].sort((a, b) => {
                if (a.status === "Pending" && b.status !== "Pending") return -1;
                if (a.status !== "Pending" && b.status === "Pending") return 1;
                // Sắp xếp theo ngày nếu có các đơn hàng có cùng trạng thái
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Đảm bảo đơn hàng mới nhất lên đầu
                return 0;
            });
            const updatedIsRefundRequested = { ...isRefundRequested };
            data.forEach((order: Order) => {
                updatedIsRefundRequested[order._id] =
                    order.isRefundRequested ?? false; // Gán giá trị từ API
            });
            setIsRefundRequested(updatedIsRefundRequested);
            const updatedIsReturnRequested = { ...isReturnRequested };
            data.forEach((order: Order) => {
                updatedIsReturnRequested[order._id] = false;
            });
            setOrders(sortedOrders);
            setFilteredOrders(data);
            setIsReturnRequested(updatedIsReturnRequested);
        } catch (error) {
            setError("Có lỗi khi tải đơn hàng.");
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // console.log("Filtered Orders:", filteredOrders);
        if (user?._id) {
            getOrderByid();
        } else {
            setLoading(false);
        }
    }, [user?._id]);
    const refreshAfterComment = ({
        type,
        productId,
        orderId,
    }: {
        type: "SINGLE_RATE" | "RATE_ALL";
        productId?: string;
        orderId: string;
    }) => {
        if (type === "SINGLE_RATE") {
            const newOrders = filteredOrders?.map((it) => {
                if (it._id === orderId) {
                    const newProducts = it?.products?.map((it) =>
                        it.product._id === productId
                            ? { ...it, isRated: true }
                            : it
                    );

                    return { ...it, products: newProducts };
                }

                return it;
            });

            setFilteredOrders(newOrders);
        } else {
            const newOrders = filteredOrders?.map((it) => {
                if (it._id === orderId) {
                    const newProducts = it?.products?.map((it) => ({
                        ...it,
                        isRated: true,
                    }));

                    return { ...it, products: newProducts };
                }

                return it;
            });

            setFilteredOrders(newOrders);
        }
    };
    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            Pending: "Đang  xử lý",
            Confirmed: "Xác nhận",
            Shipping: "Đang vận chuyển",
            Goodsreceived: "Đã Nhận Được Hàng",
            Completed: "Hoàn thành",
            Cancelled: "Đã hủy đơn",
            Delivered: "Đã giao hàng",
            Refunded: "Đã hoàn tiền",
            Returning: "Đang hoàn hàng",
            Refunding: "Đang hoàn tiền",
            Refundsuccessful: "Hoàn tiền thành công",

            // "Pending", //đang xử lý
            //   "Confirmed", // đã Xác nhận
            //   "Shipping", // đang vận chuyển
            //   "Goodsreceived", //Đã nhận được hàng
            //   "Completed", //hoan thành
            //   "Cancelled", // hủy
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
            // getOrderByid();
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
        // console.log("orderId", orderId);
    };

    const handleFilter = (status: string) => {
        setSelectedStatus(status);
    };
    useEffect(() => {
        if (selectedStatus === "") {
            const sortedOrders = [...orders].sort((a, b) => {
                if (a.status === "Pending" && b.status !== "Pending") return -1;
                if (a.status !== "Pending" && b.status === "Pending") return 1;
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Đảm bảo đơn hàng mới nhất lên đầu
            });
            setFilteredOrders(sortedOrders);
        } else {
            setFilteredOrders(
                orders.filter((order) => order.status === selectedStatus)
            );
        }
    }, [selectedStatus, orders]);

    if (loading) return <p>Đang tải đơn hàng...</p>;
    if (error) return <p>{error}</p>;
    const detailOrder = async (orderId: string) => {
        try {
            const { data } = await instance.get(`/orders/${orderId}`);
            setDetailOrderById(data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi xem chi tiết",
                text: "Đã xảy ra lỗi, vui lòng thử lagi sau.",
            });
        }
    };
    const handleGoodsreceived = async (orderId: string) => {
        try {
            // Gửi yêu cầu cập nhật trạng thái tới server
            await instance.put(`/orders/statusGoodsreceived/${orderId}`);

            // Cập nhật danh sách đơn hàng trong local state
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status: "Completed" }
                        : order
                )
            );

            // Nếu đang lọc danh sách, cập nhật danh sách đã lọc
            setFilteredOrders((prevFilteredOrders) =>
                prevFilteredOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status: "Completed" }
                        : order
                )
            );

            // Đặt trạng thái được chọn là "Completed"
            setSelectedStatus("Completed");
        } catch (error) {
            toast(
                "Cập Nhật Trạng Thái Không Thành Công .Vui Lòng Liên Hệ 0385137427 để được hỗ trợ "
            );
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
                        marginLeft: "293px",
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
                            className={`status-link ${
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
                                selectedStatus === "Confirmed" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Confirmed")}
                        >
                            Đã xác nhận
                        </p>
                        <p
                            className={`status-link ${
                                selectedStatus === "Shipping" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Shipping")}
                        >
                            Vận chuyển
                        </p>
                        <p
                            className={`status-link ${
                                selectedStatus === "Delivered" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Delivered")}
                        >
                            Đã giao hàng
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
                            className={`status-link ${
                                selectedStatus === "Returning" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Returning")}
                        >
                            Hoàn hàng
                        </p>
                        <p
                            className={`status-link ${
                                selectedStatus === "Refunding" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("Refunding")}
                        >
                            Hoàn tiền
                        </p>
                        <p
                            className={`status-link ${
                                selectedStatus === "Refundsuccessful"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => handleFilter("Refundsuccessful")}
                        >
                            Hoàn tiền thành công
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
                            marginLeft: "29px",
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
                            style={{ width: "200px", marginLeft: "600px" }}
                        />
                        <p
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#f84d2e",
                                // paddingTop: "150px",
                                marginBottom: "500px",
                            }}
                        >
                            Chưa có đơn hàng nào
                        </p>
                    </div>
                ) : (
                    <>
                        {filteredOrders.map((item: any) => (
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
                                    marginLeft: "293px",
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
                                        paddingLeft: "1200px",
                                    }}
                                    className="pStatus"
                                >
                                    {getStatusText(item.status)}
                                </p>
                                {item.products.map((child: any) => (
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
                                    </div>
                                ))}
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
                                        bottom: "15px",
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
                                                bottom: "15px",
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
                                            bottom: "15px",
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
                                ) : item.status === "Delivered" ? (
                                    <button
                                        style={{
                                            position: "absolute",
                                            bottom: "15px",
                                            right: "10px",
                                            backgroundColor: "white",
                                            color: "red",
                                            border: "1px solid red",
                                            padding: "10px 20px",
                                            borderRadius: "5px",
                                            fontSize: "12px",
                                            width: "120px",
                                        }}
                                        onClick={() => {
                                            handleGoodsreceived(item._id);
                                        }}
                                    >
                                        Đã Nhận Hàng
                                    </button>
                                ) : item.status === "Completed" ? (
                                    <>
                                        {item.return &&
                                            item.return.status ===
                                                "Bị từ chối" && (
                                                <button
                                                    style={{
                                                        position: "absolute",
                                                        bottom: "14px",
                                                        right: "420px", // Điều chỉnh vị trí cho phù hợp
                                                        backgroundColor:
                                                            "orange", // Màu sắc cho nút
                                                        color: "white",
                                                        border: "none",
                                                        padding: "10px 20px",
                                                        borderRadius: "5px",
                                                        fontSize: "12px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        Swal.fire({
                                                            icon: "info",
                                                            title: "Lý do từ chối",
                                                            text:
                                                                item.return
                                                                    .rejectionReason ||
                                                                "Không có lý do từ chối.",
                                                        });
                                                    }}
                                                >
                                                    Hoàn trả bị từ chối
                                                </button>
                                            )}{" "}
                                        <RateButton
                                            onClick={() => {
                                                setIsFormOpen(true);
                                                setSelectedOrder(item);
                                            }}
                                            order={item}
                                        />
                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "14px",
                                                left: "1025px", // Đặt vị trí bên trái nút Đánh giá
                                                backgroundColor:
                                                    item.isReturning
                                                        ? "grey"
                                                        : "#f44336", // Màu đỏ cho nút hoàn trả
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                cursor: item.isReturning
                                                    ? "not-allowed"
                                                    : "pointer", // Đổi con trỏ chuột
                                                width: "120px",
                                            }}
                                            disabled={item.isReturning} // Disable nút nếu đã yêu cầu hoàn trả
                                            onClick={() => {
                                                setIsReturnFormOpen(true);
                                                setSelectedOrder(item);
                                            }}
                                        >
                                            Hoàn trả
                                        </button>
                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "15px",
                                                right: "10px",
                                                backgroundColor: "#817876", // Màu khi vận chuyển
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                cursor: "not-allowed", // Ngăn không cho nút nhấn
                                                width: "129px",
                                            }}
                                        >
                                            {" "}
                                            Không thể hủy
                                        </button>
                                    </>
                                ) : item.status === "Returning" ? (
                                    <>
                                        {item.return.status ===
                                            "Đã được phê duyệt" && (
                                            <button
                                                style={{
                                                    position: "absolute",
                                                    bottom: "14px",
                                                    right: "290px",
                                                    backgroundColor: "#4caf50",
                                                    color: "white",
                                                    textTransform: "none",
                                                    border: "none",
                                                    padding: "10px 20px",
                                                    borderRadius: "5px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    width: "130px",
                                                }}
                                                onClick={() => {
                                                    setIsProceedReturnFormOpen(
                                                        true
                                                    );
                                                    setSelectedOrder(item);
                                                }}
                                            >
                                                Tiến hành hoàn
                                            </button>
                                        )}

                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "15px",
                                                right: "10px",
                                                backgroundColor: "#817876", // Màu khi vận chuyển
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                cursor: "not-allowed", // Ngăn không cho nút nhấn
                                                width: "129px",
                                            }}
                                        >
                                            {" "}
                                            Không thể hủy
                                        </button>
                                    </>
                                ) : item.status === "Refunding" ? (
                                    <>
                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "14px",
                                                right: "290px",

                                                color: "white",
                                                textTransform: "none",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                backgroundColor:
                                                    item.isRefundRequested
                                                        ? "grey"
                                                        : "#f44336",
                                                cursor: item.isRefundRequested
                                                    ? "not-allowed"
                                                    : "pointer",

                                                width: "130px",
                                            }}
                                            disabled={item.isRefundRequested}
                                            onClick={() => {
                                                setIsRefundFormOpen(true);
                                                setSelectedOrder(item);
                                            }}
                                        >
                                            Hoàn tiền
                                        </button>
                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "15px",
                                                right: "10px",
                                                backgroundColor: "#817876", // Màu khi vận chuyển
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                cursor: "not-allowed", // Ngăn không cho nút nhấn
                                                width: "129px",
                                            }}
                                        >
                                            {" "}
                                            Không thể hủy
                                        </button>
                                    </>
                                ) : item.status === "Refunding" ? (
                                    <>
                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "15px",
                                                right: "10px",
                                                backgroundColor: "#817876", // Màu khi vận chuyển
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                cursor: "not-allowed", // Ngăn không cho nút nhấn
                                                width: "129px",
                                            }}
                                        >
                                            {" "}
                                            Không thể hủy
                                        </button>
                                    </>
                                ) : item.status === "Refundsuccessful" ? (
                                    <>
                                        <button
                                            style={{
                                                position: "absolute",
                                                bottom: "15px",
                                                right: "10px",
                                                backgroundColor: "#817876", // Màu khi vận chuyển
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                cursor: "not-allowed", // Ngăn không cho nút nhấn
                                                width: "129px",
                                            }}
                                        >
                                            {" "}
                                            Không thể hủy
                                        </button>
                                    </>
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
                                            padding: "10px 27px",
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
                                        bottom: "14px",
                                        right: "145px",
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
                        <RefundForm
                            open={isRefundFormOpen}
                            onClose={() => setIsRefundFormOpen(false)}
                            order={selectedOrder}
                            refreshAfterRefund={getOrderByid}
                            // Hàm refresh danh sách đơn hàng
                            isRefundRequested={isRefundRequested} // Truyền state
                            setIsRefundRequested={setIsRefundRequested} // Truyền hàm cập nhật state// Hàm refresh danh sách đơn hàng
                        />
                        <ProceedReturnForm
                            open={isProceedReturnFormOpen}
                            onClose={() => setIsProceedReturnFormOpen(false)}
                            order={selectedOrder}
                            refreshAfterProceedReturn={getOrderByid}
                        />
                        <CommentForm
                            open={isFormOpen}
                            onClose={() => setIsFormOpen(false)}
                            selectedOrder={selectedOrder}
                            refreshAfterComment={refreshAfterComment}
                        />
                        <ReturnForm
                            open={isReturnFormOpen}
                            onClose={() => setIsReturnFormOpen(false)}
                            order={selectedOrder}
                            refreshAfterReturn={getOrderByid}
                        />
                    </>
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
                                                <Link
                                                    to={`/detail/${item.product._id}`}
                                                    className="nav-link"
                                                >
                                                    {item.product.title}
                                                </Link>
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
