import mongoose, { Schema } from "mongoose";

// Định nghĩa schema cho mã giảm giá
const voucherSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true, // Đảm bảo mã giảm giá là duy nhất
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: [0, "Giảm giá không thể âm"],
            max: [100, "Giảm giá không thể vượt quá 100%"],
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        usageLimit: {
            type: Number,
            default: 0, // Số lần sử dụng tối đa (0 nếu không giới hạn)
        },
        usedCount: {
            type: Number,
            default: 0, // Số lần đã sử dụng
        },
        isActive: {
            type: Boolean,
            default: true, // Trạng thái hoạt động của mã
        },
    },
    { versionKey: false, timestamps: true }
);

// Tạo model từ schema
export default mongoose.model("Voucher", voucherSchema);
