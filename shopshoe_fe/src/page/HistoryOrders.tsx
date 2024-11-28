import { useEffect, useState } from "react";
import instance from "../api";
import { toast } from "react-toastify";
import { Order } from "../interface/Order";
const HistoryOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  console.log(user._id);

  useEffect(() => {
    console.log("Filtered Orders:", filteredOrders);
    if (user?._id) {
      (async () => {
        try {
          const { data } = await instance.get(`/orders/user/${user._id}`);
          console.log(data);

          const sortedOrders = [...data].sort((a, b) => {
            if (a.status === "Pending" && b.status !== "Pending") return -1;
            if (a.status !== "Pending" && b.status === "Pending") return 1;
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
      Shipping: "Đang vận chuyển",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy đơn",
    };
    return statusMap[status] || "Trạng thái không xác định";
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Gửi yêu cầu hủy đơn hàng tới API
      await instance.put(`/orders/status/${orderId}`, { status: "Cancelled" });
      toast.success("Đơn hàng đã được hủy.");

      // Cập nhật trạng thái đơn hàng trong local state
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: "Cancelled" } : order
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
    } catch (error) {
      setError("Không thể hủy đơn hàng.");
      console.error("Lỗi khi hủy đơn hàng:", error);
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
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container_History" style={{ paddingTop: "190px" }}>
      <div
        style={{
          position: "relative",
          border: "2px solid #ccc",
          width: "798px",
          marginLeft: "403px",
          borderRadius: "5px",
          marginBottom: "10px",
          height: "50px",
          marginTop: "-40px",
        }}
        className="menu_historyOrder"
      >
        <a
          href="#"
          className={`status-links ${selectedStatus === "" ? "active" : ""}`}
          onClick={() => handleFilter("")}
        >
          Tất cả
        </a>
        <a
          href="#"
          className={`status-link ${
            selectedStatus === "Pending" ? "active" : ""
          }`}
          onClick={() => handleFilter("Pending")}
        >
          Đang xử lý
        </a>
        <a
          href="#"
          className={`status-link ${
            selectedStatus === "Shipping" ? "active" : ""
          }`}
          onClick={() => handleFilter("Shipping")}
        >
          Đang vận chuyển
        </a>
        <a
          href="#"
          className={`status-link ${
            selectedStatus === "Completed" ? "active" : ""
          }`}
          onClick={() => handleFilter("Completed")}
        >
          Hoàn thành
        </a>
        <a
          href="#"
          className={`status-link  linkAHistory ${
            selectedStatus === "Cancelled" ? "active" : ""
          }`}
          onClick={() => handleFilter("Cancelled")}
        >
          Đã hủy
        </a>
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
          }}
          className="menu_HistoryOrder"
        >
          <i
            className="fa fa-shopping-cart cartHistory"
            style={{ fontSize: "40px", color: "#f39c12" }}
          ></i>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#f39c12",
              paddingTop: "150px",
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
                border: "2px solid #ccc",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                width: "800px",
                marginLeft: "400px",
                position: "relative",
              }}
              className="menu_HistoryOrder"
            >
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "red",
                  paddingLeft: "660px",
                }}
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
                    <span className="pOrder" style={{ fontSize: "18px" }}>
                      {child.product.title}
                    </span>
                  </p>
                  <p className="p_Order" style={{ fontSize: "12px" }}>
                    Size: {child.size.nameSize}
                  </p>
                  <div className="imageOrder">
                    <img
                      src={child.product.images}
                      style={{
                        width: "100px",
                        marginLeft: "20px",
                      }}
                      alt={child.product.title}
                    />
                  </div>
                  <p className="p_History" style={{ fontSize: "12px" }}>
                    Số lượng: {child.quantity}
                  </p>
                </div>
              ))}
              {/* Hiển thị mã đơn hàng và phương thức thanh toán */}
              <div
                style={{
                  position: "absolute",
                  bottom: "55px",
                  right: "10px",
                  textAlign: "right",
                  fontSize: "12px",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  <strong style={{ fontSize: "13px" }}>
                    {item.paymentMethod}
                  </strong>
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Mã đơn hàng:</strong>{" "}
                  <strong style={{ color: "red" }}>{item._id}</strong>
                </p>
              </div>
              {item.status === "Cancelled" && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "gray",
                    marginTop: "10px",
                  }}
                >
                  Đã hủy bởi bạn
                </p>
              )}
              <p
                style={{
                  fontSize: "18px",
                  position: "absolute",
                  bottom: "59px",
                  right: "50px",
                  fontWeight: "bold",
                }}
              >
                <span className="totalPrice">Thành tiền: </span>
                <span className="totalPrice2" style={{ color: "red" }}>
                  {item.totalPrice}
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
              ) : (
                <button
                  onClick={() => handleCancelOrder(item._id)}
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
