import { createContext, useEffect, useReducer } from "react";
import { Category } from "../interface/Category";
import categoryReducer from "../reducers/CategoryReducer";
import instance from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export type CategoryContextType = {
    state1: { category: Category[] };
    dispatch: React.Dispatch<any>;
    removeCategory: (_id: string | undefined) => void;
    handleCategory: (data: Category) => void;
};
export const CategoryContext = createContext({} as CategoryContextType);
const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [state1, dispatch] = useReducer(categoryReducer, { category: [] });
    const nav = useNavigate();
    //get all category
    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/categorys");
            dispatch({ type: "GET_CATEGORIES", payload: data.data });
        })();
    }, []);
    const removeCategory = async (_id: string | undefined) => {
        // try {
        //     await instance.delete(`/categorys/${_id}`);
        //     dispatch({ type: "REMOVE_CATEGORY", payload: _id });
        //     toast.success("Xóa thành công");
        // } catch (error) {
        //     toast.error("Xóa thất bại");
        // }
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
            buttonsStyling: false,
        });

        try {
            const result = await swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                await instance.delete(`/categorys/${_id}`);
                dispatch({ type: "REMOVE_CATEGORY", payload: _id });
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your file is safe :)",
                    icon: "error",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi Xóa Danh Mục ",
                text: errorMessage, // Hiển thị nội dung của message
            });
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
        } catch (error: any) {
            if (category._id) {
                // toast.error("Cập nhật thất bại");
                const errorMessage =
                    error.response?.data?.message ||
                    "Đã xảy ra lỗi, vui lòng thử lại sau.";
                Swal.fire({
                    icon: "error",
                    title: "Cập nhật thất bại ",
                    text: errorMessage, // Hiển thị nội dung của message
                }).then(() => {
                    window.location.reload();
                });
            } else {
                // toast.error("Thêm thất bại");
                const errorMessage =
                    error.response?.data?.message ||
                    "Đã xảy ra lỗi, vui lòng thử lại sau.";
                Swal.fire({
                    icon: "error",
                    title: "Thêm thất bại ",
                    text: errorMessage, // Hiển thị nội dung của message
                }).then(() => {
                    window.location.reload();
                });
            }
            console.log(error);
        }
    };

    return (
        <CategoryContext.Provider
            value={{ state1, dispatch, removeCategory, handleCategory }}
        >
            {children}
        </CategoryContext.Provider>
    );
};
export default CategoryProvider;
