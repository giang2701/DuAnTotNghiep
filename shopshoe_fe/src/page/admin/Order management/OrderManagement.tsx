import React, { useEffect, useRef, useState } from "react";
import instance from "../../../api";
import { Order } from "../../../interface/Order";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";
const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [serachOrderCode, setSeachOrderCode] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null); //cho vào ordermanger
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };
  // Fetch orders khi component được render
  const fetchOrders = async () => {
    try {
      const { data } = await instance.get("/orders");
      console.table("data", data);

      // Sắp xếp các đơn hàng theo thời gian tạo (updatedAt hoặc createdAt)
      const sortedOrders = data.sort(
        (a: Order, b: Order) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setOrders(sortedOrders);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const selectedOrder = orders.find((order) => order._id === orderId);
    if (selectedOrder?.status === "Completed" && newStatus !== "Canceled") {
      toast.warning("Không thể thay đổi trạng thái khi đơn hàng đã hoàn thành");
      return;
    }
    if (
      (selectedOrder?.status === "Shipping" || // Đang vận chuyển
        selectedOrder?.status === "Delivered") && // Đã giao hàng
      newStatus === "Cancelled" // Muốn hủy
    ) {
      toast.warning(
        "Không thể hủy đơn hàng khi đang vận chuyển hoặc đã giao hàng."
      );
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
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Cập Nhật Trạng Thái Đơn Hàng Thành Công");
      fetchOrders();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.";
      Swal.fire({
        icon: "error",
        title: "Lỗi Khi Sửa Đơn Hàng",
        text: errorMessage, // Hiển thị nội dung của message
      });
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
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
    <div className="container" style={{ paddingTop: "5px", marginLeft: "5px" }}>
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
          <div className="box_table_products" style={{ marginBottom: "17px" }}>
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
                    onChange={(e) => setSeachOrderCode(e.target.value)} // Cập nhật giá trị tìm kiếm
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
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
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
                    onClick={() => handleFilterChange("Pending")}
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
                    onClick={() => handleFilterChange("Confirmed")}
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      width: "100%",
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    Đã xác nhận
                  </p>
                  <p
                    onClick={() => handleFilterChange("Shipping")}
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
                    onClick={() => handleFilterChange("Delivered")}
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      width: "100%",
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    Đã giao hàng
                  </p>
                  <p
                    onClick={() => handleFilterChange("Goodsreceived")}
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      width: "100%",
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    Đã nhận hàng
                  </p>
                  <p
                    onClick={() => handleFilterChange("Completed")}
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
                    onClick={() => handleFilterChange("Cancelled")}
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
                    <th>Ngày đặt</th>
                    <th>Thanh Toán</th>
                    <th>Trạng thái</th>
                    <th>Đổi trạng thái</th>
                    <th>Tổng tiền</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders
                    .slice(
                      (currentPage - 1) * productsPerPage,
                      currentPage * productsPerPage
                    )
                    .map((order, index) => (
                      <tr key={order._id}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{order._id}</td>
                        <td className="text-center">{order.userId.email}</td>
                        <td className="text-center">
                          {new Date(order.BookingDate).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="text-center">
                          {order.paymentMethod === "COD" ? (
                            <p
                              style={{
                                backgroundColor: "gray",
                                color: "white",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Chưa Thanh Toán
                            </p>
                          ) : order.paymentMethod === "MOMO" ? (
                            <p
                              style={{
                                backgroundColor: "green",
                                color: "white",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đã Thanh Toán
                            </p>
                          ) : (
                            order.paymentMethod
                          )}
                        </td>
                        <td
                          className="text-center text-white"

                          // style={getStatusStyle(order.status)} // Áp dụng style cho trạng thái
                        >
                          {order.status === "Pending" ? (
                            <p
                              style={{
                                backgroundColor: "#ffcc00",
                                color: "black",
                                // height: "30px",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đang xử lý
                            </p>
                          ) : order.status === "Confirmed" ? (
                            <p
                              style={{
                                backgroundColor: "#4caf50",
                                paddingTop: "8px",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đã xác nhận
                            </p>
                          ) : order.status === "Shipping" ? (
                            <p
                              style={{
                                backgroundColor: "#2196f3",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đang vận chuyển
                            </p>
                          ) : order.status === "Goodsreceived" ? (
                            <p
                              style={{
                                backgroundColor: "#f44336",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đã nhận hàng
                            </p>
                          ) : order.status === "Completed" ? (
                            <p
                              style={{
                                backgroundColor: "#8bc34a",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Hoàn thành
                            </p>
                          ) : order.status === "Delivered" ? (
                            <p
                              style={{
                                backgroundColor: "#009688",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đã giao hàng
                            </p>
                          ) : order.status === "Returning" ? (
                            <p
                              style={{
                                backgroundColor: "#009688",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đang hoan hang
                            </p>
                          ) : order.status === "Refunding" ? (
                            <p
                              style={{
                                backgroundColor: "#009688",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đang hoan tiền
                            </p>
                          ) : order.status === "Refundsuccessful" ? (
                            <p
                              style={{
                                backgroundColor: "#009688",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Hoàn Tiền Thành Công
                            </p>
                          ) : order.status === "Cancelled" ? (
                            <p
                              style={{
                                backgroundColor: "gray",
                                width: "100px",
                                display: "inline-block",
                                borderRadius: "2px",
                                padding: "2px",
                              }}
                            >
                              Đã hủy
                            </p>
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="text-center">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
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
                            {[
                              "Pending",
                              "Confirmed",
                              "Shipping",
                              "Delivered",
                              "Goodsreceived",
                              "Completed",
                              "Cancelled",
                              "Refunded", //hoàn tiền
                              "Returning", //Đang hoan hang
                              "Refunding", //đang hoàn tiền
                              "Refundsuccessful",
                            ].map((status, statusIndex, statusList) => (
                              <option
                                key={status}
                                value={status}
                                disabled={
                                  statusIndex <
                                    statusList.indexOf(order.status) || // Không cho phép quay lại trạng thái trước đó
                                  (status !== "Cancelled" && // Loại trừ "Đã hủy" khỏi điều kiện nhảy cóc
                                    statusIndex >
                                      statusList.indexOf(order.status) + 1) || // Chặn nhảy cóc qua trạng thái tiếp theo
                                  (status === "Goodsreceived" && true) // Vẫn giữ điều kiện cũ cho "Goodsreceived"
                                }
                                style={{
                                  color:
                                    statusIndex <
                                    statusList.indexOf(order.status)
                                      ? "gray"
                                      : "black",
                                  opacity:
                                    statusIndex <
                                    statusList.indexOf(order.status)
                                      ? "0.1"
                                      : "1",
                                  backgroundColor:
                                    status === "Pending" ? "white" : "white",
                                  fontSize: "16px",
                                  cursor:
                                    status === "Goodsreceived"
                                      ? "not-allowed"
                                      : status === "Returning"
                                      ? "not-allowed"
                                      : status === "Refunding"
                                      ? "not-allowed"
                                      : status === "Refundsuccessful"
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                {status === "Pending"
                                  ? "Đang chờ xử lý"
                                  : status === "Confirmed"
                                  ? "Đã xác nhận"
                                  : status === "Shipping"
                                  ? "Đang vận chuyển"
                                  : status === "Delivered"
                                  ? "Đã giao hàng"
                                  : status === "Goodsreceived"
                                  ? "Đã nhận hàng"
                                  : status === "Completed"
                                  ? "Đã hoàn thành"
                                  : status === "Returning"
                                  ? "Đang hoàn hàng"
                                  : status === "Refunding"
                                  ? "Đang hoàn tiền"
                                  : status === "Refundsuccessful"
                                  ? "Hoàn tiền thành công"
                                  : "Đã hủy"}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="text-center">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.totalPrice)}
                        </td>
                        <td className="d-flex  justify-content-center">
                          <button
                            title="Xem chi tiết"
                            // onClick={() => openOrderDetails(order)}
                            style={{
                              borderRadius: "5px",
                              width: "30px",
                              height: "30px",
                              backgroundColor: "black",
                              color: "white",
                              border: "none",
                              paddingTop: "2px",
                            }}
                          >
                            <Link
                              to={`/admin/viewproductdetails/${order._id}`}
                              style={{ color: "white" }}
                            >
                              <i className="fa-regular fa-eye"></i>
                            </Link>
                          </button>
                          <button
                            onClick={() => exportOrderDetailsToPDF(order)}
                            style={{
                              borderRadius: "5px",
                              width: "30px",
                              height: "30px",
                              backgroundColor: "black",
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
                              handleStatusChange(order._id, order.status)
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
              <Pagination
                count={Math.ceil(filteredOrders.length / productsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                className="d-flex justify-content-center mt-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderManagement;
