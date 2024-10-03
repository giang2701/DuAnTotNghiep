import React, { useContext, useEffect, useState } from 'react'
import { ProductContext, ProductContextType } from '../context/ProductContext'

export default function Product_List() {
  const { state } = useContext(ProductContext) as ProductContextType,
  const [gender, setGender] = useState('None');
  const [priceRance, setPriceRange] = useState('None');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(state.products);

  useEffect(
    () => {
      setGender('None');
      setPriceRange([0, 10000000]);
      setFilteredProducts(state.products);
    }, [state.products]
  )

  const applyFilters = () => {
    const filtered = state.products.filter((product) => {
        const matchesGender = gender === 'None' || product.gender === gender;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesGender && matchesPrice;
    });
    setFilteredProducts(filtered);
};

  return (
    <div>
      <div className="breadcrumb-products">
        <ol className="breadcrumb__list">
          <li className="breadcrumb__item">
            <a href="https://ivymoda.com/" className="breadcrumb__link">TRANG CHỦ</a>
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
      </div>
    </div>
  )
}
