import React, { useContext, useEffect, useState } from "react";
import {
    CategoryContext,
    CategoryContextType,
} from "../context/CategoryContext";
import { Category } from "../interface/Category";
import instance from "../api";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { styled } from "@mui/material";
export const IconCart = styled(LocalMallOutlinedIcon)({
    fontSize: "2.3rem",
    marginTop: "-7px",
    color: "rgb(92, 88, 88)",
    // Media query cho kích thước màn hình từ 740px đến 1024px
    "@media (min-width: 740px) and (max-width: 1024px)": {
        fontSize: "1.9rem",
        marginTop: "-6px",
        color: "rgb(92, 88, 88)", // Ví dụ đổi màu
    },
    "@media (max-width: 739px) ": {
        fontSize: "2.5rem",
        position: "absolute",
        top: "25px",
        right: "20px",
    },
});

type Props = {};

const Header = () => {
    const [category, setCategory] = useState<Category[]>([]);
    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/categorys");
            const filteredCategories = data.data.filter(
                (category: Category) =>
                    category._id !== "66add3f79957be752707a054"
            );
            setCategory(filteredCategories);
        })();
    }, []);
    return (
        <>
            <header className="Box__header container">
                {/* ======HEADER PC============ */}
                <div className="sub__header">
                    {/* Category */}
                    <div className="Category__sub__header ">
                        {category.map((cate) => (
                            <p>{cate.title}</p>
                        ))}
                        <p>Blog</p>
                        <p>Về Chúng Tôi</p>
                    </div>
                    {/* Logo */}
                    <div className="logo__sub__header">
                        <svg
                            version="1.1"
                            viewBox="0 0 2048 1448"
                            width="120"
                            height="120"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                transform="translate(1197,392)"
                                d="m0 0h24l20 6 16 8 25 14 39 22 23 13 3 4-9-1-16-2h-17l-16 4-25 12-15 8-22 13-14 8-1 3 3 5 31 16 25 15 12 9 16 16 8 13 7 15 4 16v23l-2 18v16l1 4 3 1 34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 2 1-1-10-1-23-1-190-2-15-5-17-7-13-8-10-11-11-1-4 8 4 15 9 17 10 21 12 28 17 16 11 10 8 9 11 9 14 8 20 1 6v58l-4 69v142l3 44 1 14v102l-4 16-8 16-10 14-11 11-14 10-15 9-26 15-56 32-26 15-24 14-84 48-24 14-26 15-23 13-25 15-16 9-14 6-21 5h-20l-14-3-12-4-23-12-17-10-23-13-36-21v-3l11 2h31l18-5 19-9 48-28 23-13 24-14 28-16 26-15 17-10 28-16 26-15 29-17 28-16 26-15 27-16 16-10 11-9 9-9 10-16 6-14 3-10 1-15v-105l-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-11-13-1-3h-2l1 7v27l-1 3v13l4 10 7 11 9 12 9 13 7 10 1 3 1 79 1 43-1 1h-35l-7 2-11 20-9 11-7 7-14 10-17 10-14 8-24 14-26 15-42 24-24 14-19 11-52 30-25 14-17 10-26 15-29 17-21 12-18 10-14 5-27 1-17-1-13-4-16-8-23-13-24-14-22-12-20-11-1-2h9l9 1h26l16-3 18-8 16-9 21-12 19-12 1-2-5-5-15-10-24-13-19-12-11-8-8-7-7-10-8-15-5-16-2-14v-33l1-69 1-195 4-15 5-12 6-10 11-13 11-9 16-10 21-12 52-30 16-9 14-8 24-14 22-13 21-12 23-13 24-14 77-44 26-15 22-13 12-5zm-6 122-11 4-19 11-25 15-23 13-24 14-28 16-15 9-17 10-23 13-26 15-23 13-24 14-14 9-10 8-6 5-9 13-9 20-4 13 1 4 8-6 7-8 6-5 7-8 15-15 7-8 5-6 2-1v-2l3-1 57-1 5-1-7 8-8 8-8 7-7 7-4 5-2 1v2l-4 2-21 21v2l-4 2-46 46 2 5 9 11 9 10 11 14 9 10 9 11 12 14 11 14 9 10 9 11 9 10 7 8 10 11 1 3-12-1-51-1-4-4-7-9-13-16-7-8-12-14-10-13-18-18-1 3 2 10 1 23 1 176 2 5 9 7 8-1 16-8 27-16 28-16 25-15 25-14 48-28 18-10 35-20 9-5 1-3-12-3-16-3-30-10-12-7-11-8-12-11-10-14-7-12-9-24-3-16-2-12v-9l3-1h45v9l3 20 6 15 6 10 11 12 14 9 13 6 13 2h31l14-2 16-7 12-8 7-6 7-10 3-8v-58l1-12 1-2v-8l-6-15-7-9-7-7-10-6-12-5-18-4-15-2v-44l20 2 15 3 20 6 18 7-1-74v-57l-1-29-4-7-6-4zm-366 197v17h1v-17zm606 66 1 2zm35 41m1 1 2 6 5 10 4 2-4-9-4-8z"
                                fill="#F59E2E"
                            />
                            <path
                                transform="translate(977,267)"
                                d="m0 0h24l15 2 11 5 21 11 16 9 27 15 24 14 12 8 1 3-10-1-16-3h-14l-17 3-15 6-17 9-24 14-14 8-27 16-18 10-48 28-42 24-48 28-52 30-28 16-26 15-18 12-11 9-10 14-7 15-5 18-1 9v62l22 12 12 9 9 8 12 16 10 18 6 16 4 18 1 15v14l-1 19-5 21-7 19-9 16-8 10-9 9-14 10-16 9-6 3h-2l1 64 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48l-10-7-16-10-14-11-11-11-10-16-8-17-5-15-5-25v-10l5-2h44l1 1 2 24 6 18 6 11 11 12 5 2-1-4v-317l3-14 6-15 10-16 5-6 10-8 17-11 24-14 18-10 53-31 24-14 28-16 23-13 27-16 18-10 14-8 29-17 24-14 21-12 22-13 18-10 11-5 11-3zm-319 464 1 131 4 1 9-10 8-13 5-11 3-11v-41l-5-17-5-10-10-13-5-4z"
                                fill="#0363B0"
                            />
                            <path
                                transform="translate(1393,483)"
                                d="m0 0 8 4 15 9 17 10 21 12 28 17 16 11 10 8 9 11 9 14 8 20 1 6v58l-4 69v142l3 44 1 14v102l-4 16-8 16-10 14-11 11-14 10-15 9-26 15-56 32-26 15-24 14-84 48-24 14-26 15-23 13-25 15-16 9-14 6-21 5h-20l-14-3-12-4-23-12-17-10-23-13-36-21v-3l11 2h31l18-5 19-9 48-28 23-13 24-14 28-16 26-15 17-10 28-16 26-15 29-17 28-16 26-15 27-16 16-10 11-9 9-9 10-16 6-14 3-10 1-15v-105l-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-9-11-4-7-8-11-4-7 1-1h14l34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 2 1-1-10-1-23-1-190-2-15-5-17-7-13-8-10-11-11zm38 294 1 2zm35 41m1 1 2 6 5 10 4 2-4-9-4-8z"
                                fill="#0464B0"
                            />
                            <path
                                transform="translate(604,668)"
                                d="m0 0h11l22 3 24 6 21 11 12 9 9 8 12 16 10 18 6 16 4 18 1 15v14l-1 19-5 21-7 19-9 16-8 10-9 9-14 10-16 9-6 3h-2l1 64 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48l-10-7-16-10-14-11-11-11-10-16-8-17-5-15-5-25v-10l5-2h44l1 1 2 24 6 18 6 11 11 12 18 10 13 5 9 2 10 1h13l16-2 16-5 11-6 11-8 8-10 8-14 4-11 2-7v-41l-5-17-5-10-10-13-8-5v-2l-5-2-14-7-14-4-21-3-1-1z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1137,668)"
                                d="m0 0h13l18 3 21 6 20 8 11 7 11 9 12 13 9 14 9 19 5 17 3 24v18l-2 20-4 18-8 19-9 16-11 13-12 10-14 9-15 7-16 5-14 3-11 1h-30l-18-3-33-11-12-7-11-8-12-11-10-13-8-14-9-24-3-16-2-12v-9l4-2h43l2 1 3 25 6 17 6 11 11 12 14 9 13 6 13 2h31l14-2 16-7 12-8 6-5 7-10 3-8v-58l1-12 1-2v-8l-6-15-7-9-10-9-15-7-15-4-19-3-2-1-1-42z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1306,671)"
                                d="m0 0h14l34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 3 2 3 6 14 20 24 34 5 7 2 1-1-9v-164l1-1h46v253l-1 1h-38l-9-1-8-11-16-24-11-16-12-17-2-2-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-9-11-4-7-8-11-4-7z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(436,743)"
                                d="m0 0 3 2-9 11-11 13-12 13-24 28-10 11-9 11-13 14-9 11-12 14-3 4 124 1 1 16v31l-181 1-3-1v-40l4-7 12-14 9-10 9-11 12-13 7-8 12-14 9-10 7-8 12-14 7-8 12-14 7-8z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(999,671)"
                                d="m0 0h5l-2 4-13 13-8 7-11 12h-2v2l-8 7-66 66 2 5 9 11 9 10 11 14 9 10 9 11 12 14 11 14 9 10 9 11 9 10 7 8 10 11v3l-63-1-5-5-7-9-13-16-7-8-12-14-10-13-18-18-3-5-11-13-2-3v-60l8-8 7-8 11-11 3-5h2l2-4 6-6h2l1-3h2l2-4 19-19 7-8 6-7h2v-2l3-2z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1689,788)"
                                d="m0 0h86l44 1 1 5v129h-44l-1-59-8 4-15 11-14 10-19 14-18 13-8 6-5 1-65 1v-2l13-9 16-11 19-14 16-11 18-13 20-14 19-14 11-8 2-4h-68l-1-1v-34z"
                                fill="#030302"
                            />
                            <path
                                transform="translate(1683,668)"
                                d="m0 0h34l22 4 17 5 16 8 11 7 14 14 7 10 8 16 8 22v1h-51l-10-18-11-12-11-7-15-5-17-2h-20l-15 2-13 5-11 6-10 9-9 10-8 15-5 16-3 21-2 2-44-1-1-1 1-15 5-24 5-15 10-19 8-11 9-10 11-9 15-9 16-7 14-4z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(550,918)"
                                d="m0 0 28 7 8 1h37l19-3 17-4 1 63 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48z"
                                fill="#0464B0"
                            />
                            <path
                                transform="translate(776,671)"
                                d="m0 0h47l1 1v250l-1 2-20 1h-16l-12-1v-165z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(274,672)"
                                d="m0 0h177v46l-172 1-5-2z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(1306,732)"
                                d="m0 0 4 4 5 7v2h2l4 9 10 14 9 13 10 14 3 6 1 79 1 43-1 1h-47z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1211,757)"
                                d="m0 0 3 4 4 16 2 18-1 17-3 15-5 13h-1l-1-20v-38l1-12 1-2z"
                                fill="#F59E2E"
                            />
                        </svg>
                    </div>
                    {/* Search + Lien He */}
                    <div className="action__sub__header d-flex align-items-center justify-content-center">
                        <div className="search">
                            <form action="">
                                <div className="my-3">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                    />
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                            </form>
                        </div>
                        <div className="action">
                            <i className="fa-solid fa-headphones-simple"></i>
                            <i className="fa-regular fa-user"></i>
                            <IconCart />
                        </div>
                    </div>
                </div>
                {/* ======HEADER mobile====== */}
                <div className="sub__header__mobile">
                    {/* icons bars */}
                    <label htmlFor="menu-checkbox" className="nav_bars">
                        <i className="fa-solid fa-bars"></i>
                    </label>
                    {/* Logo */}
                    <div className="logo__sub__header__mobile">
                        <svg
                            version="1.1"
                            viewBox="0 0 2048 1448"
                            width="100"
                            height="100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                transform="translate(1197,392)"
                                d="m0 0h24l20 6 16 8 25 14 39 22 23 13 3 4-9-1-16-2h-17l-16 4-25 12-15 8-22 13-14 8-1 3 3 5 31 16 25 15 12 9 16 16 8 13 7 15 4 16v23l-2 18v16l1 4 3 1 34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 2 1-1-10-1-23-1-190-2-15-5-17-7-13-8-10-11-11-1-4 8 4 15 9 17 10 21 12 28 17 16 11 10 8 9 11 9 14 8 20 1 6v58l-4 69v142l3 44 1 14v102l-4 16-8 16-10 14-11 11-14 10-15 9-26 15-56 32-26 15-24 14-84 48-24 14-26 15-23 13-25 15-16 9-14 6-21 5h-20l-14-3-12-4-23-12-17-10-23-13-36-21v-3l11 2h31l18-5 19-9 48-28 23-13 24-14 28-16 26-15 17-10 28-16 26-15 29-17 28-16 26-15 27-16 16-10 11-9 9-9 10-16 6-14 3-10 1-15v-105l-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-11-13-1-3h-2l1 7v27l-1 3v13l4 10 7 11 9 12 9 13 7 10 1 3 1 79 1 43-1 1h-35l-7 2-11 20-9 11-7 7-14 10-17 10-14 8-24 14-26 15-42 24-24 14-19 11-52 30-25 14-17 10-26 15-29 17-21 12-18 10-14 5-27 1-17-1-13-4-16-8-23-13-24-14-22-12-20-11-1-2h9l9 1h26l16-3 18-8 16-9 21-12 19-12 1-2-5-5-15-10-24-13-19-12-11-8-8-7-7-10-8-15-5-16-2-14v-33l1-69 1-195 4-15 5-12 6-10 11-13 11-9 16-10 21-12 52-30 16-9 14-8 24-14 22-13 21-12 23-13 24-14 77-44 26-15 22-13 12-5zm-6 122-11 4-19 11-25 15-23 13-24 14-28 16-15 9-17 10-23 13-26 15-23 13-24 14-14 9-10 8-6 5-9 13-9 20-4 13 1 4 8-6 7-8 6-5 7-8 15-15 7-8 5-6 2-1v-2l3-1 57-1 5-1-7 8-8 8-8 7-7 7-4 5-2 1v2l-4 2-21 21v2l-4 2-46 46 2 5 9 11 9 10 11 14 9 10 9 11 12 14 11 14 9 10 9 11 9 10 7 8 10 11 1 3-12-1-51-1-4-4-7-9-13-16-7-8-12-14-10-13-18-18-1 3 2 10 1 23 1 176 2 5 9 7 8-1 16-8 27-16 28-16 25-15 25-14 48-28 18-10 35-20 9-5 1-3-12-3-16-3-30-10-12-7-11-8-12-11-10-14-7-12-9-24-3-16-2-12v-9l3-1h45v9l3 20 6 15 6 10 11 12 14 9 13 6 13 2h31l14-2 16-7 12-8 7-6 7-10 3-8v-58l1-12 1-2v-8l-6-15-7-9-7-7-10-6-12-5-18-4-15-2v-44l20 2 15 3 20 6 18 7-1-74v-57l-1-29-4-7-6-4zm-366 197v17h1v-17zm606 66 1 2zm35 41m1 1 2 6 5 10 4 2-4-9-4-8z"
                                fill="#F59E2E"
                            />
                            <path
                                transform="translate(977,267)"
                                d="m0 0h24l15 2 11 5 21 11 16 9 27 15 24 14 12 8 1 3-10-1-16-3h-14l-17 3-15 6-17 9-24 14-14 8-27 16-18 10-48 28-42 24-48 28-52 30-28 16-26 15-18 12-11 9-10 14-7 15-5 18-1 9v62l22 12 12 9 9 8 12 16 10 18 6 16 4 18 1 15v14l-1 19-5 21-7 19-9 16-8 10-9 9-14 10-16 9-6 3h-2l1 64 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48l-10-7-16-10-14-11-11-11-10-16-8-17-5-15-5-25v-10l5-2h44l1 1 2 24 6 18 6 11 11 12 5 2-1-4v-317l3-14 6-15 10-16 5-6 10-8 17-11 24-14 18-10 53-31 24-14 28-16 23-13 27-16 18-10 14-8 29-17 24-14 21-12 22-13 18-10 11-5 11-3zm-319 464 1 131 4 1 9-10 8-13 5-11 3-11v-41l-5-17-5-10-10-13-5-4z"
                                fill="#0363B0"
                            />
                            <path
                                transform="translate(1393,483)"
                                d="m0 0 8 4 15 9 17 10 21 12 28 17 16 11 10 8 9 11 9 14 8 20 1 6v58l-4 69v142l3 44 1 14v102l-4 16-8 16-10 14-11 11-14 10-15 9-26 15-56 32-26 15-24 14-84 48-24 14-26 15-23 13-25 15-16 9-14 6-21 5h-20l-14-3-12-4-23-12-17-10-23-13-36-21v-3l11 2h31l18-5 19-9 48-28 23-13 24-14 28-16 26-15 17-10 28-16 26-15 29-17 28-16 26-15 27-16 16-10 11-9 9-9 10-16 6-14 3-10 1-15v-105l-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-9-11-4-7-8-11-4-7 1-1h14l34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 2 1-1-10-1-23-1-190-2-15-5-17-7-13-8-10-11-11zm38 294 1 2zm35 41m1 1 2 6 5 10 4 2-4-9-4-8z"
                                fill="#0464B0"
                            />
                            <path
                                transform="translate(604,668)"
                                d="m0 0h11l22 3 24 6 21 11 12 9 9 8 12 16 10 18 6 16 4 18 1 15v14l-1 19-5 21-7 19-9 16-8 10-9 9-14 10-16 9-6 3h-2l1 64 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48l-10-7-16-10-14-11-11-11-10-16-8-17-5-15-5-25v-10l5-2h44l1 1 2 24 6 18 6 11 11 12 18 10 13 5 9 2 10 1h13l16-2 16-5 11-6 11-8 8-10 8-14 4-11 2-7v-41l-5-17-5-10-10-13-8-5v-2l-5-2-14-7-14-4-21-3-1-1z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1137,668)"
                                d="m0 0h13l18 3 21 6 20 8 11 7 11 9 12 13 9 14 9 19 5 17 3 24v18l-2 20-4 18-8 19-9 16-11 13-12 10-14 9-15 7-16 5-14 3-11 1h-30l-18-3-33-11-12-7-11-8-12-11-10-13-8-14-9-24-3-16-2-12v-9l4-2h43l2 1 3 25 6 17 6 11 11 12 14 9 13 6 13 2h31l14-2 16-7 12-8 6-5 7-10 3-8v-58l1-12 1-2v-8l-6-15-7-9-10-9-15-7-15-4-19-3-2-1-1-42z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1306,671)"
                                d="m0 0h14l34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 3 2 3 6 14 20 24 34 5 7 2 1-1-9v-164l1-1h46v253l-1 1h-38l-9-1-8-11-16-24-11-16-12-17-2-2-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-9-11-4-7-8-11-4-7z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(436,743)"
                                d="m0 0 3 2-9 11-11 13-12 13-24 28-10 11-9 11-13 14-9 11-12 14-3 4 124 1 1 16v31l-181 1-3-1v-40l4-7 12-14 9-10 9-11 12-13 7-8 12-14 9-10 7-8 12-14 7-8 12-14 7-8z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(999,671)"
                                d="m0 0h5l-2 4-13 13-8 7-11 12h-2v2l-8 7-66 66 2 5 9 11 9 10 11 14 9 10 9 11 12 14 11 14 9 10 9 11 9 10 7 8 10 11v3l-63-1-5-5-7-9-13-16-7-8-12-14-10-13-18-18-3-5-11-13-2-3v-60l8-8 7-8 11-11 3-5h2l2-4 6-6h2l1-3h2l2-4 19-19 7-8 6-7h2v-2l3-2z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1689,788)"
                                d="m0 0h86l44 1 1 5v129h-44l-1-59-8 4-15 11-14 10-19 14-18 13-8 6-5 1-65 1v-2l13-9 16-11 19-14 16-11 18-13 20-14 19-14 11-8 2-4h-68l-1-1v-34z"
                                fill="#030302"
                            />
                            <path
                                transform="translate(1683,668)"
                                d="m0 0h34l22 4 17 5 16 8 11 7 14 14 7 10 8 16 8 22v1h-51l-10-18-11-12-11-7-15-5-17-2h-20l-15 2-13 5-11 6-10 9-9 10-8 15-5 16-3 21-2 2-44-1-1-1 1-15 5-24 5-15 10-19 8-11 9-10 11-9 15-9 16-7 14-4z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(550,918)"
                                d="m0 0 28 7 8 1h37l19-3 17-4 1 63 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48z"
                                fill="#0464B0"
                            />
                            <path
                                transform="translate(776,671)"
                                d="m0 0h47l1 1v250l-1 2-20 1h-16l-12-1v-165z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(274,672)"
                                d="m0 0h177v46l-172 1-5-2z"
                                fill="#010101"
                            />
                            <path
                                transform="translate(1306,732)"
                                d="m0 0 4 4 5 7v2h2l4 9 10 14 9 13 10 14 3 6 1 79 1 43-1 1h-47z"
                                fill="#020201"
                            />
                            <path
                                transform="translate(1211,757)"
                                d="m0 0 3 4 4 16 2 18-1 17-3 15-5 13h-1l-1-20v-38l1-12 1-2z"
                                fill="#F59E2E"
                            />
                        </svg>
                    </div>
                    {/* Search + Lien He */}
                    <div className="action__sub__header__mobile d-flex align-items-center justify-content-center">
                        <div className="search">
                            <form action="">
                                <div className="my-3">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                    />
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                            </form>
                        </div>
                        <div className="action">
                            <IconCart />
                        </div>
                    </div>
                </div>
                <div className="bars__column__mobile">
                    {/* checkbox */}
                    <input
                        type="checkbox"
                        id="menu-checkbox"
                        className="menu-checkbox"
                        hidden
                    />
                    {/* overlay */}
                    <label
                        htmlFor="menu-checkbox"
                        className="overlay__mobile"
                    ></label>
                    {/* Menu content */}
                    <div className="menu-drawer">
                        {/* Logo */}
                        <div className="logo">
                            <svg
                                version="1.1"
                                viewBox="0 0 2048 1448"
                                width="100"
                                height="100"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    transform="translate(1197,392)"
                                    d="m0 0h24l20 6 16 8 25 14 39 22 23 13 3 4-9-1-16-2h-17l-16 4-25 12-15 8-22 13-14 8-1 3 3 5 31 16 25 15 12 9 16 16 8 13 7 15 4 16v23l-2 18v16l1 4 3 1 34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 2 1-1-10-1-23-1-190-2-15-5-17-7-13-8-10-11-11-1-4 8 4 15 9 17 10 21 12 28 17 16 11 10 8 9 11 9 14 8 20 1 6v58l-4 69v142l3 44 1 14v102l-4 16-8 16-10 14-11 11-14 10-15 9-26 15-56 32-26 15-24 14-84 48-24 14-26 15-23 13-25 15-16 9-14 6-21 5h-20l-14-3-12-4-23-12-17-10-23-13-36-21v-3l11 2h31l18-5 19-9 48-28 23-13 24-14 28-16 26-15 17-10 28-16 26-15 29-17 28-16 26-15 27-16 16-10 11-9 9-9 10-16 6-14 3-10 1-15v-105l-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-11-13-1-3h-2l1 7v27l-1 3v13l4 10 7 11 9 12 9 13 7 10 1 3 1 79 1 43-1 1h-35l-7 2-11 20-9 11-7 7-14 10-17 10-14 8-24 14-26 15-42 24-24 14-19 11-52 30-25 14-17 10-26 15-29 17-21 12-18 10-14 5-27 1-17-1-13-4-16-8-23-13-24-14-22-12-20-11-1-2h9l9 1h26l16-3 18-8 16-9 21-12 19-12 1-2-5-5-15-10-24-13-19-12-11-8-8-7-7-10-8-15-5-16-2-14v-33l1-69 1-195 4-15 5-12 6-10 11-13 11-9 16-10 21-12 52-30 16-9 14-8 24-14 22-13 21-12 23-13 24-14 77-44 26-15 22-13 12-5zm-6 122-11 4-19 11-25 15-23 13-24 14-28 16-15 9-17 10-23 13-26 15-23 13-24 14-14 9-10 8-6 5-9 13-9 20-4 13 1 4 8-6 7-8 6-5 7-8 15-15 7-8 5-6 2-1v-2l3-1 57-1 5-1-7 8-8 8-8 7-7 7-4 5-2 1v2l-4 2-21 21v2l-4 2-46 46 2 5 9 11 9 10 11 14 9 10 9 11 12 14 11 14 9 10 9 11 9 10 7 8 10 11 1 3-12-1-51-1-4-4-7-9-13-16-7-8-12-14-10-13-18-18-1 3 2 10 1 23 1 176 2 5 9 7 8-1 16-8 27-16 28-16 25-15 25-14 48-28 18-10 35-20 9-5 1-3-12-3-16-3-30-10-12-7-11-8-12-11-10-14-7-12-9-24-3-16-2-12v-9l3-1h45v9l3 20 6 15 6 10 11 12 14 9 13 6 13 2h31l14-2 16-7 12-8 7-6 7-10 3-8v-58l1-12 1-2v-8l-6-15-7-9-7-7-10-6-12-5-18-4-15-2v-44l20 2 15 3 20 6 18 7-1-74v-57l-1-29-4-7-6-4zm-366 197v17h1v-17zm606 66 1 2zm35 41m1 1 2 6 5 10 4 2-4-9-4-8z"
                                    fill="#F59E2E"
                                />
                                <path
                                    transform="translate(977,267)"
                                    d="m0 0h24l15 2 11 5 21 11 16 9 27 15 24 14 12 8 1 3-10-1-16-3h-14l-17 3-15 6-17 9-24 14-14 8-27 16-18 10-48 28-42 24-48 28-52 30-28 16-26 15-18 12-11 9-10 14-7 15-5 18-1 9v62l22 12 12 9 9 8 12 16 10 18 6 16 4 18 1 15v14l-1 19-5 21-7 19-9 16-8 10-9 9-14 10-16 9-6 3h-2l1 64 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48l-10-7-16-10-14-11-11-11-10-16-8-17-5-15-5-25v-10l5-2h44l1 1 2 24 6 18 6 11 11 12 5 2-1-4v-317l3-14 6-15 10-16 5-6 10-8 17-11 24-14 18-10 53-31 24-14 28-16 23-13 27-16 18-10 14-8 29-17 24-14 21-12 22-13 18-10 11-5 11-3zm-319 464 1 131 4 1 9-10 8-13 5-11 3-11v-41l-5-17-5-10-10-13-5-4z"
                                    fill="#0363B0"
                                />
                                <path
                                    transform="translate(1393,483)"
                                    d="m0 0 8 4 15 9 17 10 21 12 28 17 16 11 10 8 9 11 9 14 8 20 1 6v58l-4 69v142l3 44 1 14v102l-4 16-8 16-10 14-11 11-14 10-15 9-26 15-56 32-26 15-24 14-84 48-24 14-26 15-23 13-25 15-16 9-14 6-21 5h-20l-14-3-12-4-23-12-17-10-23-13-36-21v-3l11 2h31l18-5 19-9 48-28 23-13 24-14 28-16 26-15 17-10 28-16 26-15 29-17 28-16 26-15 27-16 16-10 11-9 9-9 10-16 6-14 3-10 1-15v-105l-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-9-11-4-7-8-11-4-7 1-1h14l34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 2 1-1-10-1-23-1-190-2-15-5-17-7-13-8-10-11-11zm38 294 1 2zm35 41m1 1 2 6 5 10 4 2-4-9-4-8z"
                                    fill="#0464B0"
                                />
                                <path
                                    transform="translate(604,668)"
                                    d="m0 0h11l22 3 24 6 21 11 12 9 9 8 12 16 10 18 6 16 4 18 1 15v14l-1 19-5 21-7 19-9 16-8 10-9 9-14 10-16 9-6 3h-2l1 64 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48l-10-7-16-10-14-11-11-11-10-16-8-17-5-15-5-25v-10l5-2h44l1 1 2 24 6 18 6 11 11 12 18 10 13 5 9 2 10 1h13l16-2 16-5 11-6 11-8 8-10 8-14 4-11 2-7v-41l-5-17-5-10-10-13-8-5v-2l-5-2-14-7-14-4-21-3-1-1z"
                                    fill="#020201"
                                />
                                <path
                                    transform="translate(1137,668)"
                                    d="m0 0h13l18 3 21 6 20 8 11 7 11 9 12 13 9 14 9 19 5 17 3 24v18l-2 20-4 18-8 19-9 16-11 13-12 10-14 9-15 7-16 5-14 3-11 1h-30l-18-3-33-11-12-7-11-8-12-11-10-13-8-14-9-24-3-16-2-12v-9l4-2h43l2 1 3 25 6 17 6 11 11 12 14 9 13 6 13 2h31l14-2 16-7 12-8 6-5 7-10 3-8v-58l1-12 1-2v-8l-6-15-7-9-10-9-15-7-15-4-19-3-2-1-1-42z"
                                    fill="#020201"
                                />
                                <path
                                    transform="translate(1306,671)"
                                    d="m0 0h14l34 1 6 7 12 17 13 18 10 15 14 20 10 14 9 12 3 2 3 6 14 20 24 34 5 7 2 1-1-9v-164l1-1h46v253l-1 1h-38l-9-1-8-11-16-24-11-16-12-17-2-2-3-8-11-16-10-15-19-28-11-16-10-14-25-37-9-12-9-11-4-7-8-11-4-7z"
                                    fill="#010101"
                                />
                                <path
                                    transform="translate(436,743)"
                                    d="m0 0 3 2-9 11-11 13-12 13-24 28-10 11-9 11-13 14-9 11-12 14-3 4 124 1 1 16v31l-181 1-3-1v-40l4-7 12-14 9-10 9-11 12-13 7-8 12-14 9-10 7-8 12-14 7-8 12-14 7-8z"
                                    fill="#010101"
                                />
                                <path
                                    transform="translate(999,671)"
                                    d="m0 0h5l-2 4-13 13-8 7-11 12h-2v2l-8 7-66 66 2 5 9 11 9 10 11 14 9 10 9 11 12 14 11 14 9 10 9 11 9 10 7 8 10 11v3l-63-1-5-5-7-9-13-16-7-8-12-14-10-13-18-18-3-5-11-13-2-3v-60l8-8 7-8 11-11 3-5h2l2-4 6-6h2l1-3h2l2-4 19-19 7-8 6-7h2v-2l3-2z"
                                    fill="#020201"
                                />
                                <path
                                    transform="translate(1689,788)"
                                    d="m0 0h86l44 1 1 5v129h-44l-1-59-8 4-15 11-14 10-19 14-18 13-8 6-5 1-65 1v-2l13-9 16-11 19-14 16-11 18-13 20-14 19-14 11-8 2-4h-68l-1-1v-34z"
                                    fill="#030302"
                                />
                                <path
                                    transform="translate(1683,668)"
                                    d="m0 0h34l22 4 17 5 16 8 11 7 14 14 7 10 8 16 8 22v1h-51l-10-18-11-12-11-7-15-5-17-2h-20l-15 2-13 5-11 6-10 9-9 10-8 15-5 16-3 21-2 2-44-1-1-1 1-15 5-24 5-15 10-19 8-11 9-10 11-9 15-9 16-7 14-4z"
                                    fill="#020201"
                                />
                                <path
                                    transform="translate(550,918)"
                                    d="m0 0 28 7 8 1h37l19-3 17-4 1 63 1 34 3 24 5 16 7 14 9 10 6 8 1 3-3 1-16-10-28-17-29-17-17-10-12-9-14-14-8-11-8-16-4-12-1-7v-48z"
                                    fill="#0464B0"
                                />
                                <path
                                    transform="translate(776,671)"
                                    d="m0 0h47l1 1v250l-1 2-20 1h-16l-12-1v-165z"
                                    fill="#010101"
                                />
                                <path
                                    transform="translate(274,672)"
                                    d="m0 0h177v46l-172 1-5-2z"
                                    fill="#010101"
                                />
                                <path
                                    transform="translate(1306,732)"
                                    d="m0 0 4 4 5 7v2h2l4 9 10 14 9 13 10 14 3 6 1 79 1 43-1 1h-47z"
                                    fill="#020201"
                                />
                                <path
                                    transform="translate(1211,757)"
                                    d="m0 0 3 4 4 16 2 18-1 17-3 15-5 13h-1l-1-20v-38l1-12 1-2z"
                                    fill="#F59E2E"
                                />
                            </svg>
                        </div>
                        {/* Action btn */}
                        <div className="btn btn-dark btn__login ">
                            Đăng Nhập
                        </div>
                        <hr />
                        <div className="Category__sub__header__mobile">
                            {category.map((cate) => (
                                <p>{cate.title}</p>
                            ))}
                            <p>Blog</p>
                            <p>Về Chúng Tôi</p>
                        </div>
                        <div className="contact__sub__header__mobile">
                            <p>Liên Hệ:</p>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
