import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Props = {};

const LayoutAdmin = (props: Props) => {
    const { user } = useAuth();
    console.log(user);
    if (!user || user.role !== "admin") {
        return <h1>Ban khong co quyen vao trang nay!</h1>;
    }
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default LayoutAdmin;
