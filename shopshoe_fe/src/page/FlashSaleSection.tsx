import { useEffect, useState } from "react";
import { Product } from "../interface/Products";
import instance from "../api";
import { Link } from "react-router-dom";

const FlashSaleSection = () => {
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [timeLeft, setTimeLeft] = useState({
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };

    const calculateTimeLeft = (endDate: string) => {
        const difference = new Date(endDate).getTime() - new Date().getTime();
        if (difference <= 0) {
            return { weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            weeks: Math.floor(difference / (1000 * 60 * 60 * 24 * 7)),
            days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 7),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    useEffect(() => {
        const fetchFlashSaleProducts = async () => {
            try {
                const { data } = await instance.get("/products");
                const activeProducts = data.data.filter(
                    (product: Product) => product.isActive
                );
                const flashSaleItems = activeProducts.filter(
                    (product: Product) => product.flashSale !== null
                );
                setFlashSaleProducts(flashSaleItems);

                if (flashSaleItems.length > 0) {
                    const firstProductEndDate =
                        flashSaleItems[0].flashSale.endDate;
                    setTimeLeft(calculateTimeLeft(firstProductEndDate));
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm Flash Sale", error);
            }
        };

        fetchFlashSaleProducts();
    }, []);

    useEffect(() => {
        if (flashSaleProducts.length > 0) {
            const timer = setInterval(() => {
                const firstProductEndDate =
                    flashSaleProducts[0].flashSale.endDate;
                setTimeLeft(calculateTimeLeft(firstProductEndDate));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [flashSaleProducts]);

    return (
        <div className="py-8 bg-gray-100">
            <div className="container mx-auto px-4">
                <div
                    className="flex justify-content-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 mb-4 rounded  "
                    style={{
                        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                    }}
                >
                    <h2 className="textSale text-muted">
                        Giá Sốc
                        <span
                            style={{
                                marginLeft: "-10px",
                                marginRight: "-10px",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: `
                             <style>
                               @keyframes eLqMGs {
                                 50% {
                                   opacity: 0.3;
                                   transform: scale(1.4);
                                 }
                               }
                             </style>
                             <span style="animation: 0.6s linear 0s infinite normal none running eLqMGs;">⚡</span>
                           `,
                            }}
                        />
                        Hôm Nay
                    </h2>
                    <div className="timer-buttons flex items-center mt-3">
                        <button className="bg-blue-700 text-white py-1 px-3 rounded mr-2">
                            {timeLeft.hours} Giờ
                        </button>
                        <button className="bg-blue-700 text-white py-1 px-3 rounded mr-2">
                            {timeLeft.minutes} Phút
                        </button>
                        <button className="bg-blue-700 text-white py-1 px-3 rounded">
                            {timeLeft.seconds} Giây
                        </button>
                    </div>
                </div>
                {flashSaleProducts.length > 0 ? (
                    <div className="container" style={{ marginLeft: "22px" }}>
                        <div className="scroll" style={{ width: "101%" }}>
                            <div className="product__slip">
                                {/* <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 mt-5"> */}
                                {flashSaleProducts.map((product) => (
                                    <div className="product" key={product._id}>
                                        <div className="product-img relative ">
                                            {product.flashSale?.isActive && (
                                                <div className="discount-badge absolute top-0 left-0 bg-red-600 text-white py-1 px-2 rounded-br-md">
                                                    -
                                                    {
                                                        product.flashSale
                                                            .discountPercent
                                                    }
                                                    %
                                                </div>
                                            )}
                                            <img
                                                src={product.images}
                                                alt={product.title}
                                                className="w-full h-32 object-cover rounded-md mb-2"
                                            />
                                        </div>
                                        <div className="product-name">
                                            <Link
                                                to={`/detail/${product._id}`}
                                                className="product-title"
                                            >
                                                {product.title}
                                            </Link>
                                            <div className="price-info">
                                                {product.flashSale?.isActive ? (
                                                    <>
                                                        <div className="d-flex ms-3">
                                                            <p className="discounted-price text-red-600 font-bold fs-3">
                                                                {formatPrice(
                                                                    product.salePrice
                                                                )}
                                                            </p>
                                                            <p
                                                                className="original-price line-through text-secondary ms-2 "
                                                                style={{
                                                                    marginTop:
                                                                        "6px",
                                                                }}
                                                            >
                                                                {formatPrice(
                                                                    product.price
                                                                )}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p>
                                                        {formatPrice(
                                                            product.price
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="no-flashsale text-center "
                        style={{ marginBottom: "100px", marginTop: "52px" }}
                    >
                        Chương trình Flash Sale chưa có, xin vui lòng đợi chương
                        trình mới.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashSaleSection;
