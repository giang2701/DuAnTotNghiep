import React, { useContext, useEffect, useState } from "react";
import { ProductContext, ProductContextType } from "../context/ProductContext";
import TymButton from "../component/Btn__tym";
import { Link } from "react-router-dom";
import {
    CategoryContext,
    CategoryContextType,
} from "../context/CategoryContext";
import { red } from "@mui/material/colors";

export default function Product_List() {
    const { state } = useContext(ProductContext) as ProductContextType;
    const { state1 } = useContext(CategoryContext) as CategoryContextType;
    const [gender, setGender] = useState("None");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(state.products);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 16;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const uniqueBrands = Array.from(new Set(state.products.map(product => product.brand)));

    // const [Categories, setCategories] = useState(state1.categories);
    console.log(state1.category);

    useEffect(() => {
        setGender("None");
        setPriceRange([0, 10000000]);
        setFilteredProducts(state.products);
    }, [state.products]);

    const updateGender = (e: any) => {
        setGender(e.target.value);
    };

    // thêm vào mãng thương hiệu để lọc
    const updateBrandSelection = (brand: string) => {
        setSelectedBrands((prevBrands) => {
            if (prevBrands.includes(brand)) {
                return prevBrands.filter((b) => b !== brand);
            } else {
                return [...prevBrands, brand];
            }
        });
    };

    const updatePriceRange = (e: any, type: "min" | "max") => {
        const value = parseInt(e.target.value);
        if (type === "min") {
            setPriceRange([value, priceRange[1]]);
        } else {
            setPriceRange([priceRange[0], value]);
        }
    };

    console.log(filteredProducts);

    const applyFilters = () => {
        const filtered = state.products.filter((product) => {
            const category = state1.category.find(
                (cat) => cat._id === product.category?._id
            );
            const matchesBrand =
                selectedBrands.length === 0 ||
                (product && selectedBrands.includes(product.brand));
            const matchesGender =
                gender === "None" || (category && category.title === gender);
            const matchesPrice =
                product.price >= priceRange[0] &&
                product.price <= priceRange[1];
            console.log(matchesBrand);

            return matchesGender && matchesPrice && matchesBrand;
        });
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const formatCurrency = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };

    return (
        <>
            <div className="container-fluid container-products__list">
                <div className="breadcrumb-products">
                    <ol className="breadcrumb__list">
                        <li className="breadcrumb__item">
                            <a
                                className="breadcrumb__link"
                                href="https://ivymoda.com/"
                            >
                                TRANG CHỦ
                            </a>
                        </li>
                        <li className="breadcrumb__item">
                            <a
                                href="https://ivymoda.com/danh-muc/hang-nu-moi-ve"
                                className="breadcrumb__link"
                            >
                                NEW ARRIVAL
                            </a>
                        </li>
                    </ol>
                </div>
                <div className="shop-container">
                    <aside className="shop-sidebar">
                        <div className="shop-sidebar__header">Bộ Lọc</div>
                        <ul className="shop-sidebar__filters">
                            <li
                                className="shop-sidebar__filter"
                                onClick={() => setIsBrandOpen((prev) => !prev)}
                            >
                                Thương Hiệu
                                {isBrandOpen ? (
                                    <div className="button_icon">-</div>
                                ) : (
                                    <div className="button_icon">+</div>
                                )}
                            </li>
                            {isBrandOpen && (
                                <div className="shop-sidebar__sub-list">
                                    {uniqueBrands.map((brand) => (
                                        <label className="shop-sidebar__sub-item" key={brand}>
                                            <input
                                                className="input1"
                                                type="checkbox"
                                                name={brand}
                                                value={brand}
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() =>
                                                    updateBrandSelection(brand)
                                                }
                                            />
                                            <div className="text_item">{brand}</div>
                                        </label>))}
                                </div>
                            )}
                            <li
                                className="shop-sidebar__filter"
                                onClick={() => setIsGenderOpen((prev) => !prev)}
                            >
                                Giới Tính
                                {isGenderOpen ? (
                                    <div className="button_icon2">-</div>
                                ) : (
                                    <div className="button_icon2">+</div>
                                )}
                            </li>
                            {isGenderOpen && (
                                <div className="shop-sidebar__sub-list">
                                    <label className="shop-sidebar__sub-item">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Nam"
                                            checked={gender === "Nam"}
                                            onChange={updateGender}
                                        />
                                        <div className="item_gender">Nam</div>
                                    </label>
                                    <label className="shop-sidebar__sub-item">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Nữ"
                                            checked={gender === "Nữ"}
                                            onChange={updateGender}
                                        />
                                        <div className="item_gender">Nữ</div>
                                    </label>
                                </div>
                            )}

                            <li
                                className="shop-sidebar__filter"
                                onClick={() =>
                                    setIsPriceRangeOpen((prev) => !prev)
                                }
                            >
                                Mức giá
                                {isPriceRangeOpen ? (
                                    <div className="button_icon3">-</div>
                                ) : (
                                    <div className="button_icon3">+</div>
                                )}
                            </li>
                            {isPriceRangeOpen && (
                                <div className="shop-sidebar__range-slider">
                                    <label htmlFor="price-range">Mức giá</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000000"
                                        value={priceRange[0]}
                                        onChange={(e) =>
                                            updatePriceRange(e, "min")
                                        }
                                        className="slider-input"
                                        id="price-range"
                                    />
                                    <span className="item_price">
                                        {priceRange[0].toLocaleString()} đ
                                    </span>
                                </div>
                            )}
                        </ul>
                        <div className="shop-sidebar__buttons">
                            <button
                                className="shop-sidebar__reset-button"
                                onClick={() => {
                                    setGender("None");
                                    setPriceRange([0, 10000000]);
                                    setFilteredProducts(state.products);
                                }}
                            >
                                Bỏ lọc
                            </button>
                            <button
                                className="shop-sidebar__filter-button"
                                onClick={applyFilters}
                            >
                                Lọc
                            </button>
                        </div>
                    </aside>

                    <main className="shop-main-content">
                        <section className="shop-banner">
                            <img
                                src="../../public/images/Banner__1.png"
                                alt="Banner"
                                className="shop-banner__image"
                            />
                        </section>

                        <section className="shop-product-grid">
                            <div className="container">
                                <div className="Container__product filter">
                                    {currentProducts.length > 0 ? (
                                        currentProducts.map((item) => (
                                            <div
                                                className="product"
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
                                                            fontSize: "16px",
                                                            lineHeight: "18px",
                                                            fontWeight: "600",
                                                            marginBottom:
                                                                "10px",
                                                            display: "block",
                                                            textTransform:
                                                                "capitalize",
                                                            textDecoration:
                                                                "none",
                                                            margin: "20px 0px",
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            WebkitLineClamp:
                                                                "1",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <p>
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="btn__tym">
                                                    <TymButton />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h3>
                                            Không tìm thấy sản phẩm nào phù hợp
                                        </h3>
                                    )}
                                </div>
                            </div>
                        </section>
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            >
                                Trang đầu
                            </button>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>

                            {[
                                ...Array(
                                    Math.ceil(
                                        filteredProducts.length /
                                        productsPerPage
                                    )
                                ).keys(),
                            ].map((number) => (
                                <button
                                    key={number + 1}
                                    onClick={() => setCurrentPage(number + 1)}
                                    className={
                                        currentPage === number + 1
                                            ? "active"
                                            : ""
                                    }
                                >
                                    {number + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={
                                    currentPage * productsPerPage >=
                                    filteredProducts.length
                                }
                            >
                                »
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        Math.ceil(
                                            filteredProducts.length /
                                            productsPerPage
                                        )
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    Math.ceil(
                                        filteredProducts.length /
                                        productsPerPage
                                    )
                                }
                            >
                                Trang cuối
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
