import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../api";
import TymButton from "../component/Btn__tym";
import { ProductContext, ProductContextType } from "../context/ProductContext";
import { Product } from "../interface/Products";

type Props = {};

const Hompage = (props: Props) => {
    const { state } = useContext(ProductContext) as ProductContextType;
    // console.log(state);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };
    const [productCate, setProductsCate] = useState<Product[]>([]);
    const [productCate2, setProductsCate2] = useState<Product[]>([]);
    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/products");
            console.log(data);
            // lọc sản phẩm theo id danh mục nam
            const filteredProducts = data.data.filter(
                (product: Product) =>
                    product.category?._id === "66d41eb4e952b9505a3a20a2"
            );
            // lọc sản phẩm theo id danh mục nữ
            const filteredProducts2 = data.data.filter(
                (product: Product) =>
                    product.category?._id === "66d41ea9e952b9505a3a2034"
            );
            console.log(filteredProducts);
            setProductsCate(filteredProducts);
            setProductsCate2(filteredProducts2);
        })();
    }, []);
    const [activeCategory, setActiveCategory] = useState("women");

    const showCategory = (category: string) => {
        setActiveCategory(category);
    };
    return (
        <>
            {" "}
            {/* sm (Small devices, ≥576px)
                md (Medium devices, ≥768px)
                lg (Large devices, ≥992px)
                xl (Extra large devices, ≥1200px)
                xxl (Extra extra large devices, ≥1400px) 
            */}
            {/* banner PC--Tablet */}
            <div
                id="carouselExampleIndicators"
                className="carousel slide  bannerStylePC__Tablet"
                data-bs-ride="carousel"
            >
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={0}
                        className="active"
                        aria-current="true"
                        aria-label="Slide 1"
                    />
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={1}
                        aria-label="Slide 2"
                    />
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={2}
                        aria-label="Slide 3"
                    />
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src="../../public/images/Banner__1.jpg"
                            className="d-block "
                            alt="..."
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="../../public/images/Banner__2.jpg"
                            className="d-block "
                            alt="..."
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="../../public/images/Banner__3.webp"
                            className="d-block "
                            alt="..."
                        />
                    </div>
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                >
                    <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                >
                    <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            {/* banner Mobile */}
            <div
                id="carouselExampleIndicators"
                className="carousel slide container-fluid bannerStyle__Mobile"
                data-bs-ride="carousel"
            >
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={0}
                        className="active"
                        aria-current="true"
                        aria-label="Slide 1"
                    />
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={1}
                        aria-label="Slide 2"
                    />
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={2}
                        aria-label="Slide 3"
                    />
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src="../../public/images/Banner__1.jpg"
                            className="d-block "
                            alt="..."
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="../../public/images/Banner__2.jpg"
                            className="d-block "
                            alt="..."
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="../../public/images/Banner__3.webp"
                            className="d-block "
                            alt="..."
                        />
                    </div>
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                >
                    <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                >
                    <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            {/* ==========================NEW ARRIVAL================================ */}
            <div className="title__products__new_arrival">
                <p>NEW ARRIVAL</p>
            </div>
            <div>
                <div className="category-menu">
                    <button
                        className="category-button"
                        onClick={() => showCategory("women")}
                    >
                        Women
                    </button>
                    <button
                        className="category-button"
                        onClick={() => showCategory("men")}
                    >
                        Men
                    </button>
                </div>
                <div className="category-content">
                    <div
                        id="women"
                        className={`category-section ${
                            activeCategory === "women" ? "active" : ""
                        }`}
                    >
                        <div className="container">
                            <div className="scroll container">
                                <div className="product__slip">
                                    {productCate2.map((item) => (
                                        <div className="product" key={item._id}>
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
                                                        lineHeight: "16px",
                                                        fontWeight: "400",
                                                        marginBottom: "10px",
                                                        display: "block",
                                                        textTransform:
                                                            "capitalize",
                                                        textDecoration: "none",
                                                        margin: "20px 0px",
                                                        lineHeight: "2.2rem",
                                                        display: "-webkit-box",
                                                        WebkitBoxOrient:
                                                            "vertical",
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
                    <div
                        id="men"
                        className={`category-section ${
                            activeCategory === "men" ? "active" : ""
                        }`}
                    >
                        <div className="container">
                            <div className="scroll">
                                <div className="product__slip">
                                    {productCate.map((item) => (
                                        <div
                                            className="product "
                                            key={item._id}
                                        >
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
                                                        lineHeight: "16px",
                                                        fontWeight: "400",
                                                        marginBottom: "10px",
                                                        display: "block",
                                                        textTransform:
                                                            "capitalize",
                                                        textDecoration: "none",
                                                        margin: "20px 0px",
                                                        lineHeight: "2.2rem",
                                                        display: "-webkit-box",
                                                        WebkitBoxOrient:
                                                            "vertical",
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
            </div>
            {/* ==========================GALLERY=================================== */}
            <div className="title__products__GALLERY">
                <p>GALLERY</p>
            </div>
            <div className="container">
                <div className="Container__product gallery">
                    {state.products.slice(0, 8).map((item) => (
                        <div className="product gallery" key={item._id}>
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
                                        lineHeight: "16px",
                                        fontWeight: "400",
                                        marginBottom: "10px",
                                        display: "block",
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
                <div className="see__more">Xem Tất Cả</div>
            </div>
            {/* Content about */}
            <div className="about" id="about">
                <h1 className="heading">
                    <span>About</span> us
                </h1>
                <div className="row">
                    <div className="video-container">
                        <video
                            src="../../public/images/invideo-ai-1080 Zokong - Bước nhảy của sự năng động 2024-09-14.mp4"
                            loop
                            autoPlay
                            muted
                        />
                        <h3>----Zokong---</h3>
                    </div>
                    <div className="content p-4">
                        <h3>why choose us?</h3>
                        <p>
                            At Zokong, we pride ourselves on delivering an
                            unparalleled footwear experience. Our commitment to
                            excellence is evident in every pair of shoes we
                            offer. Each design is a masterpiece, meticulously
                            crafted by our skilled artisans who ensure that
                            every stitch and detail is executed with precision
                            and care.
                        </p>
                        <p>
                            We source only the finest materials from trusted
                            suppliers, guaranteeing durability, comfort, and
                            style in every pair. Whether you're stepping out for
                            a special occasion or seeking everyday comfort, our
                            dedicated team is here to understand your needs and
                            provide custom designs that speak to your style.
                        </p>
                        <a href="#" className="btn">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
            {/* Cac hãng hợp tác */}
            <div className="container">
                <div className="title__products__company">
                    Collaborating Shoe Brands
                </div>
                <div className="scroll_company">
                    <div className="company">
                        {/* category */}
                        {/* 1 */}
                        <div className="sub__company">
                            {/* conteent */}
                            <img
                                src="https://static.ftshp.digital/img/p/7/5/7/4/3/75743.jpg"
                                alt="nike air max 2017"
                                className="profile_image"
                            />
                            <video
                                src="../../public/images/video hãng/Quảng cáo- Nike Air Max 2017 - Nike.mp4"
                                autoPlay
                                muted
                                loop
                            ></video>
                            <div className="profile_detail">
                                <span>nike</span>
                                <span>air max 2017</span>
                            </div>
                            <div className=" profile_quote">
                                <p>
                                    Nike Air Max 2017 features full-length
                                    cushioning and a sleek, modern design for
                                    maximum comfort.
                                </p>
                            </div>
                        </div>
                        {/* 2 */}
                        <div className="sub__company">
                            <img
                                src="https://bizweb.dktcdn.net/100/140/774/products/giay-vans-authentic-vr3-sf-folky-floral-oatmeal-peyote-vn0a4bx50cx-2.jpg?v=1708409962647"
                                alt="Vans Authentic Trang SF"
                                className="profile_image"
                            />
                            <video
                                src="../../public/images/video hãng/Vans Authentic Trang SF - UNDER STREETWEAR.mp4"
                                autoPlay
                                muted
                                loop
                            ></video>
                            <div className="profile_detail">
                                <span style={{ color: "red" }}>Vans</span>
                                <span style={{ marginLeft: "57px" }}>
                                    Authentic Trang SF
                                </span>
                            </div>
                            <div className=" profile_quote">
                                <p>
                                    Vans Authentic SF in white offers a classic,
                                    minimalist style with a comfortable, durable
                                    design.
                                </p>
                            </div>
                        </div>
                        {/* 3 */}
                        <div className="sub__company">
                            <img
                                src="https://images.unsplash.com/photo-1473010350295-2c82192ebd8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNob2VzJTIwYWRpZGFzfGVufDB8fDB8fHww"
                                alt="Epic Adidas"
                                className="profile_image"
                            />
                            <video
                                src="../../public/images/video hãng/Epic Adidas shoe commercial concept - product video B-ROLL.mp4"
                                autoPlay
                                muted
                                loop
                            ></video>
                            <div className="profile_detail">
                                <span style={{ color: "orange" }}>Epic</span>
                                <span style={{ marginLeft: "50px" }}>
                                    Adidas
                                </span>
                            </div>
                            <div className=" profile_quote">
                                <p>
                                    Nike Air Max 2017 features full-length
                                    cushioning and a sleek, modern design for
                                    maximum comfort.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hompage;
