import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import instance from "../../../api";
import axios from "axios";
import Swal from "sweetalert2";
import "../../../App.css";
import { CKEditorComponent } from "../../../component/CKEditorComponent";
import baivietSchema from "../../../validate/baivietSchema.tsx";

const BaivietForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [imgURL, setImgURL] = useState<string>("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: joiResolver(baivietSchema),
    });

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    setLoading(true);
                    const { data } = await instance.get(`baiviet/${id}`);
                    setValue("title", data.data.title);
                    setValue("content", data.data.content);
                    setValue("images", data.data.images);
                    setDescription(data.data.content);
                    setImgURL(data.data.images); // Hiển thị ảnh hiện tại
                } catch {
                    Swal.fire("Lỗi", "Không tải được bài viết", "error");
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [id, setValue]);

    // Hàm upload file lên Cloudinary
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

    // Xử lý khi người dùng chọn file ảnh
    const handleImgChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            try {
                // setLoading(true);
                const url = await uploadFile(files[0]); // Upload ảnh lên Cloudinary
                setImgURL(url); // Lưu URL ảnh để hiển thị
                setValue("images", url); // Gán giá trị URL ảnh vào form
                Swal.fire("Thành công", "Ảnh đã được tải lên", "success");
            } catch {
                Swal.fire("Lỗi", "Không thể tải ảnh lên", "error");
            }
        }
    };

    const handleSubmitForm = async (data: any) => {
        if (!description.trim()) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Nội dung bài viết không được để trống.",
            });
            return;
        }
    
        // Hiển thị hộp thoại xác nhận
        const result = await Swal.fire({
            title: id ? "Xác nhận cập nhật" : "Xác nhận tạo mới",
            text: id
                ? "Bạn có chắc chắn muốn cập nhật bài viết này?"
                : "Bạn có chắc chắn muốn tạo mới bài viết?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: id ? "Cập nhật" : "Tạo mới",
            cancelButtonText: "Hủy",
        });
    
        if (!result.isConfirmed) {
            return; // Người dùng hủy xác nhận
        }
    
        try {
            setLoading(true);
            const payload = { ...data, content: description };
            if (id) {
                await instance.put(`baiviet/${id}`, payload);
                Swal.fire("Thành công", "Bài viết đã được cập nhật", "success");
            } else {
                await instance.post("baiviet/", payload);
                Swal.fire("Thành công", "Bài viết mới đã được tạo", "success");
            }
            navigate("/admin/baiviet");
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="container">
            <h1>{id ? "Chỉnh sửa bài viết" : "Tạo mới bài viết"}</h1>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="mb-3">
                    <label>Tiêu đề</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("title")}
                    />
                    {errors.title?.message && (
                        <p className="text-danger">
                            {errors.title.message.toString()}
                        </p>
                    )}
                </div>

                <div className="mb-3">
                    <label>Mô tả</label>
                    <CKEditorComponent
                        value={description}
                        onChange={setDescription}
                    />
                </div>
                <div className="mb-3">
                    <label>Hình ảnh</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImgChange} // Xử lý khi chọn file
                    />
                    {imgURL && (
                        <img
                            src={imgURL}
                            alt="Preview"
                            style={{ marginTop: "10px", width: "300px" }}
                        />
                    )}
                    {errors.images?.message && (
                        <p className="text-danger">
                            {errors.images.message.toString()}
                        </p>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">
                    {id ? "Cập nhật" : "Tạo mới"}
                </button>
            </form>
        </div>
    );
};

export default BaivietForm;
