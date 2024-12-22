import { createContext, useEffect, useReducer } from "react";
import instance from "../api";
import { Size } from "../interface/Size";
import sizeReducer from "../reducers/SizeReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export type SizeContextType = {
    stateSize: { size: Size[] };
    dispatch: React.Dispatch<any>;
    CreateSize: (dataSize: Size) => void;
    DeleteSize: (_id: Size | undefined) => void;
};
export const SizeContext = createContext({} as SizeContextType);
export const SizeProvider = ({ children }: { children: React.ReactNode }) => {
    const [stateSize, dispatch] = useReducer(sizeReducer, { size: [] });
    const nav = useNavigate();

    const getSize = async () => {
        const { data } = await instance.get("/size");
        dispatch({ type: "GET_SIZE", payload: data.data });
    };
    useEffect(() => {
        getSize();
    }, []);
    const CreateSize = async (dataSize: Size) => {
        try {
            const data = await instance.post("/size", dataSize);
            dispatch({ type: "ADD_SIZE", payload: data.data });
            toast.success("Thêm size thành công");
            nav("/admin/size");
            console.log(dataSize);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Đã xảy ra lỗi khi thêm size. ",
                text: errorMessage, // Hiển thị nội dung của message
            }).then(() => {
                window.location.reload();
            });
        }
    };
    const DeleteSize = async (_id: Size | undefined) => {
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
                await instance.delete(`/size/${_id}`);
                dispatch({ type: "REMOVE_SIZE", payload: _id });
                getSize();
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
                title: "Lỗi Khi Xóa Size",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };
    return (
        <SizeContext.Provider
            value={{ stateSize, dispatch, CreateSize, DeleteSize }}
        >
            {children}
        </SizeContext.Provider>
    );
};
