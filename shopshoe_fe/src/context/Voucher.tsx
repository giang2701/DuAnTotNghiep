import React, { createContext, useContext, useEffect, useState } from "react";
import instance from "../api";
import { Voucher } from "../interface/Voucher";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AxiosResponse } from "axios"; // Đảm bảo import AxiosResponse

type VoucherContextType = {
    voucher: Voucher[] | null;
    setVoucher: (voucher: Voucher[]) => void;
    Delete: (_id: string) => void;
    handleVoucher: (voucher: Voucher) => void;
    toggleActiveStatus: (voucherId: string, isActive: boolean) => void;
    updateVoucher: (
        id: string,
        data: Voucher
    ) => Promise<AxiosResponse<any, any>>; // Cập nhật kiểu trả về
};

export const contextVoucher = createContext<VoucherContextType | undefined>(
    undefined
);
export const useVoucher = (): VoucherContextType => {
    const voucher = useContext(contextVoucher);
    if (!voucher) {
        throw new Error("voucher must be used within a userProvider");
    }
    return voucher;
};
export const VoucherProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [voucher, setVoucher] = useState<Voucher[]>([]);
    const nav = useNavigate();
    const GetAllVoucher = async () => {
        const { data } = await instance.get("/voucher");
        setVoucher(data.data);
    };
    useEffect(() => {
        GetAllVoucher();
    }, []);
    const Delete = async (_id: string) => {
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
                await instance.delete(`/voucher/${_id}`);
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

            await GetAllVoucher();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };

    const handleVoucher = async (voucher: Voucher) => {
        try {
            // console.log("voucher log", voucher);
            await instance.post("/voucher", voucher);
            toast.success("Them thanh cong", {
                autoClose: 2000, // Tự động đóng sau 3 giây
            });
            nav("/admin/voucher");
            GetAllVoucher();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.errors ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };
    // update
    const toggleActiveStatus = async (voucherId: string, isActive: boolean) => {
        console.log("voucherId", voucherId);
        console.log("isActive", isActive);

        try {
            // Gọi API để cập nhật trạng thái
            await instance.put(`/voucher/${voucherId}`, { isActive });
            toast.success("Voucher status updated successfully!", {
                autoClose: 2000, // Tự động đóng sau 3 giây
            });
            GetAllVoucher();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };
    //edit
    const updateVoucher = async (id: string, data: Voucher) => {
        try {
            const response = await instance.put(`/voucher/edit/${id}`, data); // Gọi API

            return response; // Trả về phản hồi từ API
        } catch (error) {
            console.error("Cập nhật voucher thất bại", error);
            throw error;
        }
    };

    return (
        <contextVoucher.Provider
            value={{
                voucher,
                setVoucher,
                Delete,
                handleVoucher,
                toggleActiveStatus,
                updateVoucher,
            }}
        >
            {children}
        </contextVoucher.Provider>
    );
};
