import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema(
    {
        nameSize: {
            type: Number,
            required: true,
            unique: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // Tham chiếu nhiều sản phẩm có cùng size
            },
        ],
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
export default mongoose.model("Size", SizeSchema);
