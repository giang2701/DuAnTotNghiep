import { createContext, useEffect, useReducer } from "react";
import { Category } from "../interface/Category";
import categoryReducer from "../reducers/CategoryReducer";
import instance from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export type CategoryContextType = {
    state: { category: Category[] };
    dispatch: React.Dispatch<any>;
    removeCategory: (_id: string | undefined) => void;
    handleCategory: (data: Category) => void;
};
export const CategoryContext = createContext({} as CategoryContextType);
const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(categoryReducer, { category: [] });
    const nav = useNavigate();
    //get all category
    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/categorys");
            dispatch({ type: "GET_CATEGORIES", payload: data.data });
        })();
    }, []);
    const removeCategory = async (_id: string | undefined) => {
        try {
            await instance.delete(`/categorys/${_id}`);
            dispatch({ type: "REMOVE_CATEGORY", payload: _id });
            toast.success("Xóa thành công");
        } catch (error) {
            toast.error("Xóa thất bại");
        }
    };
    const handleCategory = async (category: Category) => {
        try {
            // Tạo một bản sao của category và xóa các thuộc tính không cần thiết
            const { _id, title } = category;
            const payload: any = { title };

            if (_id) {
                const { data } = await instance.put(
                    `/categorys/${_id}`,
                    payload
                );
                dispatch({ type: "UPDATE_CATEGORY", payload: data.data });
                toast.success("Cập nhật thành công");
            } else {
                const { data } = await instance.post(`/categorys`, payload);
                dispatch({ type: "ADD_CATEGORY", payload: data.data });
                toast.success("Thêm thành công");
            }
            nav("/admin/category");
        } catch (error) {
            if (category._id) {
                toast.error("Cập nhật thất bại");
            } else {
                toast.error("Thêm thất bại");
            }
            console.log(error);
        }
    };

    return (
        <CategoryContext.Provider
            value={{ state, dispatch, removeCategory, handleCategory }}
        >
            {children}
        </CategoryContext.Provider>
    );
};
export default CategoryProvider;
