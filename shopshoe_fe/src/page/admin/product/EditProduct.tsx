import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { Product } from "../../../interface/Products";

type Props = {
    onsubmit: (data: Product) => void;
};

const EditProduct = ({ onsubmit }: Props) => {
    const { id } = useParams();
    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors },
    } = useForm<Product>({
        defaultValues: {
            sizeStock: [
                { size: 34, stock: 0 },
                { size: 35, stock: 0 },
                { size: 36, stock: 0 },
                { size: 37, stock: 0 },
                { size: 38, stock: 0 },
                { size: 39, stock: 0 },
                { size: 40, stock: 0 },
                { size: 41, stock: 0 },
                { size: 42, stock: 0 },
                { size: 43, stock: 0 },
                { size: 44, stock: 0 },
                { size: 45, stock: 0 },
            ],
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "sizeStock",
    });

    return (
        <div className="container">
            <h1 className="text-center">Product Edit Giang</h1>
            <form
                onSubmit={handleSubmit((data) =>
                    onsubmit({ ...data, _id: id })
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
                        <span className="text-danger">Title is required</span>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="brand" className="form-label">
                        Brand
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("brand", { required: true })}
                    />
                    {errors.brand && (
                        <span className="text-danger">Brand is required</span>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                        Price
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        {...register("price", { required: true })}
                    />
                    {errors.price && (
                        <span className="text-danger">Price is required</span>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("description")}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="images" className="form-label">
                        Images
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("images")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Size Stock</label>
                    <div className="d-flex flex-wrap flex-shrink-1">
                        {fields.map((item, index) => (
                            <div
                                key={item.id}
                                className="mb-2 w-25 d-flex align-items-center"
                            >
                                <label
                                    htmlFor={`sizeStock.${index}.size`}
                                    className="form-label me-3"
                                >
                                    Size {item.size}
                                </label>
                                <input
                                    type="number"
                                    className="form-control w-25"
                                    defaultValue={item.stock}
                                    {...register(
                                        `sizeStock.${index}.stock` as const,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </div>
                        ))}
                    </div>
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

export default EditProduct;
