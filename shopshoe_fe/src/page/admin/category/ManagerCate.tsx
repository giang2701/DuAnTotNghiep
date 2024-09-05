import { useContext } from "react";
import { Link } from "react-router-dom";
import {
    CategoryContext,
    CategoryContextType,
} from "../../../context/CategoryContext";

const ManagerCate = () => {
    // console.log(data);
    const { state, removeCategory } = useContext(
        CategoryContext
    ) as CategoryContextType;
    return (
        <>
            <div className="container">
                <Link to="/admin/category-add" className="btn btn-primary">
                    add
                </Link>
                <table className="table table-bordered table-striped w-25 text-center">
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.category.map((item) => (
                            <tr key={item._id}>
                                <td>{item.title}</td>
                                <td>
                                    <div className="d-flex">
                                        <button
                                            className="btn btn-danger me-3"
                                            onClick={() =>
                                                removeCategory(item._id!)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            to={`/admin/category-edit/${item._id}`}
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

export default ManagerCate;
