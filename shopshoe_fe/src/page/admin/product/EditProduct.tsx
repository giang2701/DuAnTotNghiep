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
import RichTextEditor from "../../../component/RichTextEditor";
import { Category } from "../../../interface/Category";

type Props = {
  onsubmit: (data: Product) => void;
};

const EditProduct = () => {
  const { id } = useParams();
  const [category, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [productData, setProductData] = useState<Product | null>(null);
  // const [imgCategoryURLs, setImgCategoryURLs] = useState<string[]>([]); // Quản lý ảnh danh mục

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


  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const uploadedImageUrl = await uploadFile(file);

      // Cập nhật URL ảnh mới vào state và form
      setImgURL(uploadedImageUrl);  // Thêm dòng này
      setValue("images", uploadedImageUrl);
    }
  };

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



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProductData(data);
        setDescription(data.description); // Cập nhật mô tả vào state nếu cần
        setImgURL(data.images); // Cập nhật ảnh nếu có


        reset({
          title: data.title,
          brand: data.brand,
          price: data.price,
          description: data.description,
          category: data.category, // Đặt giá trị mặc định cho category
          images: data.images, // Đặt ảnh đã có vào form
          sizeStock: data.sizeStock || [], // Đặt dữ liệu stock theo size nếu có
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchProduct();
    // Fetch danh mục
    (async () => {
      const { data } = await axios.get("/categorys");
      setCategories(data.data);
    })();
  }, [id, reset]);


  const onSubmit = async (data: Product) => {
    try {
      const updatedProduct = {
        ...data,
        images: imgURL || data.images,
      };

      const response = await axios.put(`/products/${id}`, updatedProduct);
      console.log("API response: ", response.data); // Kiểm tra dữ liệu trả về từ API
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };
  return (
    <Container maxWidth="lg">
      <Typography
        style={{ fontSize: "40px", marginBottom: "30px", paddingTop: "24px" }}
        variant="h1"
        component="h1"
      >
        Product Edit
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            onChange={handleImageChange}
            variant="outlined"
            error={!!errors.images}
            helperText={errors.images && "Không được để trống"}
          />
          {/* Hiển thị ảnh mới nếu có, nếu không hiển thị ảnh cũ */}
          {imgURL ? (
            <Box mt={1}>
              <img
                src={`${imgURL}?${new Date().getTime()}`}
                alt="Uploaded Product"
                style={{ width: "100px", height: "auto" }}
              />
            </Box>
          ) : (
            productData?.images && (
              <Box mt={1}>
                <img
                  src={`${productData.images}?${new Date().getTime()}`}
                  alt="Current Product"
                  style={{ width: "100px", height: "auto" }}
                />
              </Box>
            )
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="category">Category</InputLabel>
          <Select
            {...register("category", { required: true })} // Thêm required nếu cần
            defaultValue={productData?.category || ""} // Hiển thị danh mục của sản phẩm hiện tại
            variant="outlined"
            error={!!errors.category}
          >
            {category &&
              category.map((item: Category, index: number) => (
                <MenuItem key={index} value={item._id}>
                  {item.title}
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
