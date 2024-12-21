import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import instance from "../../../api";
import { BrandContext, BrandContextType } from "../../../context/Brand";
import { Brand } from "../../../interface/Brand";
import { joiResolver } from "@hookform/resolvers/joi";
import { brandValidate } from "../../../validate/Brand";

const BrandForm = () => {
    const { id } = useParams();
    const { handleBrand } = useContext(BrandContext) as BrandContextType;
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<Brand>(
        { resolver: joiResolver(brandValidate), }
    );
    useEffect(() => {
        if (id) {
            (async () => {
                const { data } = await instance.get(`/brand/${id}`);
                reset(data.data);
            })();
        }
    }, [id, reset]);

    return (
        <div className="container">
            <h1 className="my-3">{id ? "Brand Edit" : "Brand Add"}</h1>
            <form
                onSubmit={handleSubmit((data) =>
                    handleBrand({ ...data, _id: id })
                )}
            >
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("title", { required: true })}
                    />
                    {errors.title && (
                        <span className="text-danger">
                            {errors.title.message}
                        </span>
                    )}
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BrandForm;
