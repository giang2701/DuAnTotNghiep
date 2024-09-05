import { useContext } from "react";
import { Link } from "react-router-dom";
import {
    ProductContext,
    ProductContextType,
} from "../../../context/ProductContext";

const DashBoard = () => {
    // console.log(data);
    const { state, removeProduct } = useContext(
        ProductContext
    ) as ProductContextType;
    return (
        <>
            <div className="container">
                <Link to="/admin/add" className="btn btn-primary">
                    add
                </Link>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>brand</th>
                            <th>price</th>
                            <th>images</th>
                            <th>Danh Muc</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.products.map((item) => (
                            <tr key={item._id}>
                                <td>{item.title}</td>
                                <td>{item.brand}</td>
                                <td>{item.price}</td>
                                <td>
                                    <img
                                        src={`${item.images}`}
                                        alt=""
                                        width={"50px"}
                                    />
                                </td>
                                <td>{item.category?.title}</td>
                                <td>
                                    <div className="d-flex">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                removeProduct(item._id!)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            to={`/admin/edit/${item._id}`}
                                            className="btn btn-warning"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DashBoard;
