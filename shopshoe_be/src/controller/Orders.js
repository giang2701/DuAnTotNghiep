import Order from "../model/Older.js"; // Đường dẫn đến model Order
import Voucher from "../model/Voucher.js";
// |------------------------------------------------------
// |  (Client)
// |------------------------------------------------------
export const createOrder = async (req, res, next) => {
    try {
        const {
            userId,
            products,
            totalPrice,
            voucherCode,
            shippingAddress,
            paymentMethod,
        } = req.body;

        // Kiểm tra mã giảm giá (nếu có)
        let voucher = null;
        if (voucherCode) {
            // Tìm mã giảm giá trong cơ sở dữ liệu
            voucher = await Voucher.findOne({ code: voucherCode });
            if (!voucher || !voucher.isActive) {
                return res.status(400).json({
                    message: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
                });
            }
            // Kiểm tra xem mã giảm giá có còn hạn sử dụng không
            const currentDate = new Date();
            if (
                currentDate < voucher.startDate ||
                currentDate > voucher.endDate
            ) {
                return res
                    .status(400)
                    .json({ message: "Mã giảm giá đã hết hạn." });
            }
        }

        // Tạo đơn hàng mới
        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            voucher: voucher ? voucher._id : null, // Lưu ID của voucher nếu có
            shippingAddress,
            paymentMethod,
        });

        await newOrder.save(); // Lưu đơn hàng vào cơ sở dữ liệu

        return res
            .status(201)
            .json({ message: "Đơn hàng đã được tạo.", newOrder });
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể tạo đơn hàng." });
    }
};
// Truy xuất đơn hàng
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("products.product"); // Tìm đơn hàng trong cơ sở dữ liệu
        return res.status(200).json(orders); // Trả về đơn hàng
    } catch (error) {
        next(error);
    }
};
// Truy xuất chi tiết đơn hàng
export const getOrderDetail = async (req, res, next) => {
    try {
        const orderId = req.params.id; // Lấy orderId từ params

        const order = await Order.findById(orderId).populate(
            "products.product"
        ); // Tìm đơn hàng theo ID và populate thông tin sản phẩm
        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại." });
        }

        return res.status(200).json(order); // Trả về chi tiết đơn hàng
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể lấy chi tiết đơn hàng." });
    }
};
export const deleteOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id; // Lấy orderId từ params

        // Tìm và xóa đơn hàng theo ID
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại." });
        }

        return res
            .status(200)
            .json({ message: "Đơn hàng đã được xóa thành công." });
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể xóa đơn hàng." });
    }
};

// |------------------------------------------------------
// | Update order status (ADMIN)
// |------------------------------------------------------
export const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.params.id; // Lấy orderId từ params
        const { status } = req.body; // Lấy trạng thái mới từ body

        // Kiểm tra xem trạng thái mới có hợp lệ không
        const validStatuses = ["pending", "shipping", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res
                .status(400)
                .json({ message: "Trạng thái không hợp lệ." });
        }

        // Tìm đơn hàng theo ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại." });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;

        await order.save(); // Lưu đơn hàng đã cập nhật vào cơ sở dữ liệu

        return res
            .status(200)
            .json({ message: "Trạng thái đơn hàng đã được cập nhật.", order });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể cập nhật trạng thái." });
    }
};
