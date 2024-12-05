import React from "react";

type Props = {};

const Authorization403 = (props: Props) => {
    return (
        <>
            <div
                className="container d-flex justify-content-evenly align-items-center   "
                style={{ height: "100vh" }}
            >
                <div>
                    <h1
                        className="h1"
                        style={{
                            fontWeight: "900",
                            fontSize: "60px",
                            fontFamily: "monospace",
                        }}
                    >
                        Zokong 403
                    </h1>
                    <p style={{ fontSize: "20px" }}>
                        <strong style={{ marginRight: "7px" }}>403</strong>
                        That's an error.
                    </p>
                    <p style={{ fontSize: "15px" }}>
                        You don't have permission to access / on this server.
                    </p>
                </div>
                <div style={{ marginLeft: "-200px" }}>
                    <img src="../../public/404 phân quyền.jpg" alt="" />
                </div>
            </div>
        </>
    );
};

export default Authorization403;
