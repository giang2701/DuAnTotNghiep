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
                const flashSaleItems = data.data.filter(
                    (product: Product) => product.flashSale !== null
                );
                setFlashSaleProducts(flashSaleItems);

                if (flashSaleItems.length > 0) {
                    const firstProductEndDate = flashSaleItems[0].flashSale.endDate;
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
                const firstProductEndDate = flashSaleProducts[0].flashSale.endDate;
                setTimeLeft(calculateTimeLeft(firstProductEndDate));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [flashSaleProducts]);

    return (
        <div className="py-8 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-md mb-4">
                    <h2 className="textSale text-muted">
                        Giá Sốc ⚡ Hôm Nay
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
                    <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {flashSaleProducts.map((product) => (
                            <div className="product" key={product._id}>
                                <div className="product-img relative ">
                                    {product.flashSale?.isActive && (
                                        <div className="discount-badge absolute top-0 left-0 bg-red-600 text-white py-1 px-2 rounded-br-md">
                                            -{product.flashSale.discountPercent}%
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
                                                <p className="discounted-price text-red-600 font-bold">
                                                    {formatPrice(product.salePrice)}
                                                </p>
                                                <p className="original-price text-gray-500 line-through">
                                                    {formatPrice(product.price)}
                                                </p>
                                            </>
                                        ) : (
                                            <p>{formatPrice(product.price)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-flashsale text-center mt-8">
                        Chương trình Flash Sale chưa có, xin vui lòng đợi chương trình mới.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashSaleSection;
