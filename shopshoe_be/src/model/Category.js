import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        isHidden: {
            type: Boolean,
            default: false,
        },
        slug: String,
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    },
    { versionKey: false, timestamps: true }
);
export default mongoose.model("Category", CategorySchema);
