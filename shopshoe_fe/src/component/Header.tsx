import React, { useContext, useEffect, useState } from "react";
import {
    CategoryContext,
    CategoryContextType,
} from "../context/CategoryContext";
import { Category } from "../interface/Category";
import instance from "../api";

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
            <div className="header">
                {/* <div className="first"></div> */}
                <div className="row">
                    <div className="col-md-4 d-flex align-items-center justify-content-evenly">
                        {/* <p>Nam</p>
                        <p>Nữ</p> */}
                        {category.map((cate) => (
                            <p>{cate.title}</p>
                        ))}
                        <p>Blog</p>
                        <p>Về Chúng Tôi</p>
                    </div>
                    <div className="col-md-4">
                        <img
                            src="../../public/images/logo.png"
                            alt=""
                            width={"150px"}
                        />
                    </div>
                    <div className="col-md-4">
                        <div className="box__search">
                            <form action="">
                                <div className="my-3">
                                    <input
                                        type="text"
                                        className=" w-50 search"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
