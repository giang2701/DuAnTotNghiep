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
            type: String,
            required: true,
        },
        sizeStock: [
            {
                size: {
                    type: Number,
                    required: true,
                },
                stock: {
                    type: Number,
                    required: true,
                },
            },
        ],
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        images: {
            type: [String], // Changed to an array of strings
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    { versionKey: false, timestamps: true }
);

// Tạo model từ schema
export default mongoose.model("Product", productSchema);
