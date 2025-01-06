import multer from "multer";
import path from "path";
import fs from "fs";
import Refund from "../model/Refund.js";
import Order from "../model/Older.js";

// Cấu hình multer để lưu trữ file ảnh QR code
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), "src", "uploads", "refunds");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file 10MB
    fileFilter: function (req, file, cb) {
        // Kiểm tra loại file
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Chỉ chấp nhận file ảnh!"), false);
        }
    },
}).single("qrCodeImage"); // Chỉ chấp nhận một file ảnh duy nhất

// Tạo yêu cầu hoàn tiền
export const createRefund = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Xử lý lỗi từ multer
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        }

        try {
            const {
                orderId,
                userId,
                bankName,
                accountNumber,
                accountName,
                phoneNumber,
            } = req.body;
            const qrCodeImage = req.file
                ? `/uploads/refunds/${req.file.filename}`
                : null;

            // Kiểm tra các trường bắt buộc
            if (
                !orderId ||
                !userId ||
                !bankName ||
                !accountNumber ||
                !accountName ||
                !phoneNumber
            ) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng điền đầy đủ thông tin." });
            }

            // Kiểm tra xem đơn hàng có tồn tại không
            const order = await Order.findById(orderId);
            if (!order) {
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy đơn hàng." });
            }

            // Tạo yêu cầu hoàn tiền mới
            const newRefund = new Refund({
                orderId,
                userId,
                bankName,
                accountNumber,
                accountName,
                phoneNumber,
                qrCodeImage,
            });

            await newRefund.save();
            await Order.findByIdAndUpdate(orderId, { isRefundRequested: true });
            res.status(201).json({
                message: "Yêu cầu hoàn tiền đã được tạo.",
                refund: newRefund,
            });
        } catch (error) {
            console.error("Lỗi khi tạo yêu cầu hoàn tiền:", error);
            res.status(500).json({
                message: "Lỗi máy chủ. Không thể tạo yêu cầu hoàn tiền.",
            });
        }
    });
};

// Lấy danh sách yêu cầu hoàn tiền
export const getAllRefunds = async (req, res) => {
    try {
        const refunds = await Refund.find()
            .populate("orderId")
            .populate("userId");
        res.status(200).json(refunds);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu hoàn tiền:", error);
        res.status(500).json({
            message: "Lỗi máy chủ. Không thể lấy danh sách yêu cầu hoàn tiền.",
        });
    }
};

// Cập nhật trạng thái yêu cầu hoàn tiền
export const updateRefundStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ["Đã được phê duyệt", "Bị từ chối"];
        if (!validStatuses.includes(status)) {
            return res
                .status(400)
                .json({ message: "Trạng thái không hợp lệ." });
        }

        const updatedRefund = await Refund.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true }
        );
        if (!updatedRefund) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy yêu cầu hoàn tiền." });
        }

        // Nếu yêu cầu được chấp nhận, cập nhật trạng thái đơn hàng thành "Refunded"
        if (status === "Đã được phê duyệt") {
            const order = await Order.findById(updatedRefund.orderId);
            if (order) {
                order.status = "Refundsuccessful";
                await order.save();
            }
        }

        res.status(200).json({
            message: "Cập nhật trạng thái yêu cầu hoàn tiền thành công.",
            refund: updatedRefund,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái yêu cầu hoàn tiền:", error);
        res.status(500).json({
            message:
                "Lỗi máy chủ. Không thể cập nhật trạng thái yêu cầu hoàn tiền.",
        });
    }
};

// Xóa yêu cầu hoàn tiền
export const deleteRefund = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm yêu cầu hoàn tiền
        const refundRequest = await Refund.findById(id);
        if (!refundRequest) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy yêu cầu hoàn tiền." });
        }

        // Xóa ảnh QR code (nếu có)
        if (refundRequest.qrCodeImage) {
            const imagePath = path.join(
                process.cwd(),
                "src",
                "uploads",
                "refunds",
                refundRequest.qrCodeImage
            );
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Xóa yêu cầu hoàn tiền
        await Refund.findByIdAndDelete(id);

        res.status(200).json({
            message: "Yêu cầu hoàn tiền đã được xóa thành công.",
        });
    } catch (error) {
        console.error("Lỗi khi xóa yêu cầu hoàn tiền:", error);
        res.status(500).json({
            message: "Lỗi máy chủ. Không thể xóa yêu cầu hoàn tiền.",
        });
    }
};
