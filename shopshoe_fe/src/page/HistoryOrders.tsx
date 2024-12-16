import { useEffect, useState } from "react";
import instance from "../api";
import { toast } from "react-toastify";
import { Order } from "../interface/Order";
import Swal from "sweetalert2";
import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import axios from "axios";

const HistoryOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user._id : null;

  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [productId] = useState("6714ffaf2c9f0f1a49e63cc9");
  const [isFormOpen, setIsFormOpen] = useState(false); // Quản lý trạng thái form

  const submitComment = async () => {
    if (!userId) {
      return;
    }
    if (comment.length > 200) {
      toast.error("Bình luận không được vượt quá 200 ký tự.");
      return;
    }
    const newComment = { productId, userId, rating, comment };
    try {
      await axios.post("http://localhost:8000/api/comments", newComment);
      setRating(0);
      setComment("");
      setIsFormOpen(false);
      toast.success("Đánh giá thành công!"); // Hiển thị thông báo đánh giá thành công
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  const support = () => {
    Swal.fire({
      title: "Liên hệ với shop để nhận hỗ trợ: 0385137427",
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
    console.log("Filtered Orders:", filteredOrders);
    if (user?._id) {
      (async () => {
        try {
          const { data } = await instance.get(`/orders/user/${user._id}`);
          console.log(data);

          const sortedOrders = [...data].sort((a, b) => {
            if (a.status === "Pending" && b.status !== "Pending") return -1;
            if (a.status !== "Pending" && b.status === "Pending") return 1;
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
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
      await instance.put(`/orders/statusCancel/${orderId}`);
      toast.success("Đơn hàng đã được hủy.");
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: "Cancelled" } : order
      );

      const sortedOrders = updatedOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setOrders(sortedOrders);
      setFilteredOrders(
        sortedOrders.filter((order) => order.status === "Cancelled")
      );
      setSelectedStatus("Cancelled");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.";
      Swal.fire({
        icon: "error",
        title: "Lỗi Khi Chuyển trạng Thái",
        text: errorMessage,
      }).then(() => {
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
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p>{error}</p>;

  return (
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
        <div className="status-links-container" style={{ cursor: "pointer" }}>
          <p
            className={`status-links ${selectedStatus === "" ? "active" : ""}`}
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
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "20px 10px 100px",
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
                      className="Pimager"
                      alt={child.product.title}
                    />
                  </div>
                  <p className="p_History" style={{ fontSize: "12px" }}>
                    Số lượng: {child.quantity}
                  </p>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  bottom: "55px",
                  right: "10px",
                  textAlign: "right",
                  fontSize: "12px",
                }}
              >
                <p style={{ marginTop: "-60px" }} className="payMethod">
                  <strong>Phương thức thanh toán:</strong>{" "}
                  <strong style={{ fontSize: "13px" }} className="payMethod">
                    {item.paymentMethod}
                  </strong>
                </p>
                <p style={{ margin: 0 }} className="maDonHang">
                  <strong>Mã đơn hàng:</strong>{" "}
                  <strong style={{ color: "red" }}>{item._id}</strong>
                </p>
              </div>
              {item.status === "Cancelled" && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "gray",
                    position: "absolute",
                    bottom: "0px",
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
                      backgroundColor: "#817876",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      fontSize: "12px",
                      cursor: "not-allowed",
                    }}
                    disabled
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
                    backgroundColor: "#817876",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    cursor: "not-allowed",
                    width: "120px",
                  }}
                  disabled
                >
                  Không thể hủy
                </button>
              ) : item.status === "Completed" ? (
                <>
                  <button
                    onClick={() => setIsFormOpen(true)} // Hiển thị form
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "140px", // Đặt khoảng cách với nút "Không thể hủy"
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
                  }}
                >
                  Liên Hệ với Shop
                </button>
              ) : (
                <button
                  onClick={() => handleCancelOrder(item._id)}
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
                  }}
                >
                  Hủy đơn hàng
                </button>
              )}

              {isFormOpen && (
                <>
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      zIndex: 999,
                    }}
                    onClick={() => setIsFormOpen(false)} // Đóng form khi nhấp ngoài
                  />
                  {/* Form Popup */}
                  <Box
                    sx={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: "#ffffff",
                      zIndex: 1000,
                      minWidth: "300px",
                      border: "2px solid #ccc", // Thêm viền ngoài cho form
                    }}
                  >
                    {userId ? (
                      <div>
                        <Typography
                          variant="h6"
                          sx={{ marginBottom: "10px", fontWeight: "bold" }}
                        >
                          Viết bình luận
                        </Typography>
                        <Rating
                          name="rating"
                          value={rating}
                          onChange={(event, newValue) => setRating(newValue)}
                          sx={{ marginBottom: "10px" }}
                        />
                        <TextField
                          label="Viết bình luận..."
                          multiline
                          rows={2}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          variant="outlined"
                          fullWidth
                          sx={{
                            marginBottom: "10px",
                            backgroundColor: "#ffffff",
                            borderRadius: "5px",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={submitComment}
                            sx={{
                              textTransform: "none",
                              boxShadow: "#ffffff",
                            }}
                          >
                            Submit
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setIsFormOpen(false)} // Nút "Đóng"
                            sx={{ textTransform: "none" }}
                          >
                            Đóng
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Typography variant="h6" color="error">
                        Bạn cần đăng nhập để bình luận.
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
