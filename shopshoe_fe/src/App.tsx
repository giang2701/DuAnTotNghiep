import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LayoutAdmin from "./component/layout/LayoutAdmin";
import LayoutClient from "./component/layout/LayoutClient";
import CategoryForm from "./page/admin/category/CategoryForm";
import ManagerCate from "./page/admin/category/ManagerCate";
import DashBoard from "./page/admin/product/DashBoard";
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
function App() {
  return (
    <>
      <CartProvider>
        <Routes>
          {/* Client */}

          <Route path="/" element={<LayoutClient />}>
            <Route index element={<Hompage />} />
            <Route path="/detail/:id" element={<DetailProduct />} />
            <Route path="/product_list" element={<Product_List />} />
            <Route path="/product_list1" element={<Product_List1 />} />
            <Route path="/CartPage" element={<CartPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkOut" element={<Checkout />} />
            <Route path="/checkOutNow" element={<CheckoutNow />} />
            <Route path="/paymentSuccess" element={<PaymentSuccessPage />} />
            <Route path="/historyOrder" element={<HistoryOrders />} />
          </Route>
          <Route path="/loginAdmin" element={<LoginAdmin />} />
          {/*================admin===========================*/}
          {/* >>San Pham */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<DashBoard />} />
            <Route path="/admin/products" element={<DashBoard />} />
            <Route path="/admin/add" element={<FormProduct />} />
            <Route path="/admin/edit/:id" element={<FormProduct />} />
            {/* >>Danh Muc */}
            <Route path="/admin/category" element={<ManagerCate />} />
            <Route path="/admin/category-add" element={<CategoryForm />} />
            <Route path="/admin/category-edit/:id" element={<CategoryForm />} />
            {/* >>Size*/}
            <Route path="/admin/size" element={<ListSize />} />

            <Route path="/admin/size/add" element={<AddSize />} />
            {/* >>Usser*/}
            <Route path="/admin/user" element={<UserList />} />
            {/* >>Order management */}
            <Route path="/admin/orders" element={<OrderManagement />} />
            {/* >>Voucher*/}
            <Route path="/admin/voucher" element={<Voucher />} />
            <Route path="/admin/voucherAdd" element={<CreateVoucher />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </CartProvider>

      <ToastContainer />
    </>
  );
}

export default App;
