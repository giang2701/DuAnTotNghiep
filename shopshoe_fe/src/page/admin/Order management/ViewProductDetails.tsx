import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { Order } from "../../../interface/Order";
import instance from "../../../api";

const ViewProductDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]); // Lưu trạng thái đã chọn
  // Lấy ID từ URL
  const { id } = useParams<{ id: string }>(); // Truy xuất ID từ URL
  const statuses = [
    "Pending",
    "Confirmed",
    "Shipping",
    "Delivered",
    "Goodsreceived",
    "Completed",
    "Cancelled",
  ];

  const detailOrder = async (_id: string) => {
    try {
      const { data } = await instance.get(`/orders/${_id}`);
      setSelectedOrder(data);

      let newActiveStatuses = [];

      // Xác định trạng thái hợp lệ
      if (data.status === "Cancelled") {
        newActiveStatuses = ["Pending", "Cancelled"]; // Đảm bảo "Cancelled" luôn có mặt
      } else {
        newActiveStatuses = statuses.slice(
          0,
          statuses.indexOf(data.status) + 1
        );
      }

      setActiveStatuses(newActiveStatuses);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    }
  };

  useEffect(() => {
    if (id) {
      detailOrder(id);
    }
  }, [id]);
  if (!selectedOrder) {
    return <p>Đang tải...</p>;
  }

  return (
    <div>
      <div className="containerView mt-2">
        <div className="Order_Code">
          <h1 className="h1viewOrder">Chi tiết đơn hàng</h1>
          <div className="orderCode1">
            <p className="me-1">Mã đơn hàng:{selectedOrder._id}</p>
          </div>
          <div className="orderCode2">
            <p>
              {new Date(selectedOrder.updatedAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
              , ,
              {new Date(selectedOrder.updatedAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="viewProductDetail">
          <div>
            <table style={{ width: "600px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      background: "#f4f4f4",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Hình ảnh
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      background: "#f4f4f4",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Tên sản phẩm
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      background: "#f4f4f4",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Size
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      background: "#f4f4f4",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Số lượng
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      background: "#f4f4f4",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Giá sản phẩm
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      <img
                        src={product.product.images}
                        alt={product.product.title}
                        style={{
                          width: "100px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      {product.product.title}
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      {product.size.nameSize}
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      {product.quantity}
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      {product.product.price.toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                ))}
                {/* Dòng mới để hiển thị tổng tiền */}
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      fontWeight: "bold",
                      background: "#f4f4f4",
                    }}
                  >
                    Tổng tiền:
                    {selectedOrder.totalPrice.toLocaleString("vi-VN")} VND
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="transportActivities"
            style={{
              marginTop: "60px",
              paddingBottom: "10px",
              paddingLeft: "30px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
          >
            <h3 style={{ paddingTop: "15px" }}>Hoạt động vận chuyển</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {statuses.map((status, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: activeStatuses.includes(status)
                        ? "green"
                        : "#808080",
                      marginRight: "10px",
                    }}
                  ></div>
                  {activeStatuses.includes(status) &&
                    status !== "Cancelled" && (
                      <div
                        style={{
                          height: "20px",
                          width: "2px",
                          background: "green",
                          position: "absolute",
                          top: "25px",
                          left: "10px",
                        }}
                      ></div>
                    )}
                  {activeStatuses.includes(status) && (
                    <p style={{ margin: 0 }}>
                      {status === "Pending" && "Đơn hàng đang chờ xử lý"}
                      {status === "Confirmed" && "Đơn hàng đã được xác nhận"}
                      {status === "Shipping" && "Đang vận chuyển"}
                      {status === "Delivered" && "Đang giao hàng"}
                      {status === "Goodsreceived" && "Đơn hàng đã được nhận"}
                      {status === "Completed" && "Đơn hàng đã hoàn tất"}
                      {status === "Cancelled" && "Đơn hàng đã bị hủy"}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="viewProductDetail2">
          <div className="viewInformation">
            <p className="pViewOrder" style={{ paddingTop: "10px" }}>
              Chi tiết kháck hàng
            </p>
            <div className="viewInformation1">
              <i
                className="fa-regular fa-user fa5User"
                style={{
                  border: "1px solid black",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  paddingLeft: "8px",
                  fontSize: "25px",
                  paddingTop: "5px",
                }}
              ></i>
              <span> {selectedOrder.shippingAddress.name}</span>
              <br />
              <br />
              <div className="viewPhone">
                <i
                  className="fa-solid fa-phone f5Phone"
                  style={{
                    border: "1px solid black",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50px",
                    paddingLeft: "8px",
                    fontSize: "20px",
                    paddingTop: "10px",
                  }}
                ></i>
                <span> {selectedOrder.shippingAddress.phone}</span>
                <br />
                <i
                  className="fa-solid fa-envelope fa-5email"
                  style={{
                    border: "1px solid black",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50px",
                    paddingLeft: "8px",
                    fontSize: "20px",
                    paddingTop: "10px",
                  }}
                ></i>
                <span> {selectedOrder.userId.email}</span>
                <br />
              </div>
            </div>
          </div>
          <div className="viewAdress">
            <p className="pViewaddress" style={{ paddingTop: "15px" }}>
              Địa chỉ giao hàng
            </p>
            <div className="pViewaddress1">
              <i
                className="fa-solid fa-location-dot"
                style={{
                  border: "1px solid black",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  paddingLeft: "11px",
                  fontSize: "20px",
                  paddingTop: "10px",
                }}
              ></i>
              <span> {selectedOrder.shippingAddress.address}</span>
              <br />
              <i
                className="fa-solid fa-city"
                style={{
                  border: "1px solid black",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  paddingLeft: "7px",
                  fontSize: "20px",
                  paddingTop: "10px",
                }}
              ></i>
              <span style={{ marginLeft: "5px" }}>
                {selectedOrder.shippingAddress.city}
              </span>
              <br />
              <i
                className="fa fa-home"
                style={{
                  border: "1px solid black",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  paddingLeft: "7px",
                  fontSize: "20px",
                  paddingTop: "10px",
                }}
              ></i>
              <span style={{ marginLeft: "5px" }}>
                {selectedOrder.shippingAddress.district}
              </span>
              <br />
              <div className="iconWard">
                <i
                  className="fa fa-map-pin"
                  style={{
                    border: "1px solid black",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50px",
                    paddingLeft: "10px",
                    fontSize: "25px",
                    paddingTop: "10px",
                  }}
                ></i>
                <span style={{ marginLeft: "5px" }}>
                  {selectedOrder.shippingAddress.ward}
                </span>
                <br />
              </div>
            </div>
          </div>
          <div className="paymentMethod">
            <p className="pPaymentMethod" style={{ paddingTop: "15px" }}>
              Địa chỉ thanh toán
            </p>
            <div className="pPaymentMethod1">
              <i
                className="fa fa-credit-card"
                style={{
                  border: "1px solid black",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  paddingLeft: "7px",
                  fontSize: "20px",
                  paddingTop: "10px",
                }}
              ></i>
              <span style={{ marginLeft: "5px" }}>
                {selectedOrder.paymentMethod}
              </span>
              <br />
              <span className="orderStatus">
                {selectedOrder.status === "Pending" && (
                  <>
                    <i
                      className="fa fa-clock"
                      style={{
                        border: "1px solid black",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        paddingTop: "10px",
                      }}
                    ></i>{" "}
                    Pending
                  </>
                )}
                {selectedOrder.status === "Confirmed" && (
                  <>
                    <i
                      className="fa fa-check-circle"
                      style={{
                        border: "1px solid black",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        paddingTop: "10px",
                      }}
                    ></i>{" "}
                    Confirmed
                  </>
                )}
                {selectedOrder.status === "Shipping" && (
                  <>
                    <i
                      className="fa fa-truck"
                      style={{
                        border: "1px solid black",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        paddingTop: "10px",
                      }}
                    ></i>{" "}
                    Shipping
                  </>
                )}
                {selectedOrder.status === "Delivered" && (
                  <>
                    <i
                      className="fa fa-box-open"
                      style={{
                        border: "1px solid black",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        paddingTop: "10px",
                      }}
                    ></i>{" "}
                    Delivered
                  </>
                )}
                {selectedOrder.status === "Goodsreceived" && (
                  <>
                    <i
                      className="fa fa-thumbs-up"
                      style={{
                        border: "1px solid black",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        paddingTop: "10px",
                      }}
                    ></i>{" "}
                    Goods Received
                  </>
                )}
                {selectedOrder.status === "Completed" && (
                  <>
                    <i
                      className="fa fa-clipboard-check"
                      style={{
                        border: "1px solid black",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        paddingTop: "10px",
                      }}
                    ></i>{" "}
                    Completed
                  </>
                )}
                {selectedOrder.status === "Cancelled" && (
                  <>
                    <i
                      className="fa fa-times-circle"
                      style={{
                        border: "1px solid black",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        paddingTop: "10px",
                      }}
                    ></i>{" "}
                    Cancelled
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetails;
