import mongoose from "mongoose";
const FlashSaleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        discountPercent: {
            type: Number,
            required: true,
        }, // Giá giảm
        type: { type: String, enum: ["percent"], required: true }, // Loại giảm giá
        startDate: { type: Date, required: true }, // Thời gian bắt đầu
        endDate: { type: Date, required: true }, // Thời gian kết thúc
        isActive: {
            type: Boolean,
            default: true, // Xác định chương trình có đang hoạt động hay không
        },
    },
    { versionKey: false, timestamps: true }
);
export default mongoose.model("FlashSale", FlashSaleSchema);
