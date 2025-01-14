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
        const { _id, title } = brand;
        const payload: any = { title };
        try {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "custom-confirm-button",
                    cancelButton: "custom-cancel-button",
                },
                buttonsStyling: false,
            });
    
            const result = await swalWithBootstrapButtons.fire({
                title: "Bạn có chắc chắn?",
                text: _id
                    ? "Bạn có chắc muốn cập nhật thương hiệu này?"
                    : "Bạn có chắc muốn thêm thương hiệu này?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Có, tiếp tục!",
                cancelButtonText: "Không, hủy bỏ!",
                reverseButtons: true,
            });
    
            if (result.isConfirmed) {
                // Tạo một bản sao của brand và xóa các thuộc tính không cần thiết
           
    
                if (_id) {
                    await instance.put(`/brand/${_id}`, payload);
                    toast.success("Cập nhật thành công");
                } else {
                    await instance.post(`/brand`, payload);
                    toast.success("Thêm thành công");
                }
    
                getAllBrand();
                nav("/admin/brand");
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Đã hủy",
                    text: "Thao tác đã được hủy bỏ.",
                    icon: "error",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Có Lỗi Xảy ra",
                text: errorMessage, // Hiển thị nội dung của message
            }).then(() => {
                window.location.reload();
            });
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
