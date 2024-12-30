import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Đang chờ xử lý",
        "Đã được phê duyệt",
        "Bị từ chối",
        "Đang hoàn hàng",
        "Refunding",
        "Đang hoàn tiền",
      ],
      default: "Đang chờ xử lý",
    },
    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Return = mongoose.model("return", returnSchema);

export default Return;
