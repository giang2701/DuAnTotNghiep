import { IconButton } from "@mui/material";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Product } from "../interface/Products";
import { Link } from "react-router-dom";
import CountdownTimer from "./FlashSaleTime";

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })
        .format(price)
        .replace("₫", "đ");
};

const ProductItem = ({
    product,
    toggleFavorite,
    isFavorite,
}: {
    product: Product;
    toggleFavorite: (item: Product) => void;
    isFavorite: boolean;
}) => {
    const discountedPrice =
        product.flashSale && product.flashSale.isActive
            ? product.price - (product.price * product.flashSale.salePrice) / 100
            : null;

    return (
        <div className="product" key={product._id}>
            <div className="flash-sale-header">
                {/* Hiển thị đồng hồ đếm ngược Flash Sale */}
                {product.flashSale?.isActive && (
                    <CountdownTimer endDate={product.flashSale.endDate} />
                )}
            </div>

            <div className="product-img">
                {product.flashSale && product.flashSale.isActive && (
                    <div className="discount-badge">
                        -{product.flashSale.discountPercent}%
                    </div>
                )}
                <img
                    src={`${product.images}`}
                    alt={product.title}
                    className="img-fluid"
                />
            </div>

            <div className="product-name">
                <Link
                    to={`/detail/${product._id}`}
                    className="product-title"
                >
                    {product.title}
                </Link>
                {discountedPrice !== null ? (
                    <div className="price-info">
                        <p className="discounted-price">
                            {formatPrice(product.salePrice)}
                        </p>
                        <p className="original-price">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                ) : (
                    <p>{formatPrice(product.price)}</p>
                )}
            </div>

            {/* Nút yêu thích */}
            <IconButton sx={{ marginLeft: 14 }} onClick={() => toggleFavorite(product)}>
                {isFavorite ? (
                    <AiFillHeart color="red" size={30} />
                ) : (
                    <AiOutlineHeart color="gray" size={30} />
                )}
            </IconButton>
        </div>

    );
};

export default ProductItem;
