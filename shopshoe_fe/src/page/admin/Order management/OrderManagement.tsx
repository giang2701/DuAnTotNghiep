import { useEffect, useRef, useState } from "react";
import instance from "../../../api";
import { Order } from "../../../interface/Order";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [serachOrderCode, setSeachOrderCode] = useState("");
    const modalRef = useRef<HTMLDivElement | null>(null); //cho vào ordermanger
    // Fetch orders khi component được render
    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get("/orders");
                console.table("data", data);

                // Sắp xếp các đơn hàng theo thời gian tạo (updatedAt hoặc createdAt)
                const sortedOrders = data.sort(
                    (a: Order, b: Order) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                );

                setOrders(sortedOrders);
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        })();
    }, []);

    // Cập nhật trạng thái đơn hàng
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const selectedOrder = orders.find((order) => order._id === orderId);
        if (selectedOrder?.status === "Completed" && newStatus !== "Canceled") {
            toast.warning(
                "Không thể thay đổi trạng thái khi đơn hàng đã hoàn thành"
            );
            return;
        }
        if (selectedOrder?.status === "Cancelled") {
            toast.warning("Không thể thay đổi trạng thái khi đơn hàng đã hủy");
            return;
        }
        try {
            await instance.put(`/orders/status/${orderId}`, {
                status: newStatus,
            });
            // console.log("Order ID:", orderId);
            // console.log("New Status Sent:", newStatus);
            // Cập nhật trạng thái trong mảng orders
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );
            toast.success("Cập Nhật Trạng Thái Đơn Hàng Thành Công");
        } catch (error) {
            console.log("Failed to update order status", error);
        }
    };
    // Mở form chi tiết đơn hàng
    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
    };
    // Đóng form chi tiết đơn hàng
    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                closeOrderDetails();
            }
        };
        // Thêm sự kiện khi component được mount
        document.addEventListener("mousedown", handleClickOutside);

        // Gỡ sự kiện khi component bị unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Lọc đơn hàng theo trạng thái
    const toggleFilter = () => {
        setFilterVisible((prevState) => !prevState);
    };
    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
        setFilterVisible(false);
    };
    // Lọc đơn hàng theo trạng thái và mã đơn hàng
    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filterStatus
            ? order.status === filterStatus
            : true;
        const matchesSearch = serachOrderCode
            ? order._id.toLowerCase().includes(serachOrderCode.toLowerCase())
            : true;
        return matchesStatus && matchesSearch;
    });
    // Hàm xuất chi tiết đơn hàng dưới dạng PDF
    const exportOrderDetailsToPDF = (order: any) => {
        const doc = new jsPDF();
        let yPosition = 20; // Vị trí y ban đầu

        // Tiêu đề
        doc.setFontSize(18);
        doc.text("Chi tiet don hang", 105, yPosition, { align: "center" });
        yPosition += 15;

        // Hàm loại bỏ dấu
        const removeAccents = (str: any) => {
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");
        };

        // Thông tin đơn hàng
        doc.setFontSize(12);
        const orderInfo = [
            `Ma don hang: ${removeAccents(order._id)}`,
            `Ten khach hang: ${removeAccents(order.shippingAddress.name)}`,
            `So dien thoai: ${removeAccents(order.shippingAddress.phone)}`,
            `Dia chi: ${removeAccents(order.shippingAddress.address)}`,
            `Thanh pho: ${removeAccents(order.shippingAddress.city)}`,
            `Quan: ${removeAccents(order.shippingAddress.district)}`,
            `Phuong: ${removeAccents(order.shippingAddress.ward)}`,
            `Phuong thuc thanh toan: ${removeAccents(order.paymentMethod)}`,
            `Tong tien: ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                currencyDisplay: "code", // Hiển thị "VND"
            }).format(order.totalPrice)}`,
        ];

        orderInfo.forEach((text) => {
            const lines = doc.splitTextToSize(text, 180);
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 10;

            if (yPosition + 10 > doc.internal.pageSize.height) {
                doc.addPage();
                yPosition = 20;
            }
        });

        // Dòng ngăn cách
        doc.setDrawColor(0);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;

        // Thêm danh sách sản phẩm
        doc.text("Danh sach san pham:", 20, yPosition);
        yPosition += 10;

        order.products.forEach((product: any, index: any) => {
            const productInfo = `${index + 1}. ${removeAccents(
                product.product.title
            )} - Size: ${removeAccents(product.size.nameSize)} - So luong: ${
                product.quantity
            }`;
            const lines = doc.splitTextToSize(productInfo, 180);

            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 10;

            if (yPosition + 10 > doc.internal.pageSize.height) {
                doc.addPage();
                yPosition = 20;
            }
        });

        // Tải file PDF
        doc.save(`${order._id}_details.pdf`);
    };

    return (
        <div
            className="container"
            style={{ paddingTop: "5px", marginLeft: "5px" }}
        >
            <div className="box_table_products">
                <div
                    className="container"
                    style={{
                        paddingTop: "50px",
                        marginBottom: "15px",
                        marginLeft: "-8px",
                        width: "100%",
                    }}
                >
                    <div
                        className="box_table_products"
                        style={{ marginBottom: "17px" }}
                    >
                        <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                            <span>Tìm kiếm</span>
                        </div>
                        <div className="body_table_products p-3 bg-white">
                            <div
                                className="d-flex align-items-center"
                                style={{ gap: "10px" }}
                            >
                                <div className="position-relative">
                                    <i
                                        className="fa-solid fa-magnifying-glass position-absolute"
                                        style={{
                                            left: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            zIndex: 1,
                                            fontSize: "16px",
                                        }}
                                    ></i>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo mã đơn hàng"
                                        className="form-control ps-5"
                                        style={{
                                            width: "500px",
                                            height: "43px",
                                            marginTop: "1px",
                                            fontSize: "15px",
                                        }}
                                        value={serachOrderCode}
                                        onChange={(e) =>
                                            setSeachOrderCode(e.target.value)
                                        } // Cập nhật giá trị tìm kiếm
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="box_table_products">
                <div
                    className="container"
                    style={{
                        paddingTop: "50px",
                        marginBottom: "15px",
                        marginLeft: "-8px",
                        width: "100%",
                    }}
                >
                    <div className="box_table_products">
                        <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                            <span>Danh sách người mua</span>
                            <i
                                className="fa-solid fa-filter"
                                style={{
                                    fontSize: "25px",
                                    paddingRight: "50px",
                                    cursor: "pointer",
                                }}
                                onClick={toggleFilter}
                            ></i>
                            {isFilterVisible && (
                                <div
                                    className="filter-form"
                                    style={{
                                        position: "absolute",
                                        top: "100px",
                                        right: "50px",
                                        backgroundColor: "white",
                                        borderRadius: "5px",
                                        boxShadow:
                                            "0 2px 10px rgba(0, 0, 0, 0.1)",
                                        padding: "10px",
                                        zIndex: 1000,
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "black",
                                            fontSize: "15px",
                                        }}
                                    >
                                        Trạng thái:
                                    </p>
                                    <p
                                        onClick={() =>
                                            handleFilterChange("Completed")
                                        }
                                        style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            width: "100%",
                                            cursor: "pointer",
                                            color: "black",
                                        }}
                                    >
                                        Hoàn thành
                                    </p>
                                    <p
                                        onClick={() =>
                                            handleFilterChange("Shipping")
                                        }
                                        style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            width: "100%",
                                            cursor: "pointer",
                                            color: "black",
                                        }}
                                    >
                                        Đang vận chuyển
                                    </p>
                                    <p
                                        onClick={() =>
                                            handleFilterChange("Pending")
                                        }
                                        style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            width: "100%",
                                            cursor: "pointer",
                                            color: "black",
                                        }}
                                    >
                                        Đang xử lý
                                    </p>
                                    <p
                                        onClick={() =>
                                            handleFilterChange("Cancelled")
                                        }
                                        style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            width: "100%",
                                            cursor: "pointer",
                                            color: "black",
                                        }}
                                    >
                                        Đã hủy
                                    </p>
                                    <p
                                        onClick={() => handleFilterChange("")}
                                        style={{
                                            display: "block",
                                            marginBottom: "10px",
                                            width: "100%",
                                            cursor: "pointer",
                                            color: "black",
                                        }}
                                    >
                                        Tất cả
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="body_table_products p-3 bg-white">
                            <table className="table table-bordered table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã đơn hàng</th>
                                        <th>Email người dùng</th>
                                        <th>Ngày khởi tạo</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <tr key={order._id}>
                                            <td className="text-center">
                                                {index + 1}
                                            </td>
                                            <td className="text-center">
                                                {order._id}
                                            </td>
                                            <td className="text-center">
                                                {order.userId.email}
                                            </td>
                                            <td className="text-center">
                                                {order.updatedAt}
                                            </td>
                                            <td className="text-center">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            order._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="form-select form-select-sm"
                                                    style={{
                                                        width: "190px",
                                                        height: "37px",
                                                        display: "inline-block",
                                                        color: "black",
                                                        fontSize: "16px",
                                                        marginTop: "6px",
                                                    }}
                                                >
                                                    <option
                                                        value="Pending"
                                                        style={{
                                                            backgroundColor:
                                                                "blue",
                                                            color: "white",
                                                        }}
                                                    >
                                                        Đang chờ xử lý
                                                    </option>
                                                    <option
                                                        value="Completed"
                                                        style={{
                                                            color: "black",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Đã hoàn thành
                                                    </option>
                                                    <option
                                                        value="Shipping"
                                                        style={{
                                                            color: "black",
                                                        }}
                                                    >
                                                        Đang vận chuyển
                                                    </option>
                                                    <option
                                                        value="Cancelled"
                                                        style={{
                                                            color: "black",
                                                        }}
                                                    >
                                                        Đã hủy
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="d-flex  justify-content-center">
                                                <button
                                                    title="Xem chi tiết"
                                                    onClick={() =>
                                                        openOrderDetails(order)
                                                    }
                                                    style={{
                                                        borderRadius: "5px",
                                                        width: "30px",
                                                        height: "30px",
                                                        backgroundColor:
                                                            "black",
                                                        color: "white",
                                                        border: "none",
                                                        paddingTop: "2px",
                                                    }}
                                                >
                                                    <i className="fa-regular fa-eye"></i>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        exportOrderDetailsToPDF(
                                                            order
                                                        )
                                                    }
                                                    style={{
                                                        borderRadius: "5px",
                                                        width: "30px",
                                                        height: "30px",
                                                        backgroundColor:
                                                            "black",
                                                        color: "white",
                                                        border: "none",
                                                        paddingTop: "2px",
                                                        marginLeft: "2px",
                                                    }}
                                                >
                                                    <i className="fa-solid fa-print"></i>
                                                    {/* Icon máy in */}
                                                </button>
                                                <i
                                                    className="fa-solid fa-pen d-none"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            order._id,
                                                            order.status
                                                        )
                                                    }
                                                    style={{
                                                        fontSize: "20px",
                                                        padding: "5px 10px",
                                                        marginBottom: "20px",
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        borderRadius: "9px",
                                                        paddingTop: "10px",
                                                        cursor: "pointer",
                                                    }}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Form chi tiết đơn hàng */}
            {selectedOrder && (
                <div
                    className="overlay__phanquyen"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền mờ
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        ref={modalRef}
                        className="boxPhanQuyen"
                        style={{
                            backgroundColor: "white",
                            width: "800px", // Chiếm gần như toàn bộ màn hình
                            height: "700px", // Chiếm gần như toàn bộ màn hình
                            borderRadius: "10px",
                            overflowY: "auto",
                            padding: "0px",
                            marginLeft: "100px",
                            marginBottom: "10px",
                        }}
                    >
                        <div className="orderCode">
                            <p className="pCode">
                                Mã Đơn Hàng: {selectedOrder._id}
                            </p>
                        </div>
                        <div className="text_order">
                            <div className="textOrderCode">
                                <h3
                                    style={{
                                        fontSize: "30px",
                                        paddingLeft: "30px",
                                        marginTop: "20px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    Thông tin đơn hàng người mua hàng
                                </h3>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">
                                        Tên khách hàng:
                                    </strong>
                                    {selectedOrder.shippingAddress.name}
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">
                                        Số điện thoại:
                                    </strong>
                                    {selectedOrder.shippingAddress.phone}
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">Địa chỉ:</strong>
                                    {selectedOrder.shippingAddress.address}
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">Thành phố:</strong>
                                    {selectedOrder.shippingAddress.city}
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">Quận: </strong>
                                    {selectedOrder.shippingAddress.district}
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">Phường: </strong>
                                    {selectedOrder.shippingAddress.ward}
                                </p>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">
                                        Phương thức thanh toán:
                                    </strong>
                                    {selectedOrder.paymentMethod}
                                </p>
                                <p
                                    className="Orderstatus"
                                    style={{
                                        fontSize: "16px",
                                        paddingLeft: "80px",
                                    }}
                                >
                                    <strong className="me-1">
                                        Trạng thái đơn hàng:
                                    </strong>
                                    <p className="orderStatus">
                                        {selectedOrder.status}
                                    </p>
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3
                                style={{
                                    fontSize: "30px",
                                    paddingLeft: "41px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                Sản phẩm
                            </h3>

                            {/* Thêm thanh cuộn cho phần sản phẩm */}
                            <div
                                style={{
                                    maxHeight: "110px", // Giới hạn chiều cao của container
                                    overflowY: "auto", // Thanh cuộn chỉ xuất hiện khi cần thiết
                                }}
                            >
                                {/* Duyệt qua các sản phẩm và hiển thị hình ảnh */}
                                <div>
                                    {selectedOrder.products.map(
                                        (product, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "10px",
                                                    marginLeft: "100px",
                                                }}
                                            >
                                                <img
                                                    src={product.product.images}
                                                    alt={product.product.title}
                                                    style={{
                                                        width: "80px",
                                                        height: "90px",
                                                        objectFit: "cover",
                                                        marginRight: "15px", // Khoảng cách giữa ảnh và thông tin
                                                    }}
                                                />
                                                <div>
                                                    <p>
                                                        {product.product.title}
                                                    </p>
                                                    <div className="order_Text">
                                                        <div className="code_Order"></div>
                                                    </div>

                                                    <p>
                                                        Size:{" "}
                                                        {product.size.nameSize}
                                                    </p>
                                                    <p>
                                                        Số lượng:{" "}
                                                        {product.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="orderText">
                            <div className="codeText"></div>
                        </div>
                        <p
                            style={{
                                fontSize: "20px",
                                paddingLeft: "500px",
                                color: "red",
                                marginTop: "60px",
                            }}
                        >
                            Tổng tiền :{" "}
                            {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.totalPrice
                            )}{" "}
                            VND
                        </p>
                        <button
                            className="btn btn-danger"
                            onClick={closeOrderDetails}
                            style={{
                                marginLeft: "590px",
                                borderRadius: "0px",
                                borderEndEndRadius: "10px",
                                borderTopLeftRadius: "10px",
                            }}
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default OrderManagement;
