import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
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
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    qrCodeImage: {
      type: String, // URL của ảnh QR code
    },
    status: {
      type: String,
      enum: ["Đang chờ xử lý", "Đã được phê duyệt", "Bị từ chối"], // Trạng thái yêu cầu hoàn tiền
      default: "Đang chờ xử lý",
    },
    adminNotes: {
      type: String, // Ghi chú của admin (nếu có)
    },
  },
  { timestamps: true }
);

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
