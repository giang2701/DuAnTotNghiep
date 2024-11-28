import mongoose, { Schema } from "mongoose";

// Định nghĩa schema cho đơn hàng
const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Số lượng phải lớn hơn hoặc bằng 1"],
        },
        size: {
          // Thêm trường size
          type: Schema.Types.ObjectId,
          ref: "Size",
          required: true, // Bắt buộc chọn size
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Tổng giá trị phải lớn hơn hoặc bằng 0"],
    },
    voucher: {
      type: Schema.Types.ObjectId,
      ref: "Voucher",
      default: null, // Nếu không có mã giảm giá
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Failed", "Completed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Thẻ tín dụng", "paypal", "Chuyển khoản ngân hàng", "COD", "MOMO"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipping", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { versionKey: false, timestamps: true }
);

// Tạo model từ schema
export default mongoose.model("Order", orderSchema);
