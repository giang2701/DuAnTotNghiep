import { createContext, useEffect, useReducer, useState } from "react";

import productReducer from "../reducers/productReducer";

import { useNavigate } from "react-router-dom";
import { Product } from "../interface/Products";
import instance from "./../api/index";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
export type ProductContextType = {
    state: { products: Product[] };
    dispatch: React.Dispatch<any>;
    removeProduct: () => void;
    handleProduct: (data: Product) => void;
    idDelete: string | null;
    setIdDelete: React.Dispatch<React.SetStateAction<string | null>>;
    confirm: boolean;
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: (_id: string) => void;
};

export const ProductContext = createContext({} as ProductContextType);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(productReducer, { products: [] });
    const [idDelete, setIdDelete] = useState<string | null>(null);
    const [confirm, setConfirm] = useState(false);
    const nav = useNavigate();
    const getAllProducts = async () => {
        try {
            const { data } = await instance.get(`/products`);

            // Lọc sản phẩm chỉ lấy những sản phẩm có isActive là true
            const activeProducts = data.data.filter(
                (product: Product) => product.isActive
            );

            dispatch({ type: "GET_PRODUCTS", payload: activeProducts });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getAllProducts();
    }, []);
    //xóa mềm sản phẩm
    const removeProduct = async () => {
        if (idDelete) {
            try {
                await instance.put(`/products/status/${idDelete}`, {
                    isActive: false,
                });
                toast.success("Delete successfully");
                getAllProducts();
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Đã xảy ra lỗi, vui lòng thử lại sau.";
                Swal.fire({
                    icon: "error",
                    title: "Lỗi Khi Xóa Sản Phẩm",
                    text: errorMessage, // Hiển thị nội dung của message
                });
            }
        }
    };
    // xóa cứng sản phẩm
    const handleDelete = async (_id: string) => {
        // try {
        //     await instance.delete(`/products/${_id}`);
        //     dispatch({ type: "REMOVE_PRODUCT", payload: _id });
        //     toast.success("Delete successfully");
        // } catch (error: any) {
        //     const errorMessage =
        //         error.response?.data?.message ||
        //         "Đã xảy ra lỗi, vui lòng thử lại sau.";
        //     Swal.fire({
        //         icon: "error",
        //         title: "Lỗi Khi Xóa Sản Phẩm",
        //         text: errorMessage, // Hiển thị nội dung của message
        //     });
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
                await instance.delete(`/products/${_id}`);
                dispatch({ type: "REMOVE_PRODUCT", payload: _id });
                getAllProducts();
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
    const handleProduct = async (
        product: Product,
        file?: File,
        categoryFiles?: File[]
    ) => {
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
                const { ...updatedData } = product;
                // Cập nhật payload với URL ảnh mới và imgCategory
                const payload = {
                    ...updatedData,
                    images: imageUrl, // URL ảnh sản phẩm chính
                    imgCategory: categoryImageUrls, // URL các ảnh danh mục
                };

                // Gửi yêu cầu cập nhật sản phẩm
                const { data } = await instance.put(
                    `/products/${product._id}`,
                    payload
                );
                console.log(" Dữ liệu gữi lên API:", data.data);

                dispatch({ type: "UPDATE_PRODUCT", payload: data.data });
                toast.success("Cập nhật sản phẩm thành công");
                nav("/admin/products");
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
                nav("/admin/products");
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi Thêm Sản Phẩm ",
                text: errorMessage, // Hiển thị nội dung của message
            }).then(() => {
                window.location.reload();
            });
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
                handleDelete,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;
