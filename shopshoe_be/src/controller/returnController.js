import Order from "../model/Older.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import Return from "../model/Return.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Products from "../model/Products.js";

// Cấu hình multer để lưu trữ file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), "src", "uploads", "returns");
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
    limits: { fileSize: 100 * 1024 * 1024 }, // Giới hạn kích thước file 100MB
    fileFilter: function (req, file, cb) {
        // Kiểm tra loại file
        if (
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Loại file không hợp lệ!"), false);
        }
    },
}).fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
]);
// tạo formform
export const createReturn = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Xử lý lỗi từ multer
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        }

        try {
            const { orderId, userId, userName, userPhone, reason, status } =
                req.body;
            const images = req.files["images"]
                ? req.files["images"].map(
                      (file) => `/uploads/returns/${file.filename}`
                  )
                : [];
            const videos = req.files["videos"]
                ? req.files["videos"].map(
                      (file) => `/uploads/returns/${file.filename}`
                  )
                : [];

            // Kiểm tra các trường bắt buộc
            if (!orderId || !userId || !userName || !userPhone || !reason) {
                return res
                    .status(400)
                    .json({ message: "Vui lòng điền đầy đủ thông tin." });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy đơn hàng" });
            }

            // Tạo yêu cầu hoàn trả mới
            const newReturn = new Return({
                orderId,
                userId,
                userName,
                userPhone,
                reason,
                status,
                images,
                videos,
            });

            await newReturn.save();

            res.status(201).json({
                message: "Yêu cầu hoàn trả đã được tạo.",
                return: newReturn,
            });
        } catch (error) {
            console.error("Lỗi khi tạo yêu cầu hoàn trả:", error);
            res.status(500).json({
                message: "Lỗi máy chủ. Không thể tạo yêu cầu hoàn trả.",
            });
        }
    });
};
// lấy danh sáchsách
export const getAllReturns = async (req, res) => {
    try {
        const returns = await Return.find()
            .populate("orderId")
            .populate("userId");
        res.status(200).json(returns);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu hoàn trả:", error);
        res.status(500).json({
            message: "Lỗi máy chủ. Không thể lấy danh sách yêu cầu hoàn trả.",
        });
    }
};

// Cập nhật trạng thái yêu cầu hoàn trả
export const updateReturnStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "Đã được phê duyệt",
            "Bị từ chối",
            "Đang hoàn hàng",
            "Đang hoàn tiền",
        ];
        if (!validStatuses.includes(status)) {
            return res
                .status(400)
                .json({ message: "Trạng thái không hợp lệ." });
        }

        const updatedReturn = await Return.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatedReturn) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy yêu cầu hoàn trả." });
        }

        // Nếu yêu cầu được chấp nhận,
        if (status === "Đã được phê duyệt") {
            const order = await Order.findById(updatedReturn.orderId);
            if (order) {
                order.status = "Returning"; // Hoặc trạng thái tương ứng
                await order.save();
            }
        }
        if (status === "Đang hoàn tiền") {
            const order = await Order.findById(updatedReturn.orderId);
            if (order) {
                order.status = "Refunding"; // Cập nhật trạng thái đơn hàng thành "Refunding"
                await order.save();
            }
            // const order = await Order.findById(updatedReturn.orderId);
            // const session = await mongoose.startSession();
            // session.startTransaction(); // Bắt đầu transaction
            // try {
            //     if (order) {
            //         order.status = "Refunding"; // Cập nhật trạng thái đơn hàng thành "Refunding"
            //         for (const item of order.products) {
            //             const { product, size, quantity } = item;
            //             // Tìm sản phẩm
            //             const productDoc = await Products.findById(
            //                 product
            //             ).session(session);
            //             if (!productDoc) {
            //                 throw new Error(
            //                     `Product with ID ${product} not found`
            //                 );
            //             }
            //             // Tìm size trong sizeStock của sản phẩm
            //             const sizeStockItem = productDoc.sizeStock.find(
            //                 (stockItem) =>
            //                     stockItem.size.toString() === size.toString()
            //             );
            //             if (!sizeStockItem) {
            //                 throw new Error(
            //                     `Size with ID ${size} not found in product ${product}`
            //                 );
            //             }
            //             // Hoàn lại số lượng
            //             sizeStockItem.stock += quantity;
            //             // Lưu sản phẩm
            //             await productDoc.save({ session });
            //         }
            //         // Lưu đơn hàng, truyền session vào
            //         await order.save({ session });
            //     }
            //     // Commit transaction nếu không có lỗi
            //     await session.commitTransaction();
            // } catch (error) {
            //     // Rollback transaction nếu có lỗi
            //     await session.abortTransaction();
            //     console.error("Lỗi:", error.message);
            // } finally {
            //     // Kết thúc session
            //     session.endSession();
            // }
        }

        res.status(200).json({
            message: "Cập nhật trạng thái yêu cầu hoàn trả thành công.",
            return: updatedReturn,
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Lỗi máy chủ. Không thể cập nhật trạng thái yêu cầu hoàn trả.",
        });
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// xoa yeu cau hoan tra
export const deleteReturn = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm yêu cầu hoàn trả
        const returnRequest = await Return.findById(id);
        if (!returnRequest) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy yêu cầu hoàn trả." });
        }

        // Xóa các hình ảnh và video liên quan (nếu có)
        if (returnRequest.images && returnRequest.images.length > 0) {
            returnRequest.images.forEach((imagePath) => {
                const fullPath = path.join(
                    __dirname,
                    "../uploads/returns",
                    imagePath
                );
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }
        if (returnRequest.videos && returnRequest.videos.length > 0) {
            returnRequest.videos.forEach((videoPath) => {
                const fullPath = path.join(
                    __dirname,
                    "../uploads/returns",
                    videoPath
                );
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        // Xóa yêu cầu hoàn trả
        await Return.findByIdAndDelete(id);

        res.status(200).json({
            message: "Yêu cầu hoàn trả đã được xóa thành công.",
        });
    } catch (error) {
        console.error("Lỗi khi xóa yêu cầu hoàn trả:", error);
        res.status(500).json({
            message: "Lỗi máy chủ. Không thể xóa yêu cầu hoàn trả.",
        });
    }
};
