import mongoose, { Schema } from "mongoose";

// Định nghĩa schema cho một mục trong đơn hàng
const orderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
});

// Định nghĩa schema cho đơn hàng
const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [orderItemSchema], // Mảng các sản phẩm trong đơn hàng
        totalPrice: { type: Number, required: true },
        // voucher: { type: String, enum: ["sale15", "sale20"] }, // Mã giảm giá, nếu có
        status: {
            type: String,
            enum: ["pending", "shipping", "completed", "cancelled"],
            default: "pending",
        },
    },
    { versionKey: false, timestamps: true }
);

// Tạo model từ schema
export default mongoose.model("Order", orderSchema);
