import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LayoutAdmin from "./component/layout/LayoutAdmin";
import LayoutClient from "./component/layout/LayoutClient";
import CategoryForm from "./page/admin/category/CategoryForm";
import ManagerCate from "./page/admin/category/ManagerCate";

import FormProduct from "./page/admin/product/FormProduct";
import AddSize from "./page/admin/size/AddSize";
import ListSize from "./page/admin/size/ListSize";
import UserList from "./page/admin/user/UserList";
import Login from "./page/Auth/Login";
import LoginAdmin from "./page/Auth/LoginAdmin";
import Register from "./page/Auth/Register";
import DetailProduct from "./page/DetailProduct";
import Hompage from "./page/Hompage";
import Product_List from "./page/Product_list";
import Page404 from "./page/Page404";
import { CartProvider } from "./context/cart";
import CartPage from "./page/CartPage";
import Checkout from "./page/Cart/Order";
import CheckoutNow from "./page/Cart/OrderNow";
import PaymentSuccessPage from "./page/Cart/PaymentSuccess";
import Voucher from "./page/admin/voucher/Voucher";
import CreateVoucher from "./page/admin/voucher/CreateVoucher";
import OrderManagement from "./page/admin/Order management/OrderManagement";
import HistoryOrders from "./page/HistoryOrders";
import Product_List1 from "./page/Product_list1";
import Aboutus from "./page/Aboutus.tsx";
import ProductsLiked from "./page/ProductLike.tsx";
import Dashboard from "./page/admin/dashboard/Dashboard.tsx";
import ProductList from "./page/admin/product/ProductList.tsx";
import Brand from "./page/admin/brand/Brand.tsx";
import BrandForm from "./page/admin/brand/BrandForm.tsx";
import Loading from "./component/Loading.tsx";
import Contact from "./page/Contact.tsx";
import TrashCan from "./page/admin/product/TrashCan.tsx";
import About from "./page/About.tsx";


function App() {
    return (
        <>
            <CartProvider>

            </CartProvider>
            <ToastContainer />
        </>
    );
}

export default App;
