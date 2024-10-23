import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import instance from "../../../api";
import {
    CategoryContext,
    CategoryContextType,
} from "../../../context/CategoryContext";
import { Category } from "../../../interface/Category";

const CategoryForm = () => {
    const { id } = useParams();
    const { handleCategory } = useContext(
        CategoryContext
    ) as CategoryContextType;
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<Category>({});

    useEffect(() => {
        if (id) {
            (async () => {
                const { data } = await instance.get(`/categorys/${id}`);
                reset(data.data);
            })();
        }
    }, [id, reset]);

    return (
        <div className="container">
            <h1 className="my-3">{id ? "Category Edit" : "Category Add"}</h1>
            <form
                onSubmit={handleSubmit((data) =>
                    handleCategory({ ...data, _id: id })
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

export default CategoryForm;
