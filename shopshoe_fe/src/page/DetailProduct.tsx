import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../api";
import { Product } from "../interface/Products";
import ContentDisplay from "../component/ContentDisplay";
import ImgProductDetail from "./ImgProductDetail";

type Props = {};

const DetailProduct = (props: Props) => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [stock, setStock] = useState<number>(0);
    const [maxStock, setMaxStock] = useState<number>(0);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(`/products/${id}`);
                console.log(data.data);
                setProduct(data.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        })();
    }, [id]);

    const handleSizeClick = (size: number, stock: number) => {
        setSelectedSize(size);
        setStock(0); // Reset stock count when selecting a new size
        setMaxStock(stock);
    };

    const incrementStock = () => {
        if (selectedSize !== null && stock < maxStock) {
            setStock(stock + 1);
        }
    };

    const decrementStock = () => {
        if (selectedSize !== null && stock > 0) {
            setStock(stock - 1);
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <img
                        src={`${product.images}`}
                        alt={product.title}
                        className="img-fluid"
                    />
                </div>
                <ImgProductDetail product={product} />
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <h1>{product.title}</h1>
                    <p>Thương hiệu: {product.brand}</p>
                    <p>Giá: {formatPrice(product.price)}</p>
                    <h5>Kích cỡ:</h5>
                    <div className="d-flex flex-wrap">
                        {product.sizeStock.map((item, index) => (
                            <button
                                key={index}
                                className={`btn m-1 ${item.stock === 0
                                    ? "btn-disabled btn-secondary opacity-25" // Nếu hết hàng
                                    : "btn-outline-primary " // Nếu còn hàng
                                    } ${selectedSize === item.size
                                        ? "btn-selected"
                                        : ""
                                    }`}
                                onClick={() =>
                                    handleSizeClick(item.size, item.stock)
                                }
                                disabled={item.stock === 0}
                            >
                                Size {item.size}
                            </button>
                        ))}
                    </div>
                    <div className="mt-3">
                        <div className="d-flex align-items-center">
                            <button
                                className="btn btn-secondary"
                                onClick={decrementStock}
                                disabled={stock === 0 || selectedSize === null}
                            >
                                -
                            </button>
                            <span className="mx-2">{stock}</span>
                            <button
                                className="btn btn-secondary"
                                onClick={incrementStock}
                                disabled={
                                    stock >= maxStock || selectedSize === null
                                }
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <ContentDisplay content={product.description} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;
