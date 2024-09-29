import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../../../interface/Products";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import RichTextEditor from "../../../component/RichTextEditor"; // Giữ phần RichTextEditor cho phần description
import { Category } from "../../../interface/Category";

type Props = {
  onsubmit: (data: Product) => void;
};

const EditProduct = ({ onsubmit }: Props) => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [imgURL, setImgURL] = useState<string | null>(null); // Quản lý ảnh sản phẩm
  const [imgCategoryURLs, setImgCategoryURLs] = useState<string[]>([]); // Quản lý ảnh danh mục

  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
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

  // Upload file ảnh lên Cloudinary
  const uploadFile = async (file: File) => {
    const CLOUD_NAME = "dzafnopsc";
    const PRESET_NAME = "nthShop";
    const FOLDER_NAME = "NTHSHOP";
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
      setImgURL(url); // Cập nhật URL ảnh sản phẩm
    }
  };

  // Xử lý thêm ảnh danh mục
  const handleImgCategoryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      setImgCategoryURLs(urls); // Cập nhật URL ảnh danh mục
    }
  };

  useEffect(() => {
    if (id) {
      // Fetch dữ liệu sản phẩm khi có ID
      (async () => {
        try {
          const { data } = await axios.get(`/products/${id}`);
          const productData = data.data;

          reset(productData);
          setDescription(productData.description); // Cập nhật description
          setImgURL(productData.images); // Cập nhật URL ảnh
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      })();
    }

    // Fetch danh mục
    (async () => {
      const { data } = await axios.get("/categorys");
      setCategories(data.data);
    })();
  }, [id, reset]);

  return (
    <Container maxWidth="lg">
      <Typography
        style={{ fontSize: "40px", marginBottom: "30px", paddingTop: "24px" }}
        variant="h1"
        component="h1"
      >
        Product Edit
      </Typography>
      <form
        onSubmit={handleSubmit((data: any) =>
          onsubmit({
            ...data,
            _id: id,
            images: imgURL, // Lưu URL của ảnh sản phẩm
            imgCategory: imgCategoryURLs.length ? imgCategoryURLs : data.imgCategory,
          })
        )}
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
            error={!!errors.price}
            helperText={errors.price && "Price is required"}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <label htmlFor="description">Description</label>
          <RichTextEditor
            value={description}
            onChange={(value) => {
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
          <Select {...register("category")} defaultValue="" variant="outlined">
            {categories.map((category: Category) => (
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
    </Container>
  );
};

export default EditProduct;
