import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true, // Đảm bảo username được yêu cầu
            unique: true, // Đảm bảo username là duy nhất
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "member",
            enum: ["member", "admin"],
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
