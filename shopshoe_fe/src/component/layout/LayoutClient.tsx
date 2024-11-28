import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import { useCart } from "../../context/cart";
import { useEffect } from "react";
import instance from "../../api";

const LayoutClient = () => {
    const { cart, setCart } = useCart();
    // console.log(cart);

    // khi user truy cap lay du lieuj gio hang

    const getAllCarts = async () => {
        const useStorage = localStorage.getItem("user") || "{}";
        const userId = JSON.parse(useStorage)?._id;
        // console.log(userId);
        if (!userId) return;
        const { data } = await instance.get(`/cart?userId=${userId}`);
        setCart(data.products.length);
    };

    useEffect(() => {
        getAllCarts;
    }, []);
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default LayoutClient;

//   const {setCartItemsCount } = useCart();
//   // console.log(setCartItemsCount);

//   const getAllCarts = async () => {
//     try {
//       const userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
//       if (!userId) return;

//       const { data } = await instance.get(`/cart?userId=${userId}`);
//       const items = data.items || []; // Giả sử API trả về cấu trúc này

//         // Tính tổng số lượng sản phẩm trong giỏ hàng của người dùng
//         const totalQuantity = items.reduce((total: number, item: CartItem) => total + item.product.price, 0);

//         setCartItemsCount(totalQuantity); // Cập nhật số lượng giỏ hàng cho người dùng

//         // Lưu số lượng giỏ hàng vào localStorage
//         localStorage.setItem('cartItemsCount', String(totalQuantity));
//         // console.log("Cart data:", data); // Thêm dòng này để kiểm tra

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
//     if (userId) {
//         getAllCarts(); // Gọi hàm để lấy giỏ hàng từ server nếu đã đăng nhập
//     }
// }, []);
