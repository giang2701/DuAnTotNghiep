import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const Page404 = (props: Props) => {
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : "";
    console.log(role);

    return (
        <>
            <div
                className="page_404 container-fluid text-center"
                style={{
                    backgroundColor: "#f8f9fb",
                    height: "100vh",
                }}
            >
                <div className="four_zero_four_bg"></div>
                <div className="constant_box_404 ">
                    <h3 className="h2">Looks like you're lost</h3>
                    <p>Sorry, the page you are looking for does not exist.</p>
                    {role === "admin" ? (
                        <>
                            <Link to="/admin" className="link_404">
                                Go to Home
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="link_404">
                                Go to Home
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Page404;
