import mongoose from "mongoose";
// Định nghĩa schema cho sản phẩm giày
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    price: {
      type: Number,
      required: true,
    },
    sizeStock: [
      {
        size: { type: mongoose.Schema.Types.ObjectId, ref: "Size" }, // Đảm bảo ref là "Size"
        stock: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
    imgCategory: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// Tạo model từ schema
export default mongoose.model("Product", productSchema);
