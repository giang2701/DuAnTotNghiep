import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: Number, required: true }, // Lưu kích cỡ đã chọn
    quantity: { type: Number, required: true }, // Số lượng đã chọn cho kích cỡ đó
});

// Định nghĩa schema cho giỏ hàng
const cartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [cartItemSchema], // Mảng các sản phẩm trong giỏ hàng với kích cỡ và số lượng tương ứng
        totalPrice: { type: Number, required: true },
    },
    { versionKey: false, timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
