import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api";
import { Brand } from "../interface/Brand";
import { toast } from "react-toastify";
import { get } from "react-hook-form";

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
        try {
            if (window.confirm("Ban chac chan muon xoa?")) {
                await instance.delete(`/brand/${_id}`);
                toast.success("Xoa thanh cong", {
                    autoClose: 2000, // Tự động đóng sau 3 giây
                });
            }
            getAllBrand();
        } catch (error) {
            toast.error("Xóa thất bại");
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
