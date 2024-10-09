import { Outlet } from "react-router-dom";
// import Header from "../Header";
import Footer from "../Footer";
import Header2 from "../Header2";

const LayoutClient = () => {
    return (
        <div>
            <Header2 />
            <Outlet />
            <Footer />
        </div>
    );
};

export default LayoutClient;
