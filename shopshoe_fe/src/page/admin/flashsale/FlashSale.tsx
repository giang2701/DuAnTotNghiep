import { useState } from "react";
import { Link } from "react-router-dom";
import { useFlashSale } from "../../../context/FlashSale";
import type { FlashSale } from "../../../interface/Products";

const FlashSale = () => {
    const { flashSale, DeleteFlashSale, toggleFlashSaleStatus } = useFlashSale();
    const [selectedFlashSale, setSelectedFlashSale] = useState<FlashSale | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewDetails = (flashSale: any) => {
        setSelectedFlashSale(flashSale);
        setShowModal(true);
    };

    return (
        <>
            <div className="container">
                <div className="box_table_size my-3" style={{ width: "700px" }}>
                    <div className="header_table_Size bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                        <span>Danh Sách Flash Sale</span>
                        <Link
                            to="/admin/flashSaleAdd"
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
                    <div className="body_table_Size p-3 bg-white" style={{ width: "700px" }}>
                        <table className="table table-bordered table-striped text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name Flash Sale</th>
                                    <th>Discount</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Action</th>
                                    {/* <th>IsActive(Trạng thái)</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {flashSale
                                    ?.filter((item) => item.isActive) // Lọc các Flash Sale có isActive là true
                                    .map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td className="text-danger">
                                                {item.discountPercent
                                                    ? item.type === "percent"
                                                        ? `${item.discountPercent}%`
                                                        : `${Number(item.discountPercent).toLocaleString()} VND`
                                                    : "N/A"}
                                            </td>
                                            <td>{new Date(item.startDate).toISOString().split("T")[0]}</td>
                                            <td>{new Date(item.endDate).toISOString().split("T")[0]}</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <button
                                                        className="me-3"
                                                        title="Xóa"
                                                        onClick={() => DeleteFlashSale(item._id)}
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
                                        </tr>
                                    ))}
                            </tbody>

                        </table>
                        {showModal && selectedFlashSale && (
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
                                            className="modal_flashsale_admin d-flex border border-black"
                                            style={{
                                                height: "150px",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                className="flashsale_first w-25"
                                                style={{
                                                    backgroundColor: "#28a745", // Màu xanh lá
                                                }}
                                            >
                                                <div className="Group_circle">
                                                    <div className="circle"></div>
                                                    {/* Bạn có thể tạo các vòng tròn hoặc icon tùy chỉnh ở đây */}
                                                </div>
                                                <p>Flash Sale</p>
                                                <i
                                                    className="fa-solid fa-bolt"
                                                    style={{
                                                        color: "#28a745",
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
                                            {/* <div className="flashsale_end bg-white w-75 pt-5 ps-4">
                                                <p
                                                    style={{
                                                        fontSize: "16px",
                                                        textTransform: "capitalize",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {selectedFlashSale.title}
                                                </p>
                                                <p
                                                    style={{
                                                        marginTop: "-5px",
                                                        textTransform: "capitalize",
                                                    }}
                                                >
                                                    Đơn Tối Thiểu:&nbsp;
                                                    {selectedFlashSale.minPrice.toLocaleString()}
                                                    &nbsp;VND
                                                </p>
                                                <p
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleCopyCode(selectedFlashSale.code)
                                                    }
                                                >
                                                    <strong>Mã:</strong>
                                                    {selectedFlashSale.code}
                                                    <i className="fa-regular fa-copy text-dark ms-2"></i>
                                                </p>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <i className="fa-regular fa-clock me-2"></i>
                                                    <span>
                                                        Ngày bắt đầu:{" "}
                                                        {
                                                            new Date(selectedFlashSale.startDate)
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                    </span>
                                                    <br />
                                                    <i className="fa-regular fa-clock me-2"></i>
                                                    <span>
                                                        Ngày kết thúc:{" "}
                                                        {
                                                            new Date(selectedFlashSale.endDate)
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                    </span>
                                                </p>
                                            </div> */}
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

export default FlashSale;
