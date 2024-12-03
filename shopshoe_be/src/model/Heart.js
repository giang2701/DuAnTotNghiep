import mongoose from "mongoose";

const heartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

export default mongoose.model("Heart", heartSchema);
