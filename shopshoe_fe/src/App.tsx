import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import instance from "./api";
import "./App.css";
import { Product } from "./interface/Products";

import FormProduct from "./page/admin/product/FormProduct";
import Hompage from "./page/Hompage";
import DetailProduct from "./page/DetailProduct";
import DashBoard from "./page/admin/product/DashBoard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ManagerCate from "./page/admin/category/ManagerCate";
import CategoryForm from "./page/admin/category/CategoryForm";
import AuthForm from "./page/AuthForm";
import LayoutAdmin from "./component/layout/LayoutAdmin";
import LayoutClient from "./component/layout/LayoutClient";
function App() {
    const [product, setProduct] = useState<Product[]>([]);
    const nav = useNavigate();
    const getAlldata = async () => {
        const { data } = await instance.get("/products");
        // console.log(data.data);
        setProduct(data.data);
    };
    useEffect(() => {
        getAlldata();
    }, []);
    return (
        <>
            <Routes>
                {/* Client */}
                <Route path="/" element={<LayoutClient />}>
                    <Route index element={<Hompage />} />
                    <Route path="/detail/:id" element={<DetailProduct />} />
                </Route>
                <Route path="/login" element={<AuthForm isLogin />} />
                <Route path="/register" element={<AuthForm />} />
                {/*================admin===========================*/}
                {/* >>San Pham */}
                <Route path="/admin" element={<LayoutAdmin />}>
                    <Route index element={<DashBoard />} />
                    <Route path="/admin/add" element={<FormProduct />} />
                    <Route path="/admin/edit/:id" element={<FormProduct />} />
                    {/* >>Danh Muc */}
                    <Route path="/admin/category" element={<ManagerCate />} />
                    <Route
                        path="/admin/category-add"
                        element={<CategoryForm />}
                    />
                    <Route
                        path="/admin/category-edit/:id"
                        element={<CategoryForm />}
                    />
                </Route>
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;
