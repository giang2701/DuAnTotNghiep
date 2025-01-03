import mongoose from "mongoose";
// Định nghĩa schema cho sản phẩm giày
const baivietSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: String
      // type: [String],

    },
    isActive: {
      type: Boolean,
      default: true,
    },
    publishDate: {
      type: Date,
      default: Date.now, // Tự động gán ngày hiện tại nếu không có giá trị
    },
  },
  { versionKey: false, timestamps: true }
);

// Tạo model từ schema
export default mongoose.model("BaiViet", baivietSchema);
