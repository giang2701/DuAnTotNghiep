import { useState, useEffect } from "react";
import { useFlashSale } from "../../../context/FlashSale";
import instance from "../../../api";
import { toast } from "react-toastify";
import { Product } from "../../../interface/Products";

const ApplyFlashSaleToMultipleProducts = () => {
    const { flashSale } = useFlashSale();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedFlashSale, setSelectedFlashSale] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Số sản phẩm mỗi trang

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await instance.get("/products");
            setProducts(data.data);
            setFilteredProducts(data.data);
        };
        fetchProducts();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset về trang đầu tiên
    };

    const handleApplyFlashSale = async () => {
        if (!selectedFlashSale) {
            toast.error("Vui lòng chọn một mã Flash Sale!");
            return;
        }
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm!");
            return;
        }

        try {
            await instance.post("/products/flashSaleAll", {
                productIds: selectedProducts,
                flashSaleId: selectedFlashSale,
            });
            toast.success("Áp dụng Flash Sale thành công!");
        } catch (error) {
            console.error("Error applying Flash Sale:", error);
            toast.error("Lỗi khi áp dụng Flash Sale!");
        }
    };

    // Tính toán tổng số trang
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Lấy sản phẩm cho trang hiện tại
    const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };

    // Lọc Flash Sale còn hiệu lực
    const currentDate = new Date();
    const activeFlashSales = flashSale.filter(fs => new Date(fs.startDate) <= currentDate && new Date(fs.endDate) > currentDate);

    return (
        <div className="flash-sale-container">
            <h2 className="flash-sale-title">Áp dụng Flash Sale cho nhiều sản phẩm</h2>
            {/* Thanh tìm kiếm */}
            <div className="search-bar my-5">
                <h2>Tìm kiếm sản phẩm</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm theo tên..."
                    className="search-input"
                    style={{ width: "100%", padding: "10px", fontSize: "16px", marginTop: "10px" }}
                />
            </div>

            <div className="flash-sale-selection">
                <label className="flash-sale-label">Chọn Flash Sale:</label>
                <select
                    value={selectedFlashSale}
                    onChange={(e) => setSelectedFlashSale(e.target.value)}
                    className="flash-sale-dropdown"
                >
                    <option value="">-- Chọn Flash Sale --</option>
                    {activeFlashSales.map((fs) => (
                        <option key={fs._id} value={fs._id}>
                            {fs.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Thanh tìm kiếm
            <div className="search-bar my-5">
                <h2>Tìm kiếm sản phẩm</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm theo tên..."
                    className="search-input"
                    style={{ width: "100%", padding: "10px", fontSize: "16px", marginTop: "10px" }}
                />
            </div> */}

            <div className="product-list">
                <h1 className="product-list-title mt-5">Danh sách sản phẩm:</h1>
                <ul className="product-list-items">
                    {currentProducts.map((product) => (
                        <li key={product._id} className="product-list-item">
                            <input
                                type="checkbox"
                                value={product._id}
                                onChange={(e) => {
                                    const productId = e.target.value;
                                    setSelectedProducts((prev) =>
                                        e.target.checked
                                            ? [...prev, productId]
                                            : prev.filter((id) => id !== productId)
                                    );
                                }}
                                className="product-checkbox"
                            />
                            <span className="product-title">{product.title}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button onClick={handleApplyFlashSale} className="apply-button">Áp dụng Flash Sale</button>
        </div>
    );
};

export default ApplyFlashSaleToMultipleProducts;
