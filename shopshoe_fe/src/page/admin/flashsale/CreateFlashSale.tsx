import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import flashSaleSchema from "../../../validate/FlashSale";
import { FlashSale } from "../../../interface/Products";
import { useState } from "react";
import { useFlashSale } from "../../../context/FlashSale";

const CreateFlashSale = () => {
    const { handleFlashSale } = useFlashSale();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FlashSale>({
        resolver: joiResolver(flashSaleSchema),
    });

    const [discountPreview, setDiscountPreview] = useState<string>("");

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDiscountPreview(value ? `${value}%` : "");
    };

    return (
        <div className="container mt-5">
            <h1
                className="mt-2"
                style={{ display: "inline-block", fontFamily: "serif" }}
            >
                FlashSale
            </h1>
            <span style={{ marginLeft: "5px", fontFamily: "serif" }}>Tạo Mới</span>
            <form onSubmit={handleSubmit(handleFlashSale)}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Tên Flash Sale
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        {...register("title")}
                    />
                    {errors.title && <p className="text-danger">{errors.title.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="discountPercent" className="form-label">
                        Giảm Giá (%) <span className="text-muted">(0-100)</span>
                    </label>
                    <input
                        type="number"
                        id="discountPercent"
                        className="form-control"
                        {...register("discountPercent")}
                        onChange={handleDiscountChange}
                    />
                    {errors.discountPercent && (
                        <p className="text-danger">{errors.discountPercent.message}</p>
                    )}
                    <p className="text-info">Preview: {discountPreview}</p>
                </div>
                <div className="form-floating w-75">
                    <select
                        {...register("type")}
                        id="type"
                        className="form-select w-25"
                        defaultValue="percent"
                    >
                        <option value="percent">Giảm theo %</option>
                    </select>
                    {errors.type && (
                        <p className="text-danger">{errors.type.message}</p>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">
                        Ngày Bắt Đầu
                    </label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        className="form-control"
                        {...register("startDate")}
                    />
                    {errors.startDate && <p className="text-danger">{errors.startDate.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">
                        Ngày Kết Thúc
                    </label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        className="form-control"
                        {...register("endDate")}
                    />
                    {errors.endDate && <p className="text-danger">{errors.endDate.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary">
                    Thêm
                </button>
            </form>
        </div>
    );
};

export default CreateFlashSale;
