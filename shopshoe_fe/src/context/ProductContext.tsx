import { createContext, useEffect, useReducer, useState } from "react";

import productReducer from "../reducers/productReducer";

import { useNavigate } from "react-router-dom";
import { Product } from "../interface/Products";
import instance from "./../api/index";
import { toast } from "react-toastify";

export type ProductContextType = {
    state: { products: Product[] };
    dispatch: React.Dispatch<any>;
    removeProduct: () => void;
    handleProduct: (data: Product) => void;
    idDelete: string | null;
    setIdDelete: React.Dispatch<React.SetStateAction<string | null>>;
    confirm: boolean;
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductContext = createContext({} as ProductContextType);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(productReducer, { products: [] });
    const [idDelete, setIdDelete] = useState<string | null>(null);
    const [confirm, setConfirm] = useState(false);
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/products`);
            dispatch({ type: "GET_PRODUCTS", payload: data.data });
        })();
    }, []);

    const removeProduct = async () => {
        if (idDelete) {
            try {
                await instance.delete(`/products/${idDelete}`);
                dispatch({ type: "REMOVE_PRODUCT", payload: idDelete });
                toast.success("Delete successfully");
            } catch (error: any) {
                console.log(error);
            } finally {
                setConfirm(false);
            }
        }
    };

    const handleProduct = async (product: Product, file?: File, categoryFiles?: File[]) => {
        try {
            let imageUrl = product.images; // Giữ nguyên URL ảnh cũ nếu không có ảnh mới
            let categoryImageUrls = product.imgCategory || [];

            // Kiểm tra nếu có file mới thì upload ảnh sản phẩm chính
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "datn_upload");
                formData.append("folder", "datn");

                const response = await instance.post(
                    `https://api.cloudinary.com/v1_1/dq3lk241i/image/upload`,
                    formData
                );
                imageUrl = response.data.secure_url; // Cập nhật URL ảnh mới
            }


            if (categoryFiles && categoryFiles.length > 0) {
                const categoryUploads = await Promise.all(
                    categoryFiles.map(async (categoryFile) => {
                        const formData = new FormData();
                        formData.append("file", categoryFile);
                        formData.append("upload_preset", "datn_upload");
                        formData.append("folder", "datn");

                        const response = await instance.post(
                            `https://api.cloudinary.com/v1_1/dq3lk241i/image/upload`,
                            formData
                        );
                        return response.data.secure_url; // Trả về URL ảnh sau khi upload
                    })
                );
                categoryImageUrls = categoryUploads; // Cập nhật lại imgCategory với URL các ảnh mới
            }

            if (product._id) {
                const { _id, createdAt, updatedAt, sizeStock, ...updatedData } = product;

                // Clean up sizeStock để loại bỏ các _id
                const cleanedSizeStock = sizeStock.map(({ _id, ...item }) => item);

                // Cập nhật payload với URL ảnh mới và imgCategory
                const payload = {
                    ...updatedData,
                    sizeStock: cleanedSizeStock,
                    images: imageUrl, // URL ảnh sản phẩm chính
                    imgCategory: categoryImageUrls, // URL các ảnh danh mục
                };

                // Gửi yêu cầu cập nhật sản phẩm
                const { data } = await instance.put(`/products/${product._id}`, payload);
                dispatch({ type: "UPDATE_PRODUCT", payload: data.data });
                toast.success("Cập nhật sản phẩm thành công");
                nav("/admin");
            } else {
                // Thêm sản phẩm mới nếu không có _id
                const { data } = await instance.post(`/products`, {
                    ...product,
                    images: imageUrl,
                    imgCategory: categoryImageUrls, // Thêm mảng ảnh danh mục mới
                });
                console.log("Dữ liệu gửi lên API:", {
                    ...product,
                    images: imageUrl,
                    imgCategory: categoryImageUrls, // Mảng URL ảnh danh mục
                });
                dispatch({ type: "ADD_PRODUCT", payload: data.data });
                toast.success("Thêm sản phẩm thành công");
                nav("/admin");
            }
        } catch (error) {
        }
    };

    return (
        <ProductContext.Provider
            value={{
                state,
                dispatch,
                removeProduct,
                handleProduct,
                idDelete,
                setIdDelete,
                confirm,
                setConfirm,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;
