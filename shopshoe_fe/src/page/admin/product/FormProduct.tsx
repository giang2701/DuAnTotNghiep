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
import RichTextEditor from "../../../component/RichTextEditor";
import axios from "axios";

const FormProduct = () => {
    const { id } = useParams();
    const { handleProduct } = useContext(ProductContext) as ProductContextType;
    const [categories, setCategories] = useState<Category[]>([]);
    const [formattedPrice, setFormattedPrice] = useState<string>("");
    const [description, setDescription] = useState("");

    const [imgURL, setImgURL] = useState<string | null>(null);
    const [imgCategoryURLs, setImgCategoryURLs] = useState<string[]>([]);

    const {
        handleSubmit,
        register,
        reset,
        control,
        setValue,
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

    const uploadFile = async (file: File) => {
        const CLOUD_NAME = "dq3lk241i";
        const PRESET_NAME = "datn_upload";
        const FOLDER_NAME = "datn";
        const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const formData = new FormData();
        formData.append("upload_preset", PRESET_NAME);
        formData.append("folder", FOLDER_NAME);
        formData.append("file", file);

        const response = await axios.post(api, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.secure_url;
    };

    const handleImgChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const url = await uploadFile(files[0]);
            setImgURL(url);
        }
    };

    const handleImgCategoryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const urls = await Promise.all(Array.from(files).map(uploadFile));
            setImgCategoryURLs(urls);
        }
    };

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const { data } = await instance.get(`/products/${id}`);
                    const existingData = data.data;

                    if (existingData.images) {
                        setImgURL(existingData.images);
                    }

                    if (
                        existingData.imgCategory &&
                        existingData.imgCategory.length > 0
                    ) {
                        setImgCategoryURLs(existingData.imgCategory);
                    }

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

                    setValue("description", existingData.description);
                    setDescription(existingData.description);
                } catch (error) {
                    console.error("Error fetching product data:", error);
                }
            })();
        }
    }, [id, reset, setValue]);

    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/categorys`);
            setCategories(data.data);
        })();
    }, []);

    return (
        <div className="container">
            <h1>{id ? "Product Edit" : "Product Add"}</h1>
            <form
                onSubmit={handleSubmit((data: Product) => {
                    const updatedData = {
                        ...data,
                        _id: id,
                        images: imgURL || data?.images,
                        imgCategory: imgCategoryURLs,
                    };
                    console.log("Dữ liệu gửi lên:", updatedData);

                    handleProduct(updatedData);
                })}
            >
                <div className="form-group">
                    <label>Title</label>
                    <input
                        {...register("title", { required: true })}
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    />
                    {errors.title && <div className="invalid-feedback">Title is required</div>}
                </div>

                <div className="form-group">
                    <label>Brand</label>
                    <input
                        {...register("brand", { required: true })}
                        className={`form-control ${errors.brand ? "is-invalid" : ""}`}
                    />
                    {errors.brand && <div className="invalid-feedback">Brand is required</div>}
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        {...register("price", { required: true })}
                        type="number"
                        className={`form-control ${errors.price ? "is-invalid" : ""}`}
                        onChange={handlePriceChange}
                    />
                    {errors.price && <div className="invalid-feedback">Price is required</div>}
                    <div>{formattedPrice}</div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <RichTextEditor
                        value={description}
                        onChange={(value: any) => {
                            setDescription(value);
                            setValue("description", value);
                        }}
                    />
                    {errors.description && (
                        <div className="text-danger">Description is required</div>
                    )}
                </div>

                <div className="form-group">
                    <label>Product Image</label>
                    <input
                        type="file"
                        onChange={handleImgChange}
                        className={`form-control ${errors.images ? "is-invalid" : ""}`}
                    />
                    {imgURL && (
                        <div>
                            <img src={imgURL} alt="Uploaded Product" width="100" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Category Images</label>
                    <input
                        type="file"
                        onChange={handleImgCategoryChange}
                        multiple
                        className={`form-control ${errors.imgCategory ? "is-invalid" : ""}`}
                    />
                    {imgCategoryURLs.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {imgCategoryURLs.map((img, index) => (
                                <img key={index} src={img} alt={`Category ${index}`} width="80" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select {...register("category")} className="form-control">
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <h6>Size Stock</h6>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                        {fields.map((item, index) => (
                            <div key={item.id} style={{ flexBasis: "120px" }}>
                                <label>{`Size ${item.size}`}</label>
                                <input
                                    {...register(`sizeStock.${index}.stock` as const, {
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: "20px" }}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default FormProduct;
