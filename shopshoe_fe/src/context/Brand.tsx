import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api";
import { Brand } from "../interface/Brand";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export type BrandContextType = {
    brand: Brand[];
    setBrand: (brand: Brand[]) => void;
    removeBrand: (_id: string | undefined) => void;
    handleBrand: (brand: Brand) => void;
};
export const BrandContext = createContext({} as BrandContextType);
const BrandProvider = ({ children }: { children: React.ReactNode }) => {
    const [brand, setBrand] = useState<Brand[]>([]);
    const nav = useNavigate();
    //get all category
    const getAllBrand = async () => {
        const { data } = await instance.get("/brand");
        setBrand(data.data);
        console.log(data.data);
    };
    useEffect(() => {
        getAllBrand();
    }, []);
    const removeBrand = async (_id: string | undefined) => {
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
                await instance.delete(`/brand/${_id}`);
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
            await getAllBrand();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi Xóa Brand ",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };
    const handleBrand = async (brand: Brand) => {
        try {
            // Tạo một bản sao của brand và xóa các thuộc tính không cần thiết
            const { _id, title } = brand;
            const payload: any = { title };

            if (_id) {
                const { data } = await instance.put(`/brand/${_id}`, payload);
                toast.success("Cập nhật thành công");
                getAllBrand();
            } else {
                const { data } = await instance.post(`/brand`, payload);
                toast.success("Thêm thành công");
                getAllBrand();
            }
            nav("/admin/brand");
        } catch (error) {
            if (brand._id) {
                toast.error("Cập nhật thất bại");
            } else {
                toast.error("Thêm thất bại");
            }
            console.log(error);
        }
    };

    return (
        <BrandContext.Provider
            value={{ brand, setBrand, removeBrand, handleBrand }}
        >
            {children}
        </BrandContext.Provider>
    );
};
export default BrandProvider;
