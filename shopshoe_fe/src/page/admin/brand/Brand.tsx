import { useContext } from "react";
import { Link } from "react-router-dom";

import { SizeContext, SizeContextType } from "../../../context/Size";
import { BrandContext, BrandContextType } from "../../../context/Brand";

const Brand = () => {
    // console.log(data);
    const { brand, removeBrand } = useContext(BrandContext) as BrandContextType;
    console.log(brand);

    const { stateSize } = useContext(SizeContext) as SizeContextType;
    console.log(stateSize);
    return (
        <>
            <div className="container">
                <div className="box_table_cate mt-5" style={{ width: "700px" }}>
                    <div className="header_table_cate bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                        <span>Danh Sách Thương Hiệu</span>
                        <Link
                            to="/admin/brand-add"
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
                                cursor: "pointer",
                            }}
                        >
                            <i className="fa-solid fa-plus text-white fs-9"></i>
                        </Link>
                    </div>
                    <div className="body_table_cate p-3 bg-white">
                        <table className="table table-bordered table-striped  text-center">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Ngày Tạo</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brand.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.title}</td>
                                        <td>{item.createdAt}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className=" me-3"
                                                    onClick={() =>
                                                        removeBrand(item._id!)
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
                                                    to={`/admin/brand-edit/${item._id}`}
                                                    style={{
                                                        borderRadius: "5px",
                                                        width: "30px",
                                                        height: "30px",
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        border: "none",
                                                        fontSize: "1.2rem",
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Brand;
