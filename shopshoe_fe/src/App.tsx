import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LayoutAdmin from "./component/layout/LayoutAdmin";
import LayoutClient from "./component/layout/LayoutClient";
import CategoryForm from "./page/admin/category/CategoryForm";
import ManagerCate from "./page/admin/category/ManagerCate";

import Authorization403 from "./component/Authorzation403.tsx";
import Loading from "./component/Loading.tsx";
import { useAuth } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/cart";
import About from "./page/About.tsx";
import Aboutus from "./page/Aboutus.tsx";
import Login from "./page/Auth/Login";
import LoginAdmin from "./page/Auth/LoginAdmin";
import Register from "./page/Auth/Register";
import Checkout from "./page/Cart/Order";
import CheckoutNow from "./page/Cart/OrderNow";
import PaymentSuccessPage from "./page/Cart/PaymentSuccess";
import CartPage from "./page/CartPage";
import Contact from "./page/Contact.tsx";
import DetailProduct from "./page/DetailProduct";
import HistoryOrders from "./page/HistoryOrders";
import Hompage from "./page/Hompage";
import Page404 from "./page/Page404";
import ProductsLiked from "./page/ProductLike.tsx";
import Product_List from "./page/Product_list";
import Product_List1 from "./page/Product_list1";
import OrderManagement from "./page/admin/Order management/OrderManagement";
import Brand from "./page/admin/brand/Brand.tsx";
import BrandForm from "./page/admin/brand/BrandForm.tsx";
import ListComments from "./page/admin/comments/ListComments.tsx";
import Dashboard from "./page/admin/dashboard/Dashboard.tsx";
import FormProduct from "./page/admin/product/FormProduct";
import ProductList from "./page/admin/product/ProductList.tsx";
import TrashCan from "./page/admin/product/TrashCan.tsx";
import AddSize from "./page/admin/size/AddSize";
import ListSize from "./page/admin/size/ListSize";
import PermissionDenied from "./page/admin/user/PermissionDenied.tsx";
import UserList from "./page/admin/user/UserList";
import CreateVoucher from "./page/admin/voucher/CreateVoucher";
import Voucher from "./page/admin/voucher/Voucher";
import ViewProductDetails from "./page/admin/Order management/ViewProductDetails.tsx";
import ReturnManagement from "./page/admin/Return/ReturnManagement.tsx";
import RefundManagement from "./page/admin/Refund/RefundManagement.tsx";
import FlashSale from "./page/admin/flashsale/FlashSale.tsx";
import CreateFlashSale from "./page/admin/flashsale/CreateFlashSale.tsx";
import ApplyFlashSale from "./page/admin/flashsale/ApplyFlashSale.tsx";
import ApplyFlashSaleToMultipleProducts from "./page/admin/flashsale/ApplyFlashSaleToMultipleProducts.tsx";
import BaivietList from "./page/admin/baiviet/BaivietList.tsx";
import BaivietForm from "./page/admin/baiviet/BaivietForm.tsx";
import BaivietPage from "./page/Baiviet.tsx";
import BaivietChitiet from "./page/BaivietChitiet.tsx";
import EditVoucher from "./page/admin/voucher/EditVoucher.tsx";
import StafList from "./page/admin/user/StafList.tsx";

