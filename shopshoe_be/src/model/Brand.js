import mongoose from "mongoose";
const BrandSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    },
    { versionKey: false, timestamps: true }
);
export default mongoose.model("Brand", BrandSchema);
