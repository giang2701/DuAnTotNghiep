import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../api";
import { Product } from "../interface/Products";
import {
  Breadcrumbs,
  Typography,
  IconButton,
  Stack,
  Box,
  Rating,
  Button,
  Modal,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DOMPurify from "dompurify";
import TymButton from "../component/Btn__tym";
import { ProductContext, ProductContextType } from "../context/ProductContext";
import ContentDisplay from "../component/ContentDisplay";
import ImgProductDetail from "./ImgProductDetail";

type Props = {};

const DetailProduct = (props: Props) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [stock, setStock] = useState<number>(0);
  const [maxStock, setMaxStock] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { state } = useContext(ProductContext) as ProductContextType;
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product) {
        const response = await instance.get("/products");
        const products = response.data.data;
        const relatedProducts = products.filter(
          (p: Product) =>
            p.category?._id === product.category?._id && p._id !== product._id
        );
        setRelatedProducts(relatedProducts);
      }
    };
    fetchRelatedProducts();
  }, [product]);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`/products/${id}`);
        setProduct(data.data);
        setSelectedImage(data.data.images[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    })();
  }, [id]);

  const handleSizeClick = (size: number, stock: number) => {
    setSelectedSize(size);
    setStock(0);
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
  const modalImg = document.getElementById("img01") as HTMLImageElement | null;
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

  return (
    <div className="container">
      <div className="row">
        {/* đường dẫn */}
        <Breadcrumbs
          className="mt-3 mb-5 mr-3 link"
          aria-label="breadcrumb"
          style={{ marginLeft: "25px" }}
        >
          <Link className="nav-link" color="inherit" to="/">
            Trang chủ
          </Link>
          <Typography color="text.primary">{product.title}</Typography>
        </Breadcrumbs>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex flex-column align-items-center">
          {/* Main Image */}
          <div
            style={{ marginRight: "25px" }}
            className="images-container mb-3 "
          >
            <img
              className="img-fluid"
              ref={imageRef}
              src={`${selectedImage}`}
              alt={product.title}
            />
          </div>

          {/* Thumbnails */}
          <Stack
            style={{ marginRight: "10px" }}
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2} // Adds spacing between the thumbnails
            className="thumbnail-container"
          >
            {[1, 2, 3].map((item, index) => (
              <img
                key={index}
                src={`${selectedImage}`}
                className="thumbnail-img" // Add this class for styling control
                style={{
                  cursor: "pointer",
                  width: "125px",
                  height: "120px",
                  objectFit: "cover",
                }}
              />
            ))}
          </Stack>
        </div>

        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 information_detailproduct">
          <h1 style={{ textTransform: "uppercase" }} className="p-1 ">
            {product.title}
          </h1>
          <div className="d-flex align-items-center">
            {/* <h4 className="p-1 me-5">Thương hiệu: {product.brand}</h4> */}
            <span className=" b-1 fs-3 ">Thương Hiệu:</span>

            <span className="p-1 mt-0 me-4 fs-3">{product.brand}</span>
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
          <p className="p-1 fw-bolder mt-2   price_detail">
            {formatPrice(product.price)}
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

          <h5 className="p-1 mb-3">Kích cỡ giày:</h5>
          <div className="d-flex flex-wrap">
            {product.sizeStock.map((item, index) => (
              <button
                key={index}
                className={`btn size-button m-1 ${
                  item.stock === 0
                    ? "btn-disabled btn-secondary opacity-25"
                    : "btn-outline-primary"
                } ${selectedSize === item.size ? "btn-selected" : ""}`}
                onClick={() => handleSizeClick(item.size, item.stock)}
                disabled={item.stock === 0}
              >
                {item.size}
              </button>
            ))}
          </div>
          <div className="mt-3 mb-3   ">
            <div className="d-flex align-items-center ">
              <button
                className="btn btn-light btn_increase "
                onClick={decrementStock}
                disabled={stock === 0 || selectedSize === null}
              >
                -
              </button>
              <span className="mx-2 counter-value">{stock}</span>
              <button
                className="btn btn-light btn_increase"
                onClick={incrementStock}
                disabled={stock >= maxStock || selectedSize === null}
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-start mb-3 test">
            <button
              className=" btn btn-black me-4 btn_buy"
              disabled={stock === 0 || selectedSize === null}
            >
              Thêm Vào Giỏ
            </button>
            <button
              className="btn btn-outline  btn_buy"
              disabled={stock === 0 || selectedSize === null}
            >
              Mua Ngay
            </button>
            <div
              style={{ marginLeft: "-6px" }}
              className="mt-3 d-flex justify-content-start align-items-center "
            >
              <TymButton />
            </div>
          </div>
          <div className="mb-3 ">
            <h5 className="fs-3">Giới thiệu sản phẩm:</h5>
          </div>
          {expanded ? (
            <div
              style={{ fontSize: "1.5rem", lineHeight: "2.5rem" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            />
          ) : (
            <div
              style={{ fontSize: "1.5rem", lineHeight: "2.5rem" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(previewText),
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
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </div>
        <div className="title__products__GALLERY  ">
          <p>Sản phẩm liên quan</p>
        </div>
        <div className="container">
          <div className="scroll">
            <div className="product__slip">
              {relatedProducts.slice(0, 6).map((item) => (
                <div className="product " key={item._id}>
                  <div className="product-img">
                    <img src={`${item.images}`} alt="" className="img-fluid" />
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
