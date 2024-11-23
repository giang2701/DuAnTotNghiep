import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../admin/NavBarAdmin";
const LayoutAdmin = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };
    if (!user || user.role !== "admin") {
        return <h1>Bạn không có quyền vào trang này!</h1>;
    }

    return (
        <div
            className="admin-layout"
            style={{ backgroundColor: "#EEEEEE", minHeight: "980px" }}
        >
            <NavBar ClickSideBar={toggleSidebar} collapsed={collapsed} />
            {/* <HeaderAdmin /> */}
            <div
                className={`content__layoutAdmin ${
                    collapsed ? "collapsed" : ""
                }`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutAdmin;
