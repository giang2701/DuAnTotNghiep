import { createContext, useEffect, useReducer } from "react";

import productReducer from "../reducers/productReducer";

import { useNavigate } from "react-router-dom";
import { Product } from "../interface/Products";
import instance from "./../api/index";

export type ProductContextType = {
    state: { products: Product[] };
    dispatch: React.Dispatch<any>;
    removeProduct: (_id: string | undefined) => void;
    handleProduct: (data: Product) => void;
};

export const ProductContext = createContext({} as ProductContextType);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(productReducer, { products: [] });
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/products`);
            dispatch({ type: "GET_PRODUCTS", payload: data.data });
        })();
    }, []);

    const removeProduct = async (_id: string | undefined) => {
        try {
            await instance.delete(`/products/${_id}`);
            dispatch({ type: "REMOVE_PRODUCT", payload: _id });
        } catch (error: any) {
            console.log(error);
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
                alert(data.message);
            } else {
                const { data } = await instance.post(`/products`, product);
                dispatch({ type: "ADD_PRODUCT", payload: data.data });
                alert(data.message);
            }
            nav("/admin");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ProductContext.Provider
            value={{ state, dispatch, removeProduct, handleProduct }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;
