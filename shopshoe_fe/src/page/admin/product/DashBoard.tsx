import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
    ProductContext,
    ProductContextType,
} from "../../../context/ProductContext";
import DialogRemove from "../../../component/DialogRemove";
import Pagination from "@mui/material/Pagination";

const DashBoard = () => {
    const { state, removeProduct, confirm, setConfirm, setIdDelete } =
        useContext(ProductContext) as ProductContextType;

    // Quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 7; // Số sản phẩm trên mỗi trang có thể điều chỉnh ở đây

    const handleConfirm = (_id: string) => {
        setConfirm(true);
        setIdDelete(_id);
    };

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setCurrentPage(value);
    };

    return (
        <>
            <div className="container" style={{ paddingTop: "50px" }}>
                <div className="box_table_products">
                    <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                        <span>Danh Sách</span>
                        <Link
                            to="/admin/add"
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
                    <div className="body_table_products p-3 bg-white">
                        <table className="table table-bordered table-striped">
                            <thead className="text-center">
                                <tr>
                                    <th>Title</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                    <th>Images</th>
                                    <th>Danh Mục</th>
                                    <th>Ngày Khởi Tạo</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.products
                                    .slice(
                                        (currentPage - 1) * productsPerPage,
                                        currentPage * productsPerPage
                                    )
                                    .map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.title}</td>
                                            <td className="text-center">
                                                {item.brand}
                                            </td>
                                            <td className="text-center">
                                                {item.price}
                                            </td>
                                            <td className="text-center">
                                                <img
                                                    src={`${item.images}`}
                                                    alt=""
                                                    width={"50px"}
                                                />
                                            </td>
                                            <td className="text-center">
                                                {item.category?.title}
                                            </td>
                                            <td className="text-center">
                                                {item.createdAt}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <button
                                                        className="me-3"
                                                        onClick={() =>
                                                            handleConfirm(
                                                                item._id!
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
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                    <Link
                                                        to={`/admin/edit/${item._id}`}
                                                        style={{
                                                            borderRadius: "5px",
                                                            width: "30px",
                                                            height: "30px",
                                                            backgroundColor:
                                                                "red",
                                                            color: "white",
                                                            border: "none",
                                                            fontSize: "1.2rem",
                                                            paddingLeft: "10px",
                                                            paddingTop: "5px",
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        {/* Thêm Pagination của MUI */}
                        <Pagination
                            count={Math.ceil(
                                state.products.length / productsPerPage
                            )} // Tổng số trang
                            page={currentPage} // Trang hiện tại
                            onChange={handlePageChange} // Xử lý khi thay đổi trang
                            color="primary"
                            className="d-flex justify-content-center mt-4"
                        />
                    </div>
                </div>
                <DialogRemove
                    isOpen={confirm}
                    onCloseDialog={setConfirm}
                    onConfirmDelete={removeProduct}
                />
            </div>
        </>
    );
};

export default DashBoard;
