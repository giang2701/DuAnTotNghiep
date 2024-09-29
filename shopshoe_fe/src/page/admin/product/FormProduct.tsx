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
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";

const FormProduct = () => {
    const { id } = useParams();
    const { handleProduct } = useContext(ProductContext) as ProductContextType;
    const [categories, setCategories] = useState<Category[]>([]);
    const [formattedPrice, setFormattedPrice] = useState<string>("");
    const [description, setDescription] = useState("");

    // State để quản lý ảnh sản phẩm và ảnh danh mục
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

    // Upload file ảnh lên Cloudinary
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

    // Xử lý thêm ảnh sản phẩm
    const handleImgChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const url = await uploadFile(files[0]);
            setImgURL(url);
        }
    };

    // Xử lý thêm ảnh danh mục
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
        <Container maxWidth="lg">
            <Typography
                style={{ fontSize: "40px", marginBottom: "30px", paddingTop: "24px" }}
                variant="h1"
                component="h1"
            >
                {id ? "Product Edit" : "Product Add"}
            </Typography>
            <form
                onSubmit={handleSubmit((data: Product) => {
                    const updatedData = {
                        ...data,
                        _id: id,
                        images: imgURL || data?.images, // Thêm ảnh vào đối tượng gửi đi
                    };
                    console.log("Dữ liệu gửi lên:", updatedData); // Kiểm tra dữ liệu
                    handleProduct(updatedData);
                })}
            >
                <FormControl fullWidth margin="normal">
                    <TextField
                        {...register("title", { required: true })}
                        label="Title"
                        variant="outlined"
                        error={!!errors.title}
                        helperText={errors.title && "Title is required"}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        {...register("brand", { required: true })}
                        label="Brand"
                        variant="outlined"
                        error={!!errors.brand}
                        helperText={errors.brand && "Brand is required"}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        {...register("price", { required: true })}
                        label="Price"
                        variant="outlined"
                        type="number"
                        onChange={handlePriceChange}
                        error={!!errors.price}
                        helperText={errors.price && "Price is required"}
                    />
                    <Box mt={1}>{formattedPrice}</Box>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <label htmlFor="description">Description</label>
                    <RichTextEditor
                        value={description}
                        onChange={(value: any) => {
                            setDescription(value);
                            setValue("description", value);
                        }}
                    />
                    {errors.description && (
                        <Box style={{ color: "red", margin: "8px 0" }}>
                            Description is required
                        </Box>
                    )}
                </FormControl>

                {/* Thêm ảnh sản phẩm */}
                <FormControl fullWidth margin="normal">
                    <TextField
                        type="file"
                        onChange={handleImgChange}
                        variant="outlined"
                        error={!!errors.images}
                        helperText={errors.images && "Không được để trống"}
                    />
                    {imgURL && (
                        <Box mt={1}>
                            <img
                                src={imgURL}
                                alt="Uploaded Product"
                                style={{ width: "100px", height: "auto" }}
                            />
                        </Box>
                    )}
                </FormControl>

                {/* Thêm ảnh danh mục */}
                <FormControl fullWidth margin="normal">
                    <TextField
                        type="file"
                        onChange={handleImgCategoryChange}
                        inputProps={{ multiple: true }}
                        variant="outlined"
                        error={!!errors.imgCategory}
                        helperText={errors.imgCategory && "Không được để trống"}
                    />
                    {imgCategoryURLs.length > 0 && (
                        <Box mt={1} sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                            {imgCategoryURLs.map((img, index) => (
                                <Box key={index} sx={{ display: "flex" }}>
                                    <img
                                        src={img}
                                        alt={`Uploaded Category ${index}`}
                                        style={{ width: "80px", height: "80px" }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </FormControl>



                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="category">Category</InputLabel>
                    <Select
                        {...register("category")}
                        defaultValue=""
                        variant="outlined"
                    >
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box mt={2}>
                    <Typography variant="h6">Size Stock</Typography>
                    <Box display="flex" flexWrap="wrap">
                        {fields.map((item, index) => (
                            <FormControl
                                key={item.id}
                                margin="normal"
                                style={{ width: "120px", marginRight: "16px" }}
                            >
                                <TextField
                                    label={`Size ${item.size}`}
                                    variant="outlined"
                                    {...register(`sizeStock.${index}.stock` as const, {
                                        valueAsNumber: true,
                                    })}
                                />
                            </FormControl>
                        ))}
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        backgroundColor: "black",
                    }}
                >
                    Submit
                </Button>
            </form>
        </Container >
    );
};

export default FormProduct;
