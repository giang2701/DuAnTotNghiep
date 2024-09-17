import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import instance from "./api";
import "./App.css";
import { Product } from "./interface/Products";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutAdmin from "./component/layout/LayoutAdmin";
import LayoutClient from "./component/layout/LayoutClient";
import CategoryForm from "./page/admin/category/CategoryForm";
import ManagerCate from "./page/admin/category/ManagerCate";
import DashBoard from "./page/admin/product/DashBoard";
import FormProduct from "./page/admin/product/FormProduct";
import Login from "./page/Auth/Login";
import Register from "./page/Auth/Register";
import DetailProduct from "./page/DetailProduct";
import Hompage from "./page/Hompage";
function App() {
    return (
        <>
            <Routes>
                {/* Client */}
                <Route path="/" element={<LayoutClient />}>
                    <Route index element={<Hompage />} />
                    <Route path="/detail/:id" element={<DetailProduct />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
