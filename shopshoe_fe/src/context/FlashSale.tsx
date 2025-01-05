import React, { createContext, useContext, useEffect, useState } from "react";
import instance from "../api";
import { FlashSale } from "../interface/Products"; // Tạo interface FlashSale tương tự Voucher
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";

type FlashSaleContextType = {
    flashSale: FlashSale[];
    setFlashSale: (flashSale: FlashSale[]) => void;
    DeleteFlashSale: (_id: string) => void;
    handleFlashSale: (flashSale: FlashSale) => void;
    toggleFlashSaleStatus: (flashSaleId: string, isActive: boolean) => void;
    getFlashSaleById: (_id: string) => void;
    // updateFlashSale: (_id: string, updatedData: boolean) => void,
};

export const contextFlashSale = createContext<FlashSaleContextType | undefined>(
    undefined
);

export const useFlashSale = (): FlashSaleContextType => {
    const flashSale = useContext(contextFlashSale);
    if (!flashSale) {
        throw new Error("flashSale must be used within a FlashSaleProvider");
    }
    return flashSale;
};

export const FlashSaleProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [flashSale, setFlashSale] = useState<FlashSale[]>([]);
    const nav = useNavigate();

    const GetAllFlashSale = async () => {
        const { data } = await instance.get("/flashsale");
        setFlashSale(data.data);
    };

    // Check and handle expired flash sales
    const checkExpiredFlashSales = async () => {
        try {
            const { data } = await instance.get("/flashsale");
            const expiredFlashSales = data.data.filter((flashSale: FlashSale) =>
                moment(flashSale.endDate).isBefore(moment())
            );

            for (const flashSale of expiredFlashSales) {
                // Lấy sản phẩm thuộc Flash Sale hết hạn
                const { data: productsData } = await instance.get(
                    `/products/flashSale/${flashSale._id}`
                );

                // Kiểm tra nếu không có sản phẩm
                if (!productsData || productsData.length === 0) {
                    console.warn(
                        `Không có sản phẩm nào thuộc Flash Sale ID: ${flashSale._id}`
                    );
                    continue;
                }

                for (const product of productsData) {
                    // Chuẩn bị dữ liệu cập nhật sản phẩm
                    const updatedProduct = {
                        flashSale: null,
                        salePrice: null,
                    };

                    try {
                        // Gửi yêu cầu cập nhật
                        await instance.put(
                            `/products/${product._id}`,
                            updatedProduct
                        );
                    } catch (error) {
                        console.error(
                            `Lỗi khi cập nhật sản phẩm ID: ${product._id}`,
                            error
                        );
                    }
                }

                // Cập nhật trạng thái Flash Sale
                // try {
                //     await instance.put(`/flashsale/status/${flashSale._id}`, { isActive: false });
                // } catch (error) {
                //     console.error(`Lỗi khi cập nhật trạng thái Flash Sale ID: ${flashSale._id}`, error);
                // }
            }

            toast.success(
                "Cập nhật sản phẩm có Flash Sale hết hạn thành công."
            );
        } catch (error) {
            // console.error("Lỗi trong hàm checkExpiredFlashSales:", error);
            // toast.error("Cập nhật sản phẩm có Flash Sale hết hạn thất bại.");
        }
    };

    useEffect(() => {
        GetAllFlashSale();
        checkExpiredFlashSales();
    }, []);

    const getFlashSaleById = async (id: string): Promise<FlashSale | null> => {
        try {
            const { data } = await instance.get(`/flashsale/${id}`);
            if (data.success) {
                return data.data as FlashSale; // Chuyển kiểu dữ liệu
            } else {
                toast.error("Không tìm thấy Flash Sale!");
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi lấy Flash Sale theo ID:", error);
            toast.error("Đã xảy ra lỗi khi lấy Flash Sale.");
            return null;
        }
    };

    // const updateFlashSale = async (id: string, updatedData: Partial<FlashSale>): Promise<boolean> => {
    //     try {
    //         const formattedData = {
    //             ...updatedData,
    //             startDate: updatedData.startDate
    //                 ? moment(updatedData.startDate).format("YYYY-MM-DD")
    //                 : null,
    //             endDate: updatedData.endDate
    //                 ? moment(updatedData.endDate).format("YYYY-MM-DD")
    //                 : null,
    //         };

    //         const response = await instance.put(`/flashsale/${id}`, formattedData);

    //         if (response.data.success) {
    //             toast.success("Cập nhật Flash Sale thành công!", { autoClose: 2000 });

    //             // Cập nhật sản phẩm liên quan đến Flash Sale
    //             // await updateProductsByFlashSale(id);

    //             GetAllFlashSale(); // Làm mới danh sách Flash Sale sau khi cập nhật
    //             return true;
    //         } else {
    //             toast.error("Cập nhật Flash Sale thất bại!", { autoClose: 2000 });
    //             return false;
    //         }
    //     } catch (error: any) {
    //         console.error("Lỗi khi cập nhật Flash Sale:", error);
    //         toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật Flash Sale.");
    //         return false;
    //     }
    // };

    // const updateProductsByFlashSale = async (flashSaleId: string) => {
    //     try {
    //         // Lấy thông tin Flash Sale đã chỉnh sửa
    //         const flashSale = await getFlashSaleById(flashSaleId);

    //         if (!flashSale) {
    //             console.warn(`Không tìm thấy Flash Sale với ID: ${flashSaleId}`);
    //             return;
    //         }

    //         // Lấy danh sách sản phẩm liên quan đến Flash Sale
    //         const { data: productsData } = await instance.get(`/products/flashSale/${flashSaleId}`);

    //         if (!productsData || productsData.length === 0) {
    //             console.warn(`Không có sản phẩm nào thuộc Flash Sale ID: ${flashSaleId}`);
    //             return;
    //         }

    //         // Cập nhật từng sản phẩm
    //         for (const product of productsData) {
    //             const updatedSalePrice = product.originalPrice - (product.originalPrice * flashSale.discountPercent / 100);

    //             // Cập nhật thông tin sản phẩm
    //             const updatedProduct = {
    //                 salePrice: updatedSalePrice,
    //                 flashSale: flashSaleId,
    //             };

    //             try {
    //                 await instance.put(`/products/${product._id}`, updatedProduct);
    //             } catch (error) {
    //                 console.error(`Lỗi khi cập nhật sản phẩm ID: ${product._id}`, error);
    //             }
    //         }

    //         toast.success("Cập nhật sản phẩm liên quan đến Flash Sale thành công!", { autoClose: 2000 });
    //     } catch (error) {
    //         console.error("Lỗi trong hàm updateProductsByFlashSale:", error);
    //         toast.error("Không thể cập nhật sản phẩm liên quan đến Flash Sale.");
    //     }
    // };

    const DeleteFlashSale = async (_id: string) => {
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
                await instance.delete(`/flashsale/${_id}`);
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

            await GetAllFlashSale();
        } catch (error) {
            toast.error("Không thể xóa");
        }
    };

    const handleFlashSale = async (flashSale: FlashSale) => {
        try {
            const formattedFlashSale = {
                ...flashSale,
                startDate: flashSale.startDate
                    ? moment(flashSale.startDate).format("DD/MM/YYYY")
                    : null,
                endDate: flashSale.endDate
                    ? moment(flashSale.endDate).format("DD/MM/YYYY")
                    : null,
            };
            console.log("Dữ liệu đã format gửi lên:", formattedFlashSale);
            // console.log("Dữ liệu gửi lên:", flashSale);
            await instance.post("/flashsale", flashSale);
            toast.success("Thêm Flash Sale thành công", {
                autoClose: 2000,
            });
            nav("/admin/flashsale");
            GetAllFlashSale();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.errors ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            console.log(error);

            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: errorMessage,
            });
        }
    };

    // const toggleFlashSaleStatus = async (flashSaleId: string, isActive: boolean) => {
    //     console.log("flashSaleId", flashSaleId);
    //     console.log("isActive", isActive);
    //     try {
    //         await instance.put(`/flashsale/status/${flashSaleId}`, { isActive });
    //         toast.success("Flash sale status updated successfully!", {
    //             autoClose: 2000,
    //         });
    //         GetAllFlashSale();
    //     } catch (error) {
    //         toast.error("Failed to update flash sale status!");
    //     }
    // };
    // Nếu có Flash sale đang hoạt động thì các flash sale khác sẽ không được sử dụng
    const toggleFlashSaleStatus = async (
        flashSaleId: string,
        isActive: boolean
    ) => {
        console.log("flashSaleId", flashSaleId);
        console.log("isActive", isActive);

        try {
            // Kiểm tra xem có Flash Sale nào đang hoạt động không
            const activeFlashSale = flashSale.find(
                (fs) =>
                    fs.isActive &&
                    moment(fs.startDate).isBefore(moment()) &&
                    moment(fs.endDate).isAfter(moment())
            );

            // Nếu có Flash Sale đang hoạt động và người dùng muốn kích hoạt một Flash Sale khác
            if (
                activeFlashSale &&
                isActive &&
                activeFlashSale._id !== flashSaleId
            ) {
                toast.error(
                    `Không thể kích hoạt Flash Sale này vì Flash Sale "${activeFlashSale.title}" đang hoạt động.`,
                    { autoClose: 3000 }
                );
                return;
            }

            // Cập nhật trạng thái của Flash Sale
            await instance.put(`/flashsale/status/${flashSaleId}`, {
                isActive,
            });

            if (isActive) {
                // Vô hiệu hóa các Flash Sale khác nếu Flash Sale này được kích hoạt
                const updates = flashSale
                    .filter((fs) => fs._id !== flashSaleId && fs.isActive)
                    .map(async (fs) => {
                        await instance.put(`/flashsale/status/${fs._id}`, {
                            isActive: false,
                        });
                    });

                // Chờ hoàn tất việc cập nhật
                await Promise.all(updates);
            }

            toast.success("Trạng thái Flash Sale được cập nhật thành công!", {
                autoClose: 2000,
            });
            GetAllFlashSale();
        } catch (error: any) {
            // console.error("Lỗi khi thêm vào giỏ hàng:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Lỗi khi thêm vào giỏ hàng",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };

    return (
        <contextFlashSale.Provider
            value={{
                flashSale,
                setFlashSale,
                DeleteFlashSale,
                handleFlashSale,
                toggleFlashSaleStatus,
                getFlashSaleById,
                // updateFlashSale,
            }}
        >
            {children}
        </contextFlashSale.Provider>
    );
};
