import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
    Box,
    Breadcrumbs,
    Button,
    IconButton,
    Modal,
    Rating,
    Stack,
    Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";

import { Link, useParams } from "react-router-dom";
import instance from "../api";
import TymButton from "../component/Btn__tym";
import { Product } from "../interface/Products";

const DetailProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null); //đổ sản phẩm chi tiết
    const [sizeNames, setSizeNames] = useState<
        { id: string; name: number; price: number; stock: number }[]
    >([]); //danh sách size
    const [selectedSize, setSelectedSize] = useState<string | null>(null); // ẩn hiện khi hết sotck có trong size
    const [price, setPrice] = useState<number | null>(null); //xét giá mặc định cho sản phẩm
    const [quantity, setQuantity] = useState<number>(1); //so luong cua san pham theo size
    const [stockLimit, setStockLimit] = useState<number>(0); //để đảm bảo rằng số lượng mua không vượt quá số tồn kho của kích thước được chọn
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [value, setValue] = useState<number | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const thumbnailRef = useRef<HTMLDivElement | null>(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Theo dõi ảnh hiện tại
    let isDragging = false;
    let startPos = 0;
    let scrollLeft = 0;
    // Xuất lý độ di chuyển
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging = true;
        startPos = e.pageX - (thumbnailRef.current?.offsetLeft || 0);
        scrollLeft = thumbnailRef.current?.scrollLeft || 0;
    };
    const handleMouseLeaveOrUp = () => {
        isDragging = false;
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (thumbnailRef.current?.offsetLeft || 0);
        const walk = (x - startPos) * 1; // Tốc độ di chuyển
        if (thumbnailRef.current) {
            thumbnailRef.current.scrollLeft = scrollLeft - walk;
        }
    };
    // --------------------
    // xử lý ảnh
    const handleNextImage = () => {
        if (product && currentImageIndex < product.imgCategory.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            setSelectedImage(product.imgCategory[currentImageIndex + 1]);
        }
    };
    const handlePrevImage = () => {
        if (product && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            setSelectedImage(product.imgCategory[currentImageIndex - 1]);
        }
    };
    // thanh cuộn
    const handleScrollRight = () => {
        if (thumbnailRef.current) {
            thumbnailRef.current.scrollBy({ left: 125, behavior: "smooth" });
        }
    };
    const handleScrollLeft = () => {
        if (thumbnailRef.current) {
            thumbnailRef.current.scrollBy({ left: -125, behavior: "smooth" });
        }
    };
    // sản phẩm liên quan
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (product) {
                const response = await instance.get("/products");
                const products = response.data.data;
                const relatedProducts = products.filter(
                    (p: Product) =>
                        p.category?._id === product.category?._id &&
                        p._id !== product._id
                );
                setRelatedProducts(relatedProducts);
            }
        };
        fetchRelatedProducts();
    }, [product]);
    // hieu ung thanh cuon description
    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    // lay thong tin san pham detail
    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(`/products/${id}`);
                setProduct(data.data);
                setSelectedImage(data.data.images[0]);
                setPrice(data.data.price); // Giá mặc định
                const sizeStocks = data.data.sizeStock;
                const sizeNamesById = await Promise.all(
                    sizeStocks.map(async (sizeStock: any) => {
                        try {
                            const sizeResponse = await instance.get(
                                `/size/${sizeStock.size}`
                            );
                            return {
                                id: sizeStock.size,
                                name: sizeResponse.data.data.nameSize,
                                price: sizeStock.price,
                                stock: sizeStock.stock,
                            };
                        } catch (error) {
                            console.error("Error fetching size:", error);
                            return null;
                        }
                    })
                );

                setSizeNames(
                    sizeNamesById.filter((size) => size !== null) as any[]
                );
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        })();
    }, [id]);
    // Khi người dùng chọn một size, hàm này sẽ cập nhật ID size, giá, và tồn kho tương ứng.
    const handleSizeChange = (sizeId: string) => {
        const selected = sizeNames.find((size) => size.id === sizeId);
        if (selected) {
            setSelectedSize(sizeId); // Lưu ID của size đã chọn
            setPrice(selected.price); // Cập nhật giá theo size
            setStockLimit(selected.stock); // Cập nhật giới hạn stock
            setQuantity(1); // Reset số lượng mua về 1
        }
    };
    //  xử lý việc tăng và giảm số lượng sản phẩm dựa trên giới hạn stockLimit
    const handleQuantityChange = (type: "increment" | "decrement") => {
        setQuantity((prev) => {
            if (type === "increment" && prev < stockLimit) return prev + 1;
            if (type === "decrement" && prev > 1) return prev - 1;
            return prev;
        });
    };
    const handleClearSize = () => {
        setSelectedSize(null);
        setPrice(product?.price || 0); // Đặt lại giá về mặc định
        setQuantity(1);
        setStockLimit(0);
    };
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };
    // Zoom ảnh
    useEffect(() => {
        const image = imageRef.current;
        if (!image) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = image.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            image.style.transform = "scale(2)";
        };
        const handleMouseLeave = () => {
            image.style.transform = "scale(1)";
        };
        image.addEventListener("mousemove", handleMouseMove);
        image.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            image.removeEventListener("mousemove", handleMouseMove);
            image.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [selectedImage]);
    if (!product) {
        return <div>Loading...</div>;
    }
    const previewText = product.description?.substring(0, 250); // giới hạn kí tự
    // phóng to ảnh
    const modal = document.getElementById("myModal") as HTMLDivElement | null;
    const img = document.getElementById("myImg") as HTMLImageElement | null;
    const modalImg = document.getElementById(
        "img01"
    ) as HTMLImageElement | null;
    const captionText = document.getElementById(
        "caption"
    ) as HTMLDivElement | null;
    if (img && modal && modalImg && captionText) {
        img.onclick = function () {
            modal.style.display = "block";
            modalImg.src = img.src;
            captionText.innerHTML = img.alt;
        };
    }
    const span = document.getElementsByClassName(
        "close"
    )[0] as HTMLSpanElement | null;
    if (span && modal) {
        span.onclick = function () {
            modal.style.display = "none";
        };
    }
    // ******
    return (
        <div className="container">
            <div className="row row__detail">
                {/* đường dẫn */}
                <Breadcrumbs
                    className="mt-3 mb-5 mr-3 link"
                    aria-label="breadcrumb"
                >
                    <Link className="nav-link" color="inherit" to="/">
                        Trang chủ
                    </Link>
                    <Typography color="text.primary">
                        {product.title}
                    </Typography>
                </Breadcrumbs>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex flex-column align-items-center">
                    {/* Ảnh sản phẩm chính */}
                    <div
                        style={{
                            marginRight: "25px",
                            position: "relative", // Để nút điều hướng hiển thị bên trên ảnh
                        }}
                        className="images-container mb-3"
                    >
                        {/* Nút Previous */}
                        <button
                            onClick={handlePrevImage}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "0",
                                transform: "translateY(-50%)",
                                backgroundColor: "transparent",
                                color: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "10px",
                                zIndex: 10,
                            }}
                            disabled={currentImageIndex === 0}
                        >
                            <IconButton
                                onClick={handlePrevImage}
                                disabled={currentImageIndex === 0}
                                style={{ fontSize: "30px", fontWeight: "bold" }}
                            >
                                <KeyboardArrowLeftIcon fontSize="inherit" />
                            </IconButton>
                        </button>

                        {/* Ảnh sản phẩm */}
                        <img
                            className="img-fluid"
                            ref={imageRef}
                            src={selectedImage || ""}
                            alt={product.title}
                        />

                        {/* Nút Next */}
                        <button
                            onClick={handleNextImage}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "0",
                                transform: "translateY(-50%)",
                                backgroundColor: "transparent",
                                color: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "10px",
                                zIndex: 10,
                            }}
                            disabled={
                                currentImageIndex ===
                                product.imgCategory.length - 1
                            }
                        >
                            <IconButton
                                onClick={handleNextImage}
                                disabled={
                                    currentImageIndex ===
                                    product.imgCategory.length - 1
                                }
                                style={{ fontSize: "30px", fontWeight: "bold" }}
                            >
                                <KeyboardArrowRightIcon fontSize="inherit" />
                            </IconButton>
                        </button>
                    </div>

                    {/* ảnh danh mục */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <IconButton onClick={handleScrollLeft}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>

                        <Stack
                            ref={thumbnailRef}
                            style={{
                                marginRight: "10px",
                                maxWidth: "375px",
                                overflowX: "hidden",
                                cursor: "grab",
                            }}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                            className="thumbnail-container"
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeaveOrUp}
                            onMouseUp={handleMouseLeaveOrUp}
                            onMouseMove={handleMouseMove}
                        >
                            {product.imgCategory.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`Danh mục ${index}`}
                                    className="thumbnail-img"
                                    style={{
                                        cursor: "pointer",
                                        width: "125px",
                                        height: "120px",
                                        objectFit: "cover",
                                    }}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setSelectedImage(imgUrl);
                                    }}
                                />
                            ))}
                        </Stack>

                        <IconButton onClick={handleScrollRight}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 information_detailproduct">
                    <h1 style={{ textTransform: "uppercase" }} className="p-1 ">
                        {product.title}
                    </h1>
                    <div className="d-flex align-items-center">
                        <span className=" b-1 fs-3 ">Thương Hiệu:</span>

                        <span className="p-1 mt-0 me-4 fs-3">
                            {product.brand}
                        </span>
                        <Box sx={{ marginTop: "2px" }}>
                            <Rating
                                className="d-flex "
                                name="star-rating"
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                                sx={{ fontSize: "18px" }}
                            />
                            {/* {value !== null && <Box>Đánh giá: {value} sao</Box>} */}
                        </Box>
                    </div>
                    <p className="p-1 fw-bolder mt-2 price_detail">
                        {price !== null
                            ? formatPrice(price)
                            : "Price not available"}
                    </p>
                    <Box mt={1} marginLeft={-1} marginBottom={1}>
                        <Button onClick={() => setModalOpen(true)}>
                            Hướng dẫn đo size
                        </Button>
                        <Modal
                            open={modalOpen}
                            onClose={() => setModalOpen(false)}
                            aria-labelledby="size-guide-modal"
                            aria-describedby="size-guide-description"
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "100%",
                                    maxWidth: 500,
                                    bgcolor: "background.paper",
                                    boxShadow: 24,
                                    p: 4,
                                }}
                            >
                                <img
                                    src="../../public/images/chon-size.png"
                                    alt="Size Guide"
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </Box>
                        </Modal>
                    </Box>
                    {/* TODO:---------- */}
                    <div>
                        <p>Kích thước:</p>
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                            }}
                        >
                            {sizeNames.map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() => handleSizeChange(size.id)}
                                    style={{
                                        padding: "10px 10px",
                                        width: "50px",
                                        border:
                                            selectedSize === size.id
                                                ? "2px solid gray"
                                                : "2px solid #f6f6f6",
                                        backgroundColor: "##EEEEEE",
                                        color: "black",
                                        borderRadius: "5px",
                                        cursor:
                                            size.stock > 0
                                                ? "pointer"
                                                : "not-allowed",
                                        opacity: size.stock > 0 ? 1 : 0.5,
                                    }}
                                    disabled={size.stock === 0}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <button
                                onClick={handleClearSize}
                                style={{
                                    marginTop: "10px",
                                    backgroundColor: "#EEEEEE",
                                    color: "black",
                                    border: "1px solid gray",
                                    borderRadius: "5px",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                }}
                            >
                                X Hủy chọn
                            </button>
                        )}
                    </div>
                    {/* quality */}
                    <div style={{ margin: "20px 0px 10px" }}>
                        <button
                            onClick={() => handleQuantityChange("decrement")}
                            disabled={quantity <= 1}
                            style={{
                                margin: "0 10px",

                                padding: "10px 20px",
                                borderEndEndRadius: "20px",
                                borderTopLeftRadius: "20px",
                            }}
                        >
                            -
                        </button>
                        <span style={{ margin: "0 10px", fontSize: "1.5rem" }}>
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange("increment")}
                            disabled={quantity >= stockLimit}
                            style={{
                                margin: "0 10px",
                                padding: "10px 20px",
                                borderEndEndRadius: "20px",
                                borderTopLeftRadius: "20px",
                            }}
                        >
                            +
                        </button>
                    </div>
                    {/* button mua + add to add to card */}
                    <div className="mb-3 d-flex justify-content-start mb-3 action__buy-cart">
                        <button
                            className="btn btn-black me-4 btn_buy"
                            disabled={quantity === 0 || selectedSize === null}
                        >
                            Thêm Vào Giỏ
                        </button>

                        <button
                            className="btn btn-outline btn_buy "
                            disabled={quantity === 0 || selectedSize === null}
                        >
                            Mua Ngay
                        </button>
                    </div>

                    <div className="mb-3 ">
                        <h5 className="fs-3">Giới thiệu sản phẩm:</h5>
                    </div>
                    {expanded ? (
                        <div
                            style={{ fontSize: "1.5rem", lineHeight: "2.5rem" }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    product.description || ""
                                ),
                            }}
                        />
                    ) : (
                        <div
                            style={{ fontSize: "1.5rem", lineHeight: "2.5rem" }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(previewText || ""),
                            }}
                        />
                    )}

                    <div className="icon-divider-container ">
                        <hr className="divider-line" />
                        <IconButton
                            className="icon-button"
                            onClick={toggleExpand}
                            aria-expanded={expanded}
                        >
                            {expanded ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                    </div>
                </div>
                <div className="title__products__Related">
                    <p>Sản phẩm liên quan </p>
                </div>
                <div className="container">
                    <div className="scroll">
                        <div className="product__slip">
                            {relatedProducts.slice(0, 6).map((item) => (
                                <div className="product " key={item._id}>
                                    <div className="product-img">
                                        <img
                                            src={`${item.images}`}
                                            alt=""
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="product-name">
                                        <Link
                                            to={`/detail/${item._id}`}
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
                                            {item.title}
                                        </Link>

                                        <p>{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="btn__tym">
                                        <TymButton />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailProduct;
