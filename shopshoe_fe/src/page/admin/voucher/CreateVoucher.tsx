import React from "react";
import { useForm } from "react-hook-form";
import { Voucher } from "../../../interface/Voucher";
import { useVoucher } from "../../../context/Voucher";

type Props = {};

const CreateVoucher = (props: Props) => {
    const { handleVoucher } = useVoucher();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Voucher>();

    return (
        <>
            <div className="container">
                <h1
                    className="mt-2"
                    style={{ display: "inline-block", fontFamily: "serif" }}
                >
                    Voucher
                </h1>
                <span style={{ marginLeft: "5px", fontFamily: "serif" }}>
                    Tạo Mới
                </span>
                <form onSubmit={handleSubmit(handleVoucher)}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name Voucher
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            {...register("name")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="code" className="form-label">
                            Code Voucher
                        </label>
                        <input
                            type="text"
                            id="code"
                            className="form-control"
                            {...register("code")}
                            style={{ textTransform: "uppercase" }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="discount" className="form-label">
                            Discount Voucher(giảm theo% hoặc tiền)
                        </label>
                        <input
                            type="number"
                            id="discount"
                            className="form-control"
                            {...register("discount")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">
                            Discount Type
                        </label>
                        <div className="form-floating w-75">
                            <select
                                {...register("type")}
                                id="type"
                                className="form-select w-25"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Open this select menu
                                </option>
                                <option value="percent">Giảm theo %</option>
                                <option value="fixed">Giảm theo tiền</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="expiryDate" className="form-label">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            id="expiryDate"
                            className="form-control"
                            {...register("expiryDate")}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateVoucher;