function App() {
    const { mappedPermissions } = useAuth();
    return (
        <>
            <CartProvider>
                <Routes>
                    {/* Client */}

                    <Route path="/" element={<LayoutClient />}>
                        <Route index element={<Hompage />} />
                        <Route path="/detail/:id" element={<DetailProduct />} />
                        <Route
                            path="/product_list"
                            element={<Product_List />}
                        />
                        <Route
                            path="/product_list1"
                            element={<Product_List1 />}
                        />
                        <Route path="/CartPage" element={<CartPage />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/checkOut" element={<Checkout />} />
                        <Route path="/checkOutNow" element={<CheckoutNow />} />
                        <Route
                            path="/paymentSuccess"
                            element={<PaymentSuccessPage />}
                        />
                        <Route
                            path="/historyOrder"
                            element={<HistoryOrders />}
                        />
                        <Route path="/aboutus" element={<Aboutus />} />
                        <Route path="/about" element={<About />} />

                        <Route
                            path="/productLike"
                            element={<ProductsLiked />}
                        />
                        <Route path="/contact" element={<Contact />} />

                        <Route path="/baiviet" element={<BaivietPage />} />
                        <Route
                            path="/baiviet/:id"
                            element={<BaivietChitiet />}
                        />
                    </Route>
                    <Route path="/loginAdmin" element={<LoginAdmin />} />
                    <Route path="/loading" element={<Loading />} />
                    {/*================admin===========================*/}

                    <Route path="/admin" element={<LayoutAdmin />}>
                        <Route index element={<Dashboard />} />{" "}
                        {/* >>San Pham */}
                        <Route
                            path="/admin/products"
                            element={<ProductList />}
                        />
                        <Route
                            path="/admin/add"
                            element={
                                mappedPermissions.includes("add-product") ? (
                                    <FormProduct />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        <Route
                            path="/admin/edit/:id"
                            element={
                                mappedPermissions.includes("edit-product") ? (
                                    <FormProduct />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        {/* >>Danh Muc */}
                        <Route
                            path="/admin/category"
                            element={<ManagerCate />}
                        />
                        <Route
                            path="/admin/category-add"
                            // element={<CategoryForm />}
                            element={
                                mappedPermissions.includes("add-category") ? (
                                    <CategoryForm />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        <Route
                            path="/admin/category-edit/:id"
                            element={
                                mappedPermissions.includes("edit-category") ? (
                                    <CategoryForm />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        {/* >>brand */}
                        <Route path="/admin/brand" element={<Brand />} />
                        <Route
                            path="/admin/brand-add"
                            element={
                                mappedPermissions.includes("add-brand") ? (
                                    <BrandForm />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        <Route
                            path="/admin/brand-edit/:id"
                            element={
                                mappedPermissions.includes("edit-brand") ? (
                                    <BrandForm />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        {/* >>Size*/}
                        <Route path="/admin/size" element={<ListSize />} />
                        <Route
                            path="/admin/size/add"
                            element={
                                mappedPermissions.includes("add-size") ? (
                                    <AddSize />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        {/* >>flashSale */}
                        <Route
                            path="/admin/flashsale"
                            element={<FlashSale />}
                        />
                        <Route
                            path="/admin/flashSaleAdd"
                            element={<CreateFlashSale />}
                        />
                        {/* <Route path="/admin/flashSaleUpdate/:id" element={<UpdateFlashSale />} /> */}
                        <Route
                            path="/admin/applyFlashSale/:id"
                            element={<ApplyFlashSale />}
                        />
                        <Route
                            path="/admin/applyFlashSaleAll"
                            // element={<ApplyFlashSaleToMultipleProducts />}
                            element={
                                mappedPermissions.includes("add-discount") ? (
                                    <ApplyFlashSaleToMultipleProducts />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        {/* >>Usser*/}
                        <Route path="/admin/user" element={<UserList />} />
                        <Route path="/admin/staff" element={<StafList />} />
                        <Route
                            path="/admin/user/permission/:id"
                            element={<PermissionDenied />}
                        />
                        {/* >>comments management */}
                        <Route
                            path="/admin/comments"
                            element={<ListComments />}
                        />
                        {/* >>Order management */}
                        <Route
                            path="/admin/orders"
                            element={<OrderManagement />}
                        />
                        {/* hoàn trả */}
                        <Route
                            path="/admin/returns"
                            element={
                                <ReturnManagement
                                    onReturnApproved={(orderId) => {}}
                                />
                            }
                        />
                        {/* hoàn tiền */}
                        <Route
                            path="/admin/refunds"
                            element={<RefundManagement />}
                        />
                        {/* >>Voucher*/}
                        <Route path="/admin/voucher" element={<Voucher />} />
                        <Route
                            path="/admin/voucherAdd"
                            element={
                                mappedPermissions.includes("add-voucher") ? (
                                    <CreateVoucher />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        <Route
                            path="/admin/voucherEdit/:id"
                            //  element={<EditVoucher />}
                            element={
                                mappedPermissions.includes("edit-voucher") ? (
                                    <EditVoucher />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        <Route path="/admin/trashCan" element={<TrashCan />} />
                        {/* >>Xem chi tiết sản phẩm  */}
                        <Route
                            path="/admin/viewproductdetails/:id"
                            element={<ViewProductDetails />}
                        />
                        {/* >>Bài viết */}
                        <Route
                            path="/admin/baiviet"
                            element={<BaivietList />}
                        />
                        <Route
                            path="/admin/baiviet/add"
                            // element={<BaivietForm />}
                            element={
                                mappedPermissions.includes(
                                    "add-newspaperArticle"
                                ) ? (
                                    <BaivietForm />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                        <Route
                            path="/admin/baiviet/edit/:id"
                            // element={<BaivietForm />}
                            element={
                                mappedPermissions.includes(
                                    "edit-newspaperArticle"
                                ) ? (
                                    <BaivietForm />
                                ) : (
                                    <Authorization403 />
                                )
                            }
                        />
                    </Route>
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </CartProvider>
            <ToastContainer />
        </>
    );
}

export default App;
