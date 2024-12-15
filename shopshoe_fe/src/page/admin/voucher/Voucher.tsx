import { useState } from "react";
import { Link } from "react-router-dom";
import { useVoucher } from "../../../context/Voucher";
import type { Voucher } from "../../../interface/Voucher";
import { toast } from "react-toastify";
// import instance from "../../../api";

const Voucher = () => {
  const { voucher, Delete, toggleActiveStatus } = useVoucher();
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (voucher: any) => {
    setSelectedVoucher(voucher);
    setShowModal(true);
  };

  // Hàm sao chép mã voucher
  const handleCopyVoucher = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Voucher code copied to clipboard!", {
          autoClose: 2000, // Tự động đóng sau 3 giây
        });
      })
      .catch((err) => {
        alert("Failed to copy voucher code: " + err);
      });
  };

  return (
    <>
      <div className="container">
        <div className="box_table_size my-3" style={{ width: "700px" }}>
          <div className="header_table_Size bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
            <span>Danh Sách Size</span>
            <Link
              to="/admin/voucherAdd"
              className="bg-primary"
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "20px",
                paddingTop: "2px",
              }}
            >
              <i className="fa-solid fa-plus text-white fs-9"></i>
            </Link>
          </div>
          <div
            className="body_table_Size p-3 bg-white "
            style={{ width: "700px" }}
          >
            <table className="table table-bordered table-striped text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name Voucher</th>
                  <th>Code</th>
                  <th>Discount Type</th>
                  <th>Expiration Date</th>
                  <th>Action</th>
                  <th>IsActive(Trạng thái)</th>
                </tr>
              </thead>
              <tbody>
                {voucher?.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td className="text-danger">
                      {item.discount
                        ? item.type === "percent"
                          ? `${item.discount}%`
                          : `${Number(item.discount).toLocaleString()} VND`
                        : "N/A"}
                    </td>
                    <td>
                      {new Date(item.expiryDate).toISOString().split("T")[0]}
                    </td>

                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          className="me-3"
                          title="Xem chi tiết"
                          onClick={() => handleViewDetails(item)}
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
                          <i className="fa-regular fa-eye"></i>
                        </button>

                        <button
                          className="me-3"
                          title="Xóa"
                          onClick={() => Delete(item._id)}
                          style={{
                            borderRadius: "5px",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "black",
                            color: "white",
                            border: "none",
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                    <td className="d-flex justify-content-center">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckDefault"
                          style={{
                            height: "20px",
                            width: "40px",
                          }}
                          checked={item.isActive}
                          onChange={(e) =>
                            toggleActiveStatus(item._id, e.target.checked)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showModal && selectedVoucher && (
              <>
                {/* Overlay */}
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                  }}
                  onClick={() => setShowModal(false)} // Đóng modal khi nhấn ra ngoài
                ></div>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      padding: "20px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      zIndex: 1000,
                      borderRadius: "8px",
                      width: "500px",
                      height: "300px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="modal_voucher_admin d-flex border border-black"
                      style={{
                        height: "150px",
                        width: "100%",
                      }}
                    >
                      <div
                        className="voucher_first w-25"
                        style={{
                          backgroundColor: "#ed4d2d",
                        }}
                      >
                        <div className="Group_circle">
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                        </div>
                        <p>Voucher</p>
                        <i
                          className="fa-solid fa-ticket"
                          style={{
                            color: "#ed4d2d",
                            fontSize: "20px",
                            width: "50px",
                            height: "50px",
                            backgroundColor: "yellow",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                        ></i>
                      </div>
                      <div className="voucher_end bg-white w-75 pt-5 ps-4">
                        <p
                          style={{
                            fontSize: "16px",
                            textTransform: "capitalize",
                            fontWeight: "bold",
                          }}
                        >
                          {selectedVoucher.name}
                        </p>
                        <p
                          style={{
                            marginTop: "-5px",
                            textTransform: "capitalize",
                            // fontWeight: "bold",
                          }}
                        >
                          Đơn Tối Thiểu:&nbsp;
                          {selectedVoucher.minPrice.toLocaleString()}
                          &nbsp;VND
                        </p>
                        <p
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleCopyVoucher(selectedVoucher.code)
                          }
                        >
                          <strong>Mã:</strong>
                          {selectedVoucher.code}
                          {/* Nút Copy Voucher */}
                          <i className="fa-regular fa-copy text-dark ms-2"></i>
                        </p>
                        <p
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          <i className="fa-regular fa-clock me-2"></i>
                          <span>
                            Ngày hết hạn:{" "}
                            {
                              new Date(selectedVoucher.expiryDate)
                                .toISOString()
                                .split("T")[0]
                            }
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Voucher;
