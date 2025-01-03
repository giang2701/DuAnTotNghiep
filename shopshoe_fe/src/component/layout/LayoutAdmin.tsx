import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../admin/NavBarAdmin";
import Authorization403 from "../Authorzation403";
const LayoutAdmin = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };
    if (!user || user.role !== "admin") {
        return <Authorization403 />;
    }
    return (
        <div
        className="admin-layout"
        style={{
            backgroundColor: "#EEEEEE",
            minHeight: "100vh", // Đảm bảo ít nhất bằng chiều cao viewport
            display: "flex", // Flexbox giúp layout gọn hơn
            flexDirection: "column", // Đặt các phần tử theo cột
        }}
    >
            <NavBar ClickSideBar={toggleSidebar} collapsed={collapsed} />
            {/* <HeaderAdmin /> */}
            <div
                className={`content__layoutAdmin ${
                    collapsed ? "collapsed" : ""
                }`}
                style={{
                    flex: 1, // Đảm bảo phần nội dung chiếm tối đa không gian còn lại
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutAdmin;
