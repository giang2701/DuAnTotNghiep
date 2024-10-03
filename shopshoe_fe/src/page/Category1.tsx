import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TymButton from '../component/Btn__tym';
import { ProductContext, ProductContextType } from '../context/ProductContext';

const ProductFilter = () => {
    const { state } = useContext(ProductContext) as ProductContextType;

    const [gender, setGender] = useState('None');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(state.products);

    useEffect(() => {
        setGender('None');
        setPriceRange([0, 10000000]);
        setFilteredProducts(state.products);
    }, [state.products]);

    const updateGender = (e) => {
        setGender(e.target.value);
    };

    const updatePriceRange = (e, type) => {
        const value = parseInt(e.target.value);
        if (type === 'min') {
            setPriceRange([value, priceRange[1]]);
        } else {
            setPriceRange([priceRange[0], value]);
        }
    };

    const applyFilters = () => {
        const filtered = state.products.filter((product) => {
            const matchesGender = gender === 'None' || product.gender === gender;
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            return matchesGender && matchesPrice;
        });
        setFilteredProducts(filtered);
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
            <div className="breadcrumb-products">
                <ol className="breadcrumb__list">
                    <li className="breadcrumb__item">
                        <a className="breadcrumb__link" href="https://ivymoda.com/">TRANG CHỦ</a>
                    </li>
                    <li className="breadcrumb__item">
                        <a href="https://ivymoda.com/danh-muc/hang-nu-moi-ve" className="breadcrumb__link">NEW ARRIVAL</a>
                    </li>
                </ol>
            </div>
            <div className="shop-container">
                <aside className="shop-sidebar">
                    <div className="shop-sidebar__header">Bộ Lọc</div>
                    <ul className="shop-sidebar__filters">
                        <li
                            className="shop-sidebar__filter"
                            onClick={() => setIsGenderOpen(prev => !prev)}
                        >
                            Giới Tính
                        </li>
                        {isGenderOpen && (
                            <div className="shop-sidebar__sub-list">
                                <label className="shop-sidebar__sub-item">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Nam"
                                        checked={gender === 'Nam'}
                                        onChange={updateGender}
                                    />
                                    Nam
                                </label>
                                <label className="shop-sidebar__sub-item">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Nữ"
                                        checked={gender === 'Nữ'}
                                        onChange={updateGender}
                                    />
                                    Nữ
                                </label>
                                <label className="shop-sidebar__sub-item">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="None"
                                        checked={gender === 'None'}
                                        onChange={updateGender}
                                    />
                                    Không xác định
                                </label>
                            </div>
                        )}

                        <li
                            className="shop-sidebar__filter"
                            onClick={() => setIsPriceRangeOpen(prev => !prev)}
                        >
                            Mức giá
                        </li>
                        {isPriceRangeOpen && (
                            <div className="shop-sidebar__range-slider">
                                <label htmlFor="price-range">Mức giá</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000000"
                                    value={priceRange[0]}
                                    onChange={(e) => updatePriceRange(e, 'min')}
                                    className="slider-input"
                                    id="price-range"
                                />
                                <span>{priceRange[0].toLocaleString()} đ</span>
                            </div>
                        )}
                    </ul>
                    <div className="shop-sidebar__buttons">
                        <button
                            className="shop-sidebar__reset-button"
                            onClick={() => {
                                setGender('None');
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
                        <img src="../../public/images/Banner__1.jpg" alt="Banner" className="shop-banner__image" />
                    </section>

                    <section className="shop-product-grid">
                        <div className="container">
                            <div className="Container__product gallery">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item) => (
                                        <div className="product gallery" key={item._id}>
                                            <div className="product-img">
                                                <img src={`${item.images}`} alt="" className="img-fluid" />
                                            </div>
                                            <div className="product-name">
                                                <Link
                                                    to={`/detail/${item._id}`}
                                                    style={{
                                                        color: "#57585a",
                                                        fontSize: "16px",
                                                        lineHeight: "18px",
                                                        fontWeight: "600",
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
                                                <p>{formatCurrency(item.price)}</p>
                                            </div>
                                            <div className="btn__tym">
                                                <TymButton />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default ProductFilter;
