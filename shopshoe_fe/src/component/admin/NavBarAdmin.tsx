import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
type Props = {
    ClickSideBar: () => void;
    collapsed: boolean;
};
const NavBar = ({ ClickSideBar, collapsed }: Props) => {
    const { user } = useAuth();
    console.log(user);

    // Quản Lý sản phẩm trong dashboard
    const [messageProducts, setMessageProducts] = useState(false);
    const HiddenDashboard = () => {
        setMessageProducts(!messageProducts);
    };
    // ----end Quản Lý san pham---
    // |
    // Quản Lý User trong dashboard
    const [messageUser, setMessageUser] = useState(false);
    const HiddenUser = () => {
        setMessageUser(!messageUser);
    };
    // console.log(messageUser);

    // ----end Quản Lý san pham---
    // Quản Lý User trong dashboard
    const [messageOrder, setMessageOrder] = useState(false);
    const HiddenOrder = () => {
        setMessageOrder(!messageOrder);
    };
    // console.log("messageOrder", messageOrder);
    return (
        <>
            <div className={` header_admin ${collapsed ? "collapsed" : ""}`}>
                <div className="search_admin"></div>
            </div>
            {/* Sidebar */}
            <div>
                <div
                    className={`sidebar ${collapsed ? "collapsed" : ""}`}
                    id="mySidebar"
                >
                    <div className="sidebar-header">
                        {collapsed ? (
                            <>
                                <Link to="/">
                                    <div style={{ marginLeft: "-7px" }}>
                                        <svg
                                            version="1.1"
                                            viewBox="0 0 888 896"
                                            width="100"
                                            height="35"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                transform="translate(0)"
                                                d="m0 0h888v896h-888z"
                                            />
                                            <path
                                                transform="translate(418,32)"
                                                d="m0 0 9 3 21 12 54 30 25 14 49 28 25 14 23 13 28 16 25 14 21 12 25 14 24 14 26 15 2 4-9 7-5 4-3 1h-7l-16-8-56-31-22-13-11-6-98-56-23-13-27-15-17-10-11-6-29-16-15-8-8-1-21 10-21 12-26 15-28 16-24 14-22 13-28 17-24 14-25 15-26 15-32 19-21 13-19 11-12 6h-2l2 218 1 89 1 52 1 28 4 4 27 15 50 28 21 12 25 14 24 14 22 12 21 12 25 14 27 16 28 16 18 10 33 17 8 4 5-2 22-11 82-48 99-58 22-13 29-17 52-30 14-8 5-2 10 1 10 5 3 4-2 5-14 9-29 17-26 15-53 31-28 17-24 14-27 16-29 17-15 9-29 17-27 16-24 14-21 12-6-1-23-11-23-13-50-28-23-13-25-14-23-13-50-28-23-13-18-10-21-12-25-14-25-15-17-10-11-8-1-9-1-28-2-110-1-85v-179l4-5 15-10 32-19 88-52 55-33 72-42 26-15 22-13 26-15z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(763,353)"
                                                d="m0 0h78l36 2 5 2 1 1v21l-2 7-9 10-11 12-12 12-7 8-16 16-7 8-16 17-9 10-16 16-4 3 2 1 10 1 65 2 19 1 11 2 2 2 1 6v10l-3 8-6 2-16 2h-116l-19-2-5-2-1-2-1-27 7-8 44-44 2-3h2l2-4 29-29 7-8 13-13 2-5-90-2-12-2-5-4v-21l2-3 3-1z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(360,113)"
                                                d="m0 0 4 1-8 6-28 17-22 13-11 7-28 16-19 11-20 12-28 17-25 14-27 16-23 14-14 11-1 18-1 59v38l2 143 1 65 1 34 2 6 21 12 25 14 23 13 25 14 17 10 23 13 25 14 17 10 24 13 23 13 27 15 25 14 19 12 9 5 5 1 12-3 17-9 28-17 21-12 26-15 70-41 28-17 28-16 24-14 32-19 17-10 7-3 5 1-2 4-17 10-26 15-24 14-27 16-26 15-22 13-26 15-27 16-28 17-26 15-27 16-23 13-10 4-10-3-21-11-23-13-28-16-26-15-24-13-21-12-29-16-26-15-21-12-12-7-12-6-23-13-25-14-16-10-4-4-1-4-1-26v-337l5-5 18-10 28-17 28-16 24-14 20-12 16-10 26-15 27-15 16-10 21-13 21-12z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(444,476)"
                                                d="m0 0 5 1-3 5-4 4 8-1 2-1h6v3l-4 5 6-3 16-9h4l-1 7-9 14 3-1 16-10 5-1-1 6-6 9-11 12-7 6-7 1v-14l2-5-7 3-10 5-4 1h-7l-1-5 7-10-14 2h-8v-4l5-5 1-2-3-1 2-4z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(419,80)"
                                                d="m0 0 9 2 16 8 41 23 27 16 23 13 24 14 23 12 14 9 4 5-3 1-17-9-14-8-22-12-23-13-28-16-27-15-25-14-18-8-5-1-12 5-19 10-12 7-6 2 2-4 10-7 20-12 14-7z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(604,184)"
                                                d="m0 0 6 1 28 15 23 13 25 14 24 14 16 9v2l-8-1-16-8-18-10-24-14-24-13-24-14-8-6z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(384,388)"
                                                d="m0 0 4 2 8 8 11 9 12 11 6 4v1h-23l-7-8-8-16-3-7z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(360,429)"
                                                d="m0 0 5 1 14 7 6 4v2h-7l-6-3 4 7 6 7 1 5-8-6-7-7-6-8-2-5z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(424,431)"
                                                d="m0 0 13 1 15 4 2 4-12-1-20-4-1-3z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(363,391)"
                                                d="m0 0 4 1 2 7-1 9-5-4-2-9z"
                                                fill="#FEFEFE"
                                            />
                                            <path
                                                transform="translate(381,429)"
                                                d="m0 0 5 2 5 5-1 2-9-7z"
                                                fill="#FEFEFE"
                                            />
                                        </svg>
                                    </div>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/">
                                    <div
                                        style={{
                                            marginLeft: "28px",
                                        }}
                                    >
                                        <svg
                                            version="1.0"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="150px"
                                            height="60px"
                                            viewBox="0 0 1016.000000 534.000000"
                                            preserveAspectRatio="xMidYMid meet"
                                        >
                                            <g
                                                transform="translate(0.000000,534.000000) scale(0.100000,-0.100000)"
                                                fill="#ffffff"
                                                stroke="none"
                                            >
                                                <path
                                                    d="M2625 4447 c-50 -30 -184 -109 -300 -177 -115 -68 -280 -164 -365
-215 -85 -50 -211 -125 -280 -165 -133 -78 -194 -113 -443 -260 -87 -51 -162
-101 -167 -111 -13 -23 7 -1886 20 -1910 6 -10 52 -41 102 -69 51 -29 122 -69
158 -90 36 -20 137 -78 225 -127 255 -144 617 -349 1047 -592 96 -54 133 -71
149 -66 12 4 54 26 93 50 39 23 150 88 246 145 96 57 245 145 330 195 85 51
211 125 280 165 69 40 143 84 165 98 79 47 405 238 454 264 28 16 51 35 51 43
0 20 -58 55 -91 55 -14 0 -66 -24 -115 -54 -49 -29 -132 -78 -184 -108 -81
-47 -691 -404 -1101 -644 -69 -41 -134 -74 -145 -74 -10 0 -111 52 -224 116
-113 64 -239 136 -280 159 -135 77 -530 300 -790 447 l-255 144 -6 195 c-3
107 -8 511 -10 899 l-4 705 70 41 c39 23 156 92 260 154 105 62 206 122 225
133 57 32 270 157 335 197 33 20 103 61 155 92 52 30 181 105 285 166 105 62
201 112 212 112 23 0 74 -28 543 -295 162 -92 363 -206 445 -253 83 -46 182
-103 220 -126 39 -22 104 -59 145 -82 41 -23 101 -56 133 -74 65 -36 88 -35
132 6 l29 27 -23 18 c-13 11 -62 41 -110 68 -80 45 -235 133 -1153 654 -190
108 -353 197 -360 197 -7 0 -54 -24 -103 -53z"
                                                />
                                                <path
                                                    d="M2605 4219 c-109 -66 -122 -76 -112 -85 3 -3 18 3 34 14 53 37 180
102 199 102 19 0 140 -56 166 -77 13 -10 116 -69 273 -154 42 -22 106 -58 143
-80 37 -21 70 -39 75 -39 5 0 23 -11 40 -24 32 -24 130 -76 143 -76 4 0 -6 11
-22 25 -16 14 -32 25 -36 25 -3 0 -45 23 -93 50 -48 28 -89 50 -91 50 -2 0
-28 15 -57 34 -28 18 -131 77 -227 131 -96 54 -186 105 -200 115 -45 30 -89
50 -112 50 -13 0 -68 -27 -123 -61z"
                                                />
                                                <path
                                                    d="M2325 4054 c-60 -36 -112 -69 -115 -72 -6 -8 -10 -11 -145 -82 -86
-46 -175 -99 -265 -160 -14 -9 -57 -34 -95 -55 -90 -48 -199 -111 -250 -144
-22 -14 -49 -31 -60 -37 -11 -6 -45 -25 -75 -42 l-55 -31 -3 -846 c-1 -573 1
-852 8 -866 6 -10 36 -33 68 -49 31 -16 80 -43 107 -60 28 -17 70 -41 95 -54
25 -13 88 -47 140 -76 52 -29 115 -64 140 -78 25 -13 52 -30 60 -36 13 -12
145 -85 225 -125 16 -8 45 -25 63 -38 19 -12 60 -35 91 -49 31 -15 58 -30 61
-35 3 -4 32 -22 65 -39 33 -17 92 -50 130 -72 133 -78 229 -128 242 -128 20 0
57 20 238 128 88 53 189 112 225 133 36 20 94 55 130 77 36 21 135 80 220 129
85 50 178 104 205 120 180 108 278 166 330 195 93 51 98 54 94 67 -5 15 -44
-6 -274 -141 -93 -56 -213 -126 -265 -156 -52 -31 -135 -80 -185 -110 -49 -30
-103 -62 -120 -70 -16 -8 -73 -41 -125 -72 -52 -32 -111 -66 -130 -77 -19 -10
-101 -58 -181 -106 -153 -91 -185 -101 -221 -67 -11 10 -46 32 -77 48 -106 56
-238 130 -430 240 -68 40 -125 72 -127 72 -2 0 -34 19 -71 42 -38 22 -86 50
-108 60 -22 10 -74 40 -115 65 -41 25 -102 60 -135 78 -60 33 -184 103 -281
160 l-51 29 -7 266 c-15 606 -19 1386 -7 1408 14 26 95 82 206 142 44 23 128
74 187 111 59 38 127 78 150 90 24 12 45 24 48 28 3 3 32 19 65 36 33 16 112
63 175 104 63 40 135 83 160 95 53 27 149 86 168 104 33 30 -19 8 -123 -54z"
                                                />
                                                <path
                                                    d="M3589 3786 c7 -9 41 -31 75 -49 33 -19 95 -53 136 -77 41 -23 100
-56 130 -73 30 -16 62 -35 70 -42 28 -23 121 -66 137 -63 11 2 7 8 -13 18 -16
8 -58 33 -94 54 -36 22 -99 57 -140 79 -41 22 -87 48 -102 58 -14 11 -30 19
-35 19 -5 0 -31 14 -59 31 -27 18 -65 38 -84 46 -31 14 -33 14 -21 -1z"
                                                />
                                                <path
                                                    d="M6868 3013 c-15 -2 -43 -22 -62 -44 l-36 -39 0 -340 0 -339 31 -35
c17 -20 45 -39 62 -43 18 -5 160 -6 316 -3 l283 5 34 39 34 39 0 338 0 338
-38 41 -39 40 -235 0 c-129 0 -255 2 -279 4 -24 2 -56 2 -71 -1z m480 -159
l22 -6 -2 -262 -3 -261 -209 -3 c-115 -1 -213 1 -218 6 -4 4 -9 122 -10 261
-2 211 1 254 13 262 15 10 371 12 407 3z"
                                                />
                                                <path
                                                    d="M8653 3009 c-19 -6 -43 -25 -62 -51 l-31 -42 0 -335 0 -334 42 -39
c34 -31 49 -38 82 -38 23 -1 155 -1 294 -1 249 -1 254 0 287 23 19 12 39 32
45 43 7 13 10 91 8 215 l-3 195 -170 3 c-193 3 -195 2 -195 -76 0 -76 8 -82
111 -82 87 0 90 -1 99 -26 6 -14 10 -40 10 -59 0 -19 -4 -45 -10 -59 l-10 -26
-203 0 c-145 0 -206 3 -215 12 -9 9 -12 80 -12 260 0 234 1 248 19 258 21 11
337 14 389 4 25 -5 31 -12 37 -40 7 -39 29 -54 80 -54 66 0 75 11 75 94 0 71
-1 75 -37 114 l-38 42 -280 4 c-154 2 -294 0 -312 -5z"
                                                />
                                                <path
                                                    d="M4122 2998 c-7 -7 -12 -33 -12 -59 0 -79 -1 -79 253 -80 122 0 231
-4 242 -9 17 -7 -13 -41 -237 -267 l-258 -259 0 -66 c0 -49 4 -69 17 -79 22
-19 715 -18 738 1 19 16 20 113 2 128 -9 8 -97 12 -255 12 -174 1 -242 5 -242
13 0 6 110 122 244 257 134 135 249 255 255 267 15 29 14 126 -1 141 -17 17
-729 17 -746 0z"
                                                />
                                                <path
                                                    d="M5026 2970 l-36 -40 0 -341 c0 -205 4 -348 10 -359 5 -10 27 -29 47
-42 38 -23 39 -23 323 -20 264 3 287 5 318 24 63 39 62 30 62 395 l0 332 -32
38 c-18 21 -37 41 -43 45 -5 4 -146 8 -311 8 l-302 0 -36 -40z m533 -116 l31
-6 0 -258 c0 -226 -2 -259 -16 -264 -26 -10 -398 -7 -414 4 -13 8 -15 47 -14
261 2 199 5 253 15 260 16 10 351 12 398 3z"
                                                />
                                                <path
                                                    d="M5897 3003 c-10 -9 -8 -805 1 -820 12 -19 132 -20 143 -2 5 8 9 82 9
165 l0 152 95 7 c146 11 159 7 259 -88 l86 -82 0 -71 c0 -86 11 -99 82 -99 72
0 80 15 76 142 l-3 102 -82 84 c-46 47 -83 88 -83 92 0 4 33 42 74 84 41 42
79 89 85 104 14 35 14 177 1 211 -9 24 -14 26 -68 26 -32 0 -63 -5 -70 -12 -7
-7 -12 -41 -12 -82 l0 -71 -87 -87 -88 -88 -132 0 -133 0 0 158 c0 110 -4 162
-12 170 -13 13 -130 17 -141 5z"
                                                />
                                                <path
                                                    d="M7677 3003 c-12 -11 -8 -821 3 -828 6 -4 35 -9 65 -12 89 -9 85 -22
85 293 0 151 3 274 8 274 5 0 199 -253 325 -425 12 -16 41 -53 65 -82 39 -48
46 -52 97 -58 43 -6 61 -4 80 9 l25 16 0 398 c0 296 -3 401 -12 410 -19 19
-134 16 -142 -4 -3 -9 -6 -135 -6 -280 0 -145 -4 -264 -8 -264 -5 0 -94 114
-197 253 -104 138 -200 264 -214 280 -23 25 -31 27 -96 27 -40 0 -75 -3 -78
-7z"
                                                />
                                                <path
                                                    d="M2564 2829 c9 -44 52 -116 81 -135 18 -12 35 -14 62 -9 l38 7 -35 26
c-19 14 -62 53 -94 85 -59 59 -59 59 -52 26z"
                                                />
                                                <path
                                                    d="M2460 2812 c0 -16 7 -37 16 -48 15 -18 15 -18 8 5 -4 15 -3 21 5 17
7 -5 7 2 0 24 -14 38 -29 39 -29 2z"
                                                />
                                                <path
                                                    d="M2459 2621 c21 -39 73 -91 94 -91 6 0 -7 19 -28 41 -26 28 -33 39
-20 34 11 -4 31 -10 45 -13 23 -5 24 -4 10 13 -14 17 -91 55 -111 55 -5 0 -1
-17 10 -39z"
                                                />
                                                <path d="M2567 2639 c12 -12 25 -20 28 -17 3 3 -7 13 -22 23 l-28 17 22 -23z" />
                                                <path
                                                    d="M2734 2642 c8 -13 108 -35 134 -30 14 3 14 6 -6 17 -32 17 -138 28
-128 13z"
                                                />
                                                <path
                                                    d="M2791 2418 c-37 -14 -49 -23 -40 -29 11 -6 10 -11 -4 -27 -9 -10 -17
-22 -17 -25 0 -11 78 -8 85 3 3 6 11 10 16 10 6 0 1 -13 -10 -29 -12 -16 -21
-34 -21 -40 0 -20 57 -11 95 14 l37 26 -7 -51 c-9 -65 8 -67 74 -5 69 64 97
141 39 103 -13 -8 -35 -23 -50 -32 l-27 -17 27 50 c15 27 24 52 20 56 -3 3
-31 -10 -61 -29 -62 -40 -78 -45 -54 -18 24 26 11 33 -28 16 -49 -20 -65 -17
-32 7 25 20 36 40 20 38 -5 0 -32 -9 -62 -21z"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                    <ul>
                        {/* Dashboard */}
                        <li>
                            <Link to="">
                                <i className="fas fa-home icon"></i>
                                <span className="menu-text">Dashboard</span>
                            </Link>
                        </li>
                        {/* **End-Dashboard** */}
                        {/* Category */}
                        <li>
                            <Link to="/admin/category">
                            <i  style={{
                                    fontSize: "1.2rem",
                                }}
                             className="fa-solid fa-table-list"></i>                                <span className="menu-text">QL Danh Mục</span>
                            </Link>
                        </li>
                        {/* **End-Category** */}
                        {/* Flash Sale */}
                        <li>
                            <Link to="/admin/flashSale">
                            <i
                            style={{
                                fontSize:"1.5rem"
                            }}
                             className="fa-solid fa-bolt"></i>
                                <span className="menu-text">QL Flash Sale</span>
                            </Link>
                        </li>
                        {/* **End-Flash Sale** */}
                        {/* Product */}
                        <li>
                            <p onClick={HiddenDashboard}>
                                <i className="fa-solid fa-book icon"></i>
                                <span className="menu-text">QL Sản Phẩm</span>
                                <i
                                    className={`fa-solid fa-chevron-down ${
                                        messageProducts ? "rotateMProduct" : ""
                                    }`}
                                ></i>
                            </p>
                        </li>
                        <div
                            className={`sub_menu ${
                                messageProducts ? "show_sub_menu_MProduct" : ""
                            }`}
                        >
                            <Link
                                to="/admin/products"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Sản Phẩm
                            </Link>

                            {/* <Link
                                to="/admin/category"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Danh Mục
                            </Link> */}
                            <Link
                                to="/admin/size"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Size
                            </Link>
                            <Link
                                to="/admin/brand"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Thương Hiệu
                            </Link>
                            {/* <Link
                                to="/admin/voucher"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Voucher
                            </Link> */}
                            {/* <Link
                                to="/admin/flashSale"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                FlashSale
                            </Link> */}
                        </div>
                        {/* **End-Product** */}
                        {/* Voucher */}
                        <li>
                            <Link to="/admin/voucher">
                            <i style={{fontSize:"1.2rem"}} className="fa-solid fa-ticket"></i>
                                <span className="menu-text">QL Voucher</span>
                            </Link>
                        </li>
                        {/* **End-Voucher** */}
                        {/* QL User */}
                        <li>
                            <p onClick={HiddenUser}>
                                <i className="fa-solid fa-user icon"></i>
                                <span className="menu-text">QL User</span>
                                <i
                                    className={`fa-solid fa-chevron-down ${
                                        messageUser ? "rotateMUser" : ""
                                    }`}
                                ></i>
                            </p>
                        </li>
                        <div
                            className={`sub_menu_MUser ${
                                messageUser ? "show_sub_menu_MUser" : ""
                            }`}
                        >
                            <Link
                                to="/admin/user"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Quản Lý User
                            </Link>
                            {user?.level === "boss" ? (
                                <Link
                                    to="/admin/staff"
                                    style={{
                                        textDecoration: "none",
                                    }}
                                >
                                    Quản Lý Nhân Viên
                                </Link>
                            ) : (
                                <Link
                                    to="/authorization403"
                                    style={{
                                        textDecoration: "none",
                                    }}
                                    className="disabled-link"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    
                                    Quản Lý Nhân Viên
                                </Link>
                            )}
                        </div>
                        {/* --End QL User-- */}
                        {/* QL Đơn Hàng */}
                        <li>
                            {/* <Link to="/admin/orders">
                                <i className="fas fa-envelope icon"></i>
                                <span className="menu-text">QL Đơn Hàng</span>
                            </Link> */}
                            <p onClick={HiddenOrder}>
                            <i
                            style={{fontSize:"1.2rem"}} className="fa-solid fa-shop"></i>
                                <span className="menu-text">QL Đơn Hàng</span>
                                <i
                                    className={`fa-solid fa-chevron-down ${
                                        messageOrder ? "rotateMOrder" : ""
                                    }`}
                                ></i>
                            </p>
                        </li>
                        <div
                            className={`sub_menu_MOrder ${
                                messageOrder ? "show_sub_menu_MOrder" : ""
                            }`}
                        >
                            <Link
                                to="/admin/orders"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Quản Lý Đơn Hàng
                            </Link>
                            <Link
                                to="/admin/returns"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Quản Lý Hoàn Trả
                            </Link>
                            <Link
                                to="/admin/refunds"
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                Quản Lý Hoàn Tiền
                            </Link>
                        </div>
                        {/* --End QL Đơn Hàng-- */}
                        <li>
                            <Link to="/admin/comments">
                                <i
                                    className="fa-solid fa-comments"
                                    style={{
                                        fontSize: "13px",
                                        marginRight: "8px",
                                        verticalAlign: "middle",
                                    }}
                                ></i>
                                <span className="menu-text">QL đánh giá</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/trashCan">
                                <i className="fas fa-cog icon"></i>
                                <span className="menu-text">Kho Lưu Trữ</span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="/admin/returns">
                                <i
                                    className="fa fa-undo"
                                    style={{ fontSize: "13px" }}
                                ></i>
                                <span className="menu-text">
                                    Quản lý hoàn trả
                                </span>
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link to="/admin/refunds">
                                <i
                                    className="fa fa-money-bill-wave"
                                    style={{ fontSize: "13px" }}
                                ></i>
                                <span className="menu-text">
                                    Quản lý hoàn tiền
                                </span>
                            </Link>
                        </li> */}
                        <li>
                            <Link to="/admin/baiviet">
                                <i
                                    className="fa-regular fa-newspaper"
                                    style={{
                                        fontSize: "13px",
                                        marginRight: "8px",
                                        verticalAlign: "middle",
                                    }}
                                ></i>
                                <span className="menu-text">QL bài viết</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div
                    className="menu-icon"
                    id="menuIcon"
                    style={{
                        left: collapsed ? "50px" : "220px",
                        color: "white",
                    }}
                    onClick={ClickSideBar}
                >
                    <i className="fa-solid fa-layer-group"></i>
                </div>
                <div className="sidebar-footer d-flex align-items-center">
                    <img
                        src={`${user?.avatar}`}
                        alt=""
                        style={{
                            width: "35px",
                            height: "35px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: "10px",
                        }}
                    />
                    <span className="fs-5 me-4 text-white">
                        {user?.username}
                    </span>
                    <Link to="/">
                        <i className="fas fa-power-off icon fs-3"></i>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NavBar;
