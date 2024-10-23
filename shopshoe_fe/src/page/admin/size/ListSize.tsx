import React, { useContext } from "react";
import { SizeContext, SizeContextType } from "../../../context/Size";
import { Link } from "react-router-dom";

const ListSize = () => {
    const { stateSize, DeleteSize } = useContext(
        SizeContext
    ) as SizeContextType;
    return (
        <>
            <div className="container">
                <div className="box_table_size my-3" style={{ width: "300px" }}>
                    <div className="header_table_Size bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                        <span>Danh Sách Size</span>
                        <Link
                            to="/admin/size/add"
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
                        style={{ width: "300px" }}
                    >
                        <table className="table table-bordered table-striped text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name Size</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stateSize.size.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.nameSize}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    DeleteSize(item._id)
                                                }
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

export default ListSize;
