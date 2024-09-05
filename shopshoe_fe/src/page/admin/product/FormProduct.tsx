import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Product } from "../../../interface/Products";
import instance from "../../../api";
import {
    ProductContext,
    ProductContextType,
} from "../../../context/ProductContext";
import { Category } from "../../../interface/Category";

const FormProduct = () => {
    const { id } = useParams();
    const { handleProduct } = useContext(ProductContext) as ProductContextType;
    const [categories, setCategories] = useState<Category[]>([]);
    const [formattedPrice, setFormattedPrice] = useState<string>("");
    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors },
    } = useForm<Product>({
        defaultValues: {
            category: {} as Category,
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
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setFormattedPrice(formatPrice(value));
    };
    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const { data } = await instance.get(`/products/${id}`);
                    const existingData = data.data;
                    const defaultStock = Array.from({ length: 12 }, (_, i) => ({
                        size: 34 + i,
                        stock: 0,
                    }));

                    const updatedSizeStock = defaultStock.map((sizeObj) => {
                        const existingStock = existingData.sizeStock.find(
                            (item: any) => item.size === sizeObj.size
                        );
                        return existingStock || sizeObj;
                    });

                    reset({
                        ...existingData,
                        sizeStock: updatedSizeStock,
                        category: existingData.category?._id || "",
                    });

                    if (existingData.price) {
                        setFormattedPrice(formatPrice(existingData.price));
                    }
                } catch (error) {
                    console.error("Error fetching product data:", error);
                }
            })();
        }
    }, [id, reset]);
    // Danh muc
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/categorys`);
            console.log(data);
            setCategories(data.data);
        })();
    }, []);
    return (
        <div className="container">
            <h1 className="text-center">
                {id ? "Product Edit" : "Product Add"}
            </h1>
            <form
                onSubmit={handleSubmit((data) =>
                    handleProduct({ ...data, _id: id })
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
                        onChange={handlePriceChange}
                    />
                    {errors.price && (
                        <span className="text-danger">Price is required</span>
                    )}
                    <div>{formattedPrice}</div>
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
                    <label htmlFor="" className="form-label">
                        Category
                    </label>
                    <select {...register("category")} className="form-control">
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
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

export default FormProduct;
