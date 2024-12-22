import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true, // Đảm bảo username được yêu cầu
            unique: true, // Đảm bảo username là duy nhất
        },
        avatar: {
            type: String,
            default: "https://mighty.tools/mockmind-api/content/human/57.jpg",
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
        level: {
            type: String,
        },
        permissions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Permission",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
