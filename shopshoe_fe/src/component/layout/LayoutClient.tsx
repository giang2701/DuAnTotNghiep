import { Outlet } from "react-router-dom";
// import Header from "../Header";
import Footer from "../Footer";
import Header from "../Header";

const LayoutClient = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default LayoutClient;
