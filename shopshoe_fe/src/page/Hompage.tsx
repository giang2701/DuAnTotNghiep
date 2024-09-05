import React, { useContext } from "react";
import { ProductContext, ProductContextType } from "../context/ProductContext";
import { Link } from "react-router-dom";

type Props = {};

const Hompage = (props: Props) => {
    const { state } = useContext(ProductContext) as ProductContextType;
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };
    return (
        <>
            {/* sm (Small devices, ≥576px)
                md (Medium devices, ≥768px)
                lg (Large devices, ≥992px)
                xl (Extra large devices, ≥1200px)
                xxl (Extra extra large devices, ≥1400px) 
            */}
            <div className="container">
                <div className="row">
                    {state.products.map((item) => (
                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6">
                            <div className="card">
                                <img src={`${item.images}`} alt="" />
                                <div className="card-header">
                                    <h4>{item.title}</h4>
                                    <p>{formatPrice(item.price)}</p>
                                </div>
                                <Link
                                    to={`/detail/${item._id}`}
                                    className="btn btn-primary"
                                >
                                    Detail
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Hompage;
