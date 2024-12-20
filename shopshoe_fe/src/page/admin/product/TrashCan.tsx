import RestoreIcon from "@mui/icons-material/Restore";
import Pagination from "@mui/material/Pagination";
import { useContext, useEffect, useState } from "react";
import instance from "../../../api";
import DialogRemove from "../../../component/DialogRemove";
import {
    ProductContext,
    ProductContextType,
} from "../../../context/ProductContext";
import { Product } from "../../../interface/Products";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const TrashCan = () => {
    const { removeProduct, confirm, setConfirm, setIdDelete, handleDelete } =
        useContext(ProductContext) as ProductContextType;
    const [productsFalse, setProductsFalse] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("titleAsc"); // Thay đổi trạng thái sắp xếp
    const productsPerPage = 7;
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/products`);
            console.log("data", data.data);
            // Lọc sản phẩm chỉ lấy những sản phẩm có isActive là true
            const activeProducts = data.data.filter(
                (product: Product) => product.isActive === false
            );
            console.log("activeProducts", activeProducts);
            setProductsFalse(activeProducts);
        })();
    });
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

    const handleSortChange = (option: string) => {
        setSortOption(option);
    };

    const filteredProducts = productsFalse
        .filter(
            (product) =>
                product.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                product.createdAt.includes(searchTerm)
        )
        .sort((a, b) => {
            // Sắp xếp theo tùy chọn
            switch (sortOption) {
                case "titleAsc":
                    return a.title.localeCompare(b.title); // A-Z
                case "titleDesc":
                    return b.title.localeCompare(a.title); // Z-A
                case "dateAsc":
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    ); // Ngày tăng dần
                case "dateDesc":
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    ); // Ngày giảm dần
                default:
                    return 0;
            }
        });
    const hanldeRestore = async (_id: string) => {
        try {
            await instance.put(`/products/status/${_id}`, {
                isActive: true,
            });
            toast.success("Kho/INFO: Sản phẩm đã khoi phuc");
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi Xóa Sản Phẩm",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };
    return (
        <>
            <div className="container" style={{ paddingTop: "50px" }}>
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
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle box-sort"
                                    type="button"
                                    id="sortMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Sắp xếp
                                </button>
                                <ul
                                    className="dropdown-menu"
                                    aria-labelledby="sortMenuButton"
                                >
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() =>
                                                handleSortChange("titleAsc")
                                            }
                                        >
                                            Từ A-Z
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() =>
                                                handleSortChange("titleDesc")
                                            }
                                        >
                                            Từ Z-A
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() =>
                                                handleSortChange("dateAsc")
                                            }
                                        >
                                            Ngày tăng dần
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() =>
                                                handleSortChange("dateDesc")
                                            }
                                        >
                                            Ngày giảm dần
                                        </button>
                                    </li>
                                </ul>
                            </div>
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
                                    placeholder="Tìm kiếm theo tên hoặc ngày tạo"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="form-control ps-5" // Thêm padding bên trái để có chỗ cho biểu tượng
                                    style={{
                                        width: "500px",
                                        height: "43px",
                                        marginTop: "1px",
                                        fontSize: "15px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box_table_products">
                    <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                        <span>Danh Sách</span>
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
                                {filteredProducts
                                    .slice(
                                        (currentPage - 1) * productsPerPage,
                                        currentPage * productsPerPage
                                    )
                                    .map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.title}</td>
                                            <td className="text-center">
                                                {item.brand?.title}
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
                                                    {/* <button
                                                        className="me-3"
                                                        onClick={() =>
                                                            handleDelete(
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
                                                    </button> */}
                                                    <button
                                                        style={{
                                                            borderRadius: "5px",
                                                            width: "30px",
                                                            height: "30px",
                                                            backgroundColor:
                                                                "#1b75d5",
                                                            color: "white",
                                                            border: "none",
                                                            fontSize: "1.2rem",
                                                            // paddingLeft: "10px",
                                                            // paddingTop: "5px",
                                                        }}
                                                        onClick={() =>
                                                            hanldeRestore(
                                                                item._id!
                                                            )
                                                        }
                                                    >
                                                        <RestoreIcon
                                                            sx={{
                                                                fontSize:
                                                                    "2rem",
                                                            }}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <Pagination
                            count={Math.ceil(
                                filteredProducts.length / productsPerPage
                            )}
                            page={currentPage}
                            onChange={handlePageChange}
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

export default TrashCan;
