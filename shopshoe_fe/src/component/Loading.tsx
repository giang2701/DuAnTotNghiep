import React from "react";

type Props = {};

const Loading = (props: Props) => {
    return (
        <>
            <div
                className=""
                style={{
                    width: "100vw",
                    height: "100vh",
                    // backgroundColor: "#999999",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: "9999", // Change this line
                }}
            >
                <img
                    src="../../public/images/Animation - 1732799696407.gif"
                    alt=""
                    style={{
                        position: "relative",
                        zIndex: "999",
                        height: "80px",
                        width: "80px",
                        backgroundColor: "white",
                        // borderRadius: "10px",
                        // border: "1px solid #ccc",
                    }}
                />
            </div>
        </>
    );
};

export default Loading;
