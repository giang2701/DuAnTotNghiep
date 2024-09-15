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

    const handleProduct = async (product: Product) => {
        try {
            if (product._id) {
                console.log(product);
                const {
                    _id,
                    createdAt,
                    updatedAt,
                    sizeStock,
                    images,
                    ...updatedData
                } = product;

                // Clean up sizeStock to remove _id fields
                const cleanedSizeStock = sizeStock.map(
                    ({ _id, ...item }) => item
                );

                // Kiểm tra nếu mảng images không có phần tử hoặc tất cả các phần tử đều rỗng
                if (
                    !images ||
                    images.length === 0 ||
                    images.every((image) => !image.trim())
                ) {
                    console.error("Images field is required");
                    return;
                }
                // Chuyển đổi mảng images thành chuỗi
                const imagesString = images.join(",");
                const payload = {
                    ...updatedData,
                    sizeStock: cleanedSizeStock,
                    images: imagesString,
                };

                const { data } = await instance.put(
                    `/products/${product._id}`,
                    payload
                );
                dispatch({ type: "UPDATE_PRODUCT", payload: data.data });
                // alert(data.message);
                toast.success("Update successfully");
                nav("/admin");
            } else {
                const { data } = await instance.post(`/products`, product);
                dispatch({ type: "ADD_PRODUCT", payload: data.data });
                // alert(data.message);
                toast.success("Add successfully");
                nav("/admin");
            }
            nav("/admin");
        } catch (error) {
            console.log(error);
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
