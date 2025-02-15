import React, { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext, ProductContextType } from "../context/ProductContext";
import { Link, useLocation } from "react-router-dom";
import {
    CategoryContext,
    CategoryContextType,
} from "../context/CategoryContext";
import axios from "axios";
import { Product } from "../interface/Products";
import instance from "../api";
import { toast } from "react-toastify";
import ProductItem from "./ProductItem";

export default function Product_List1() {
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
    const [brands, setBrands] = useState<string[]>([]);
    const productsPerPage = 16;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const [Gendertrue, setIsGendertrue] = useState(false);

    const location = useLocation();


    //tạo hàm lọc
    const applyFilters = useCallback(() => {
        const filtered = state.products.filter((product) => {
            const category = state1.category.find(
                (cat) => cat._id === product.category?._id
            );

            // Lọc theo giới tính
            const matchesGender =
                gender === "None" || (category && category.title === gender);

            // Lọc theo nhãn hiệu, chỉ khi nhãn hiệu được chọn
            const matchesBrand =
                selectedBrands.length === 0 ||
                (product && selectedBrands.includes(product.brand.title));

            // Lọc theo giá, chỉ khi giá nằm trong phạm vi đã chọn
            const matchesPrice =
                product.price >= priceRange[0] && product.price <= priceRange[1];

            return matchesGender && matchesPrice && matchesBrand;
        });

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset trang khi thay đổi bộ lọc
    }, [gender, selectedBrands, priceRange, state.products, state1.category]);


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const genderParam = searchParams.get("gender");

        // Cập nhật gender từ URL
        if (genderParam) {
            setIsGendertrue(true);
            setGender(genderParam);
        } else {
            setGender("None"); // Giá trị mặc định nếu không có tham số giới tính
        }

        // Áp dụng lại bộ lọc sau khi giới tính thay đổi
        applyFilters();
    }, [location.search, applyFilters]);

    useEffect(() => {
        setGender("None");
        setPriceRange([0, 10000000]);
        setFilteredProducts(state.products);
    }, [state.products]);

    //lay brand bằng axios
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/Brand")
            .then((response) => {
                setBrands(response.data.data);
                console.log(response.data);

            })
            .catch((error) => {
                console.error("Error fetching brands:", error);
            });
    }, []);

    // Thêm vào mãng thương hiệu để lọc
    const updateBrandSelection = (brand: string) => {
        setSelectedBrands((brands) => {
            if (brands.includes(brand)) {
                return brands.filter((b) => b !== brand);
            } else {
                return [...brands, brand];
            }
        });
    };
    //hàm lọc min max

    const updatePriceRange = (e, type) => {
        const value = Number(e.target.value);
        setPriceRange((prev) => {
            if (type === "min") {
                return [Math.min(value, prev[1]), prev[1]]; // Không để min > max
            } else {
                return [prev[0], Math.max(value, prev[0])]; // Không để max < min
            }
        });
    };


    const updateGender = (e: any) => {
        setGender(e.target.value);
    };



    // const formatCurrency = (price: number): string => {
    //     return new Intl.NumberFormat("vi-VN", {
    //         style: "currency",
    //         currency: "VND",
    //     })
    //         .format(price)
    //         .replace("₫", "đ");
    // };

    const userArray = localStorage.getItem("user")
    const user = userArray ? JSON.parse(userArray) : null

    const [favorites, setFavorites] = useState<Product[]>(() => {
        try {
            const storedFavorites = localStorage.getItem("favorites");
            return storedFavorites ? JSON.parse(storedFavorites) : []; // Đảm bảo luôn là mảng
        } catch (error) {
            console.error("Error parsing favorites from localStorage:", error);
            return []; // Trả về mảng trống khi có lỗi
        }
    });


    const toggleFavorite = async (item: Product) => {

        const isAlreadyFavorite = favorites.some((fav) => fav._id === item._id);
        console.log(isAlreadyFavorite)

        if (!user) {
            const isAlreadyFavorite = favorites.some((fav) => fav._id === item._id);
            // Xử lý khi không có user (chưa đăng nhập)
            const updatedFavorites = isAlreadyFavorite
                ? favorites.filter((fav) => fav._id !== item._id)
                : [...favorites, item];

            setFavorites(updatedFavorites);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        } else {
            // Xử lý khi đã đăng nhập
            try {
                if (isAlreadyFavorite) {
                    // Nếu đã thích, xóa khỏi server và localStorage
                    await instance.delete(`/heart/${user._id}/${item._id}`);
                    toast.success("Bỏ thích thành công")
                    const updatedFavorites = favorites.filter(
                        (fav) => fav._id !== item._id
                    );
                    setFavorites(updatedFavorites);
                    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                } else {
                    // Nếu chưa thích, thêm vào server và localStorage
                    const heart = {
                        userId: user._id,
                        productId: item._id,
                    };
                    await instance.post("/heart", heart);
                    toast.success("Thích sản phẩm thành công")
                    const updatedFavorites = [...favorites, item];
                    setFavorites(updatedFavorites);
                    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                }
            } catch (error) {
                console.error("Error toggling favorite:", error);
            }
        }
    };

    const isFavorite = (item: Product) => {
        // Kiểm tra `favorites` là mảng hợp lệ
        return Array.isArray(favorites) && favorites.some((fav) => fav._id === item._id);
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
                            {/* Thương hiệu */}
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
                                    {brands.map((brand: any) => (
                                        <label className="shop-sidebar__sub-item" key={brand._id}>
                                            <input
                                                className="input1"
                                                type="checkbox"
                                                name={brand.title}
                                                value={brand.title}
                                                checked={selectedBrands.includes(brand.title)}
                                                onChange={() => updateBrandSelection(brand.title)}
                                            />
                                            <div className="text_item">{brand.title}</div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Giới tính */}
                            {!Gendertrue && (
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
                            )}
                            {isGenderOpen && !Gendertrue && (
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

                            {/* Mức giá */}
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
                                    <div className="range-slider-container">
                                        <span className="range-label">0 đ</span>
                                        <div className="dual-slider">
                                            <input
                                                type="range"
                                                min="0"
                                                max="10000000"
                                                step="100000"
                                                value={priceRange[0]}
                                                onChange={(e) => updatePriceRange(e, "min")}
                                                className="slider-input"
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="10000000"
                                                step="100000"
                                                value={priceRange[1]}
                                                onChange={(e) => updatePriceRange(e, "max")}
                                                className="slider-input"
                                            />
                                            <div
                                                className="slider-track"
                                                style={{
                                                    left: `${(priceRange[0] / 10000000) * 100}%`,
                                                    right: `${100 - (priceRange[1] / 10000000) * 100}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="range-label">10.000.000 đ</span>
                                    </div>
                                    <span className="item_price">
                                        {priceRange[0].toLocaleString()} đ - {priceRange[1].toLocaleString()} đ
                                    </span>
                                </div>
                            )}
                        </ul>
                        <div className="shop-sidebar__buttons">
                            <button
                                className="shop-sidebar__reset-button"
                                onClick={() => {
                                    setPriceRange([0, 10000000]);
                                    setSelectedBrands([]);
                                    setFilteredProducts(state.products);
                                }}
                            >
                                Bỏ lọc
                            </button>
                            {/* <button
                                className="shop-sidebar__filter-button"
                                onClick={handleFilterClick}
                            >
                                Lọc
                            </button> */}
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
                                            <ProductItem
                                                key={item._id}
                                                product={item}
                                                toggleFavorite={toggleFavorite}
                                                isFavorite={isFavorite(item)}
                                            />
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
