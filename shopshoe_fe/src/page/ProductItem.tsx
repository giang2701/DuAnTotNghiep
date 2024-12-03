import { IconButton } from "@mui/material";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Product } from "../interface/Products";
import { Link } from "react-router-dom";


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
    return (
        <div className="product" key={product._id} >
            <div className="product-img">
                <img
                    src={`${product.images}`}
                    alt={product.title}
                    className="img-fluid"
                />
            </div>
            <div className="product-name">
                <Link
                    to={`/detail/${product._id}`}
                    style={{
                        color: "#57585a",
                        fontSize: "14px",
                        fontWeight: "400",
                        marginBottom: "10px",
                        textTransform: "capitalize",
                        textDecoration: "none",
                        margin: "20px 0px",
                        lineHeight: "2.2rem",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: "1",
                        overflow: "hidden",
                    }}
                >
                    {product.title}
                </Link>
                <p>{formatPrice(product.price)}</p>
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
