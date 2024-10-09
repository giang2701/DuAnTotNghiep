// // import { Product } from "../interface/Products";
// import axiosInstance from "../config/axios";

// // export const addProduct = async (product: Product) => {
// //     try {
// //         const response = await axiosInstance.post("/api/products", product);
// //         return response.data;
// //     } catch (error) {
// //         console.error("Error adding product:", error);
// //         toast.error("Lỗi khi thêm sản phẩm");
// //     }
// // };

// // export const deleteProduct = async (id?: number | string) => {
// //     try {
// //         const response = await axiosInstance.delete(`/api/products/${id}`);
// //         return response.data;
// //     } catch (error) {
// //         console.error("Error deleting product:", error);
// //         toast.error("Lỗi khi xóa sản phẩm");
// //     }
// // };

// // export const updateProduct = async (product: IdProducts) => {
// //     try {
// //         const response = await axiosInstance.put(
// //             `/api/products/${product._id}`,
// //             product
// //         );
// //         return response.data;
// //     } catch (error) {
// //         console.error("Error updating product:", error);
// //         toast.error("Lỗi khi cập nhật sản phẩm");
// //     }
// // };

// export const getProductById = async (id?: number | string) => {
//     try {
//         const response = await axiosInstance.get(`/api/products/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching product by ID:", error);
//         // toast.error("Lỗi khi lấy thông tin sản phẩm từ server");
//     }
// };
