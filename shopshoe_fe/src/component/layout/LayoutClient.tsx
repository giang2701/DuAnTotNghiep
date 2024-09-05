import { Outlet } from "react-router-dom";
import Header from "../Header";

const LayoutClient = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};

export default LayoutClient;
