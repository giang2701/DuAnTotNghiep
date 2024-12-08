import mongoose, { Schema } from "mongoose";

// Định nghĩa schema cho mã giảm giá
const voucherSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // Mã giảm giá
    discount: { type: Number, required: true }, // Phần trăm giảm (VD: 10% -> 10)
    type: { type: String, enum: ["percent", "fixed"], required: true }, // Loại giảm giá
    // percent->giảm theo %, fixed->giảm theo tiền
    expiryDate: { type: Date, required: true }, // Ngày hết hạn
    isActive: { type: Boolean, default: true }, // Mã có hoạt động không
    minPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Tạo model từ schema
export default mongoose.model("Voucher", voucherSchema);
