import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import instance from "../../../api";
import RichTextEditor from "../../../component/RichTextEditor";
import {
    ProductContext,
    ProductContextType,
} from "../../../context/ProductContext";
import { Category } from "../../../interface/Category";
import { Product } from "../../../interface/Products";
import { Size } from "../../../interface/Size";
import { Brand } from "../../../interface/Brand";

const FormProduct = () => {
    const { id } = useParams();
    const { handleProduct } = useContext(ProductContext) as ProductContextType;
    const [categories, setCategories] = useState<Category[]>([]);
    const [brand, setBrand] = useState<Brand[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
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
        },
    });
    // Price
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
    // -----
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

    const handleImgChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const url = await uploadFile(files[0]);
            setImgURL(url);
        }
    };
    const handleImgCategoryChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files) {
            const urls = await Promise.all(Array.from(files).map(uploadFile));
            setImgCategoryURLs(urls);
        }
    };
    // size
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sizeStock", // Tên trường quản lý danh sách size
    });
    // đổ dữ liệu khi edit
    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const { data } = await instance.get(`/products/${id}`);
                    const existingData = data.data;
                    // images
                    if (existingData.images) {
                        setImgURL(existingData.images);
                    }
                    if (
                        existingData.imgCategory &&
                        existingData.imgCategory.length > 0
                    ) {
                        setImgCategoryURLs(existingData.imgCategory);
                    }
                    // Đảm bảo sizeStock được định dạng đúng
                    const updatedSizeStock = existingData.sizeStock.map(
                        (item: any) => ({
                            size: { _id: item.size }, // Giả sử item.size là _id từ bảng Size
                            stock: item.stock,
                            price: item.price,
                        })
                    );
                    console.log("Existing Data:", existingData);
                    console.log("Updated Size Stock:", updatedSizeStock);

                    reset({
                        ...existingData,
                        sizeStock: updatedSizeStock, // Cập nhật sizeStock với dữ liệu mới
                        category: existingData.category?._id || "",
                        brand: existingData.brand?._id || "",
                    });
                    setValue("description", existingData.description);
                    setDescription(existingData.description);
                } catch (error) {
                    console.error("Error fetching product data:", error);
                }
            })();
        }
    }, [id, reset, setValue]);
    // đổ dữ liệu khi cate vào form
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/categorys`);
            setCategories(data.data);
        })();
    }, []);
    // đổ dữ liệu khi brand vào form
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/brand`);
            setBrand(data.data);
        })();
    }, []);
    // đổ dữ liệu khi cate vào form
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/size`);
            setSizes(data.data);
        })();
    }, []);
    // console.log(sizes);

    return (
        <div className="container">
            <h1
                className="mt-2"
                style={{ display: "inline-block", fontFamily: "serif" }}
            >
                Sản Phẩm
            </h1>
            <span style={{ marginLeft: "5px", fontFamily: "serif" }}>
                {id ? "Chỉnh Sửa" : "Tạo Mới"}
            </span>
            <div className="information_productsForm mt-2">
                <form
                    onSubmit={handleSubmit((data: Product) => {
                        const updatedData = {
                            ...data,
                            _id: id,
                            images: imgURL || data?.images,
                            imgCategory: imgCategoryURLs,
                            sizeStock: data?.sizeStock,
                        };
                        console.log("Dữ liệu gửi lên:", updatedData);

                        handleProduct(updatedData);
                    })}
                >
                    <div className="row d-flex">
                        <div className="col-6">
                            {" "}
                            {/* Title */}
                            <div className="form-group mb-2">
                                <label className="form-label">Title</label>
                                <input
                                    {...register("title", { required: true })}
                                    className={`form-control ${
                                        errors.title ? "is-invalid" : ""
                                    }`}
                                />
                                {errors.title && (
                                    <div className="invalid-feedback">
                                        Title is required
                                    </div>
                                )}
                            </div>
                            {/* Brand */}
                            <div className="form-group mb-2">
                                <label className="form-label">Brand</label>
                                <select
                                    {...register("brand")}
                                    className="form-control "
                                >
                                    <option selected>-- Select Brand --</option>
                                    {brand.map((brand) => (
                                        <option
                                            key={brand._id}
                                            value={brand._id}
                                        >
                                            {brand.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.brand && (
                                    <div className="invalid-feedback">
                                        Brand is required
                                    </div>
                                )}
                            </div>
                            {/* price */}
                            <div className="form-group mb-2">
                                <label className="form-label">Price</label>
                                <input
                                    {...register("price", { required: true })}
                                    className={`form-control ${
                                        errors.price ? "is-invalid" : ""
                                    }`}
                                    onChange={handlePriceChange}
                                />
                                <p className="fs-5 text-danger fw-medium">
                                    {formattedPrice}
                                </p>
                                {errors.price && (
                                    <div className="invalid-feedback">
                                        price is required
                                    </div>
                                )}
                            </div>
                            {/* Description */}
                            <div
                                className="form-group mb-2 "
                                style={{ width: "500px" }}
                            >
                                <label className="form-label">
                                    Description
                                </label>
                                <RichTextEditor
                                    value={description}
                                    onChange={(value: any) => {
                                        setDescription(value);
                                        setValue("description", value);
                                    }}
                                />
                                {errors.description && (
                                    <div className="text-danger">
                                        Description is required
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-6">
                            {/* images */}
                            <div className="form-group mb-2">
                                <label className="form-label">
                                    Ảnh Sản Phẩm
                                </label>

                                <div className="custom-file-upload">
                                    <input
                                        type="file"
                                        onChange={handleImgChange}
                                        className={`file-input ${
                                            errors.images ? "is-invalid" : ""
                                        }`}
                                    />
                                    {imgURL ? (
                                        <img
                                            src={imgURL}
                                            alt="Uploaded Product"
                                            className="uploaded-img"
                                        />
                                    ) : (
                                        <span className="upload-placeholder">
                                            +
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* images category*/}
                            <div className="form-group mb-2">
                                <label className="form-label">Nhóm Ảnh</label>
                                <div className="custom-multiple-upload">
                                    <input
                                        type="file"
                                        onChange={handleImgCategoryChange}
                                        multiple
                                        className={`file-input ${
                                            errors.imgCategory
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                    />
                                    {imgCategoryURLs.length === 0 && (
                                        <span className="upload-placeholder">
                                            Chọn ảnh
                                        </span>
                                    )}
                                    <div className="images-preview">
                                        {imgCategoryURLs.map((img, index) => (
                                            <div
                                                key={index}
                                                className="image-container"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Category ${index}`}
                                                    className="preview-img"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* category */}
                            <div className="form-group mb-2">
                                <label className="form-label">Category</label>
                                <select
                                    {...register("category")}
                                    className="form-control "
                                >
                                    <option selected>
                                        -- Select Category --
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* size */}
                            <div>
                                <label htmlFor="size" className="form-label">
                                    Size
                                </label>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="size-stock-row d-flex mb-2"
                                    >
                                        <select
                                            {...register(
                                                `sizeStock.${index}.size._id`
                                            )}
                                            style={{
                                                width: "100px",
                                                height: "25px",
                                            }}
                                        >
                                            {/* Đổ danh sách size từ API */}
                                            {sizes.map((size) => (
                                                <option
                                                    key={size._id}
                                                    value={size._id ?? ""} // add a default value of an empty string if size._id is null or undefined
                                                    className="form-control"
                                                >
                                                    {size.nameSize}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            {...register(
                                                `sizeStock.${index}.stock`
                                            )}
                                            placeholder="Số lượng"
                                            style={{
                                                width: "100px",
                                                height: "25px",
                                            }}
                                            min={0}
                                        />

                                        <input
                                            type="number"
                                            {...register(
                                                `sizeStock.${index}.price`
                                            )}
                                            placeholder="Giá"
                                            className={`form-control ${
                                                errors.price ? "is-invalid" : ""
                                            }`}
                                            onChange={handlePriceChange}
                                            style={{
                                                width: "100px",
                                                height: "25px",
                                            }}
                                            min={0}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                border: "none",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "white",
                                                backgroundColor: "black",
                                                marginTop: "2px",
                                                marginLeft: "5px",
                                                paddingTop: "2px",
                                                paddingRight: "1px",
                                            }}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            size: { _id: "" },
                                            stock: 0,
                                            price: 0,
                                        })
                                    }
                                    style={{
                                        width: "70px",
                                        height: "25px",

                                        border: "none",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "white",
                                        backgroundColor: "black",
                                        marginTop: "10px",

                                        paddingRight: "1px",
                                    }}
                                >
                                    Thêm Size
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ marginTop: "20px" }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormProduct;
