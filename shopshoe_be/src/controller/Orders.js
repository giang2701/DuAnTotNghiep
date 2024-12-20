import Order from "../model/Older.js";
import Products from "../model/Products.js";
import Voucher from "../model/Voucher.js";
import Cart from "../model/Cart.js";
import crypto from "crypto";
import axios from "axios";
import mongoose from "mongoose";
import Comment from "../model/Comments.js";
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

        if (
            !userId ||
            !products ||
            !totalPrice ||
            !shippingAddress ||
            !paymentMethod
        ) {
            return res
                .status(400)
                .json({ message: "Thiếu thông tin đơn hàng." });
        }
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
            paymentStatus: "Completed",
            status: "Pending",
        });

        await newOrder.save(); // Lưu đơn hàng vào cơ sở dữ liệu

        const cart = await Cart.findOne({ userId });
        if (cart) {
            await Cart.findByIdAndDelete(cart._id);
        }

        for (const item of products) {
            const { product, size, quantity } = item;

            // Tìm sản phẩm trong cơ sở dữ liệu
            const foundProduct = await Products.findById(product);
            if (!foundProduct) {
                return res
                    .status(404)
                    .json({ message: "Sản phẩm không tồn tại." });
            }

            // Tìm size tương ứng trong `sizeStock`
            const sizeInfo = foundProduct.sizeStock.find((stock) =>
                stock.size.equals(size)
            );
            if (!sizeInfo) {
                return res
                    .status(400)
                    .json({ message: "Size không hợp lệ hoặc không tồn tại." });
            }

            // Kiểm tra số lượng tồn kho
            if (sizeInfo.stock < quantity) {
                return res
                    .status(400)
                    .json({ message: "Số lượng sản phẩm không đủ trong kho." });
            }

            // Trừ đi số lượng tồn kho
            sizeInfo.stock -= quantity;

            // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
            await foundProduct.save();
        }
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

export const createDetail = async (req, res, next) => {
    try {
        const {
            userId,
            products,
            totalPrice,
            voucherCode,
            shippingAddress,
            paymentMethod,
        } = req.body;

        if (
            !userId ||
            !products ||
            !totalPrice ||
            !shippingAddress ||
            !paymentMethod
        ) {
            return res
                .status(400)
                .json({ message: "Thiếu thông tin đơn hàng." });
        }
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
            paymentStatus: "Completed",
            status: "Pending",
        });

        await newOrder.save(); // Lưu đơn hàng vào cơ sở dữ liệu

        const cart = await Cart.findOne({ userId });
        if (cart) {
            await Cart.findByIdAndDelete(cart._id);
        }

        const { product, size, quantity } = products;

        // Tìm sản phẩm trong cơ sở dữ liệu
        const foundProduct = await Products.findById(product);
        if (!foundProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại." });
        }

        // Tìm size tương ứng trong `sizeStock`
        const sizeInfo = foundProduct.sizeStock.find((stock) =>
            stock.size.equals(size)
        );
        if (!sizeInfo) {
            return res
                .status(400)
                .json({ message: "Size không hợp lệ hoặc không tồn tại." });
        }

        // Kiểm tra số lượng tồn kho
        if (sizeInfo.stock < quantity) {
            return res
                .status(400)
                .json({ message: "Số lượng sản phẩm không đủ trong kho." });
        }

        // Trừ đi số lượng tồn kho
        sizeInfo.stock -= quantity;

        // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
        await foundProduct.save();

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

export const createOrderAndPayment = async (req, res) => {
    try {
        // 1. Lấy thông tin từ người dùng
        const { userId, products, totalPrice, shippingAddress } = req.body;
        // 2. Kiểm tra tồn kho trước khi tạo đơn hàng
        for (const item of products) {
            const { product, size, quantity } = item;

            // Tìm sản phẩm trong cơ sở dữ liệu
            const foundProduct = await Products.findById(product);
            if (!foundProduct) {
                return res
                    .status(404)
                    .json({ message: "Sản phẩm không tồn tại." });
            }

            // Tìm size tương ứng trong `sizeStock`
            const sizeInfo = foundProduct.sizeStock.find((stock) =>
                stock.size.equals(size)
            );
            if (!sizeInfo) {
                return res
                    .status(400)
                    .json({ message: "Size không hợp lệ hoặc không tồn tại." });
            }

            // Kiểm tra số lượng tồn kho
            if (sizeInfo.stock < quantity) {
                return res
                    .status(400)
                    .json({ message: "Số lượng sản phẩm không đủ trong kho." });
            }

            // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
            await foundProduct.save();
        }
        // 3. Tạo đơn hàng trong MongoDB
        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            shippingAddress,
            paymentMethod: "MOMO", // Phương thức thanh toán
        });

        const savedOrder = await newOrder.save();

        // 4. Chuẩn bị dữ liệu để gửi tới MoMo
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        const orderId = savedOrder._id.toString();
        const requestId = `req-${Date.now()}`;
        const amount = savedOrder.totalPrice;
        const orderInfo = `Thanh toán đơn hàng ${orderId}`;
        const redirectUrl = "http://localhost:5173/checkOut";
        const ipnUrl = "http://localhost:3000/payment-notify";

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const paymentRequest = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData: "",
            requestType: "captureWallet",
            signature,
        };

        // 5. Gửi yêu cầu tới MoMo
        const response = await axios.post(endpoint, paymentRequest);
        if (response.data.payUrl) {
            res.json({
                message: "Tạo thanh toán MoMo thành công!",
                payUrl: response.data.payUrl, // URL thanh toán
                order: {
                    _id: savedOrder._id,
                    userId: savedOrder.userId,
                    products: savedOrder.products,
                    totalPrice: savedOrder.totalPrice,
                    shippingAddress: savedOrder.shippingAddress,
                    paymentMethod: savedOrder.paymentMethod,
                    paymentStatus: savedOrder.paymentStatus,
                },
                momoRequest: paymentRequest, // Dữ liệu gửi tới MoMo (tùy chọn)
                momoResponse: response.data, // Dữ liệu trả về từ MoMo
            });
        } else {
            throw new Error("Không thể tạo thanh toán MoMo");
        }
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng và thanh toán:", error.message);
        res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
    }
};
export const createOrderAndPaymentDetail = async (req, res) => {
    try {
        // 1. Lấy thông tin từ người dùng
        const { userId, products, totalPrice, shippingAddress } = req.body;
        // 2. Kiểm tra tồn kho trước khi tạo đơn hàng
        const { product, size, quantity } = products;
        // Tìm sản phẩm trong cơ sở dữ liệu
        const foundProduct = await Products.findById(product);
        if (!foundProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại." });
        }
        // Tìm size tương ứng trong `sizeStock`
        const sizeInfo = foundProduct.sizeStock.find((stock) =>
            stock.size.equals(size)
        );
        if (!sizeInfo) {
            return res
                .status(400)
                .json({ message: "Size không hợp lệ hoặc không tồn tại." });
        }
        // Kiểm tra số lượng tồn kho
        if (sizeInfo.stock < quantity) {
            return res
                .status(400)
                .json({ message: "Số lượng sản phẩm không đủ trong kho." });
        }
        // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
        await foundProduct.save();
        // 3. Tạo đơn hàng trong MongoDB
        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            shippingAddress,
            paymentMethod: "MOMO", // Phương thức thanh toán
        });

        const savedOrder = await newOrder.save();

        // 4. Chuẩn bị dữ liệu để gửi tới MoMo
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        const orderId = savedOrder._id.toString();
        const requestId = `req-${Date.now()}`;
        const amount = savedOrder.totalPrice;
        const orderInfo = `Thanh toán đơn hàng ${orderId}`;
        const redirectUrl = "http://localhost:5173/checkOut";
        const ipnUrl = "http://localhost:3000/payment-notify";

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const paymentRequest = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData: "",
            requestType: "captureWallet",
            signature,
        };

        // 5. Gửi yêu cầu tới MoMo
        const response = await axios.post(endpoint, paymentRequest);
        if (response.data.payUrl) {
            res.json({
                message: "Tạo thanh toán MoMo thành công!",
                payUrl: response.data.payUrl, // URL thanh toán
                order: {
                    _id: savedOrder._id,
                    userId: savedOrder.userId,
                    products: savedOrder.products,
                    totalPrice: savedOrder.totalPrice,
                    shippingAddress: savedOrder.shippingAddress,
                    paymentMethod: savedOrder.paymentMethod,
                    paymentStatus: savedOrder.paymentStatus,
                },
                momoRequest: paymentRequest, // Dữ liệu gửi tới MoMo (tùy chọn)
                momoResponse: response.data, // Dữ liệu trả về từ MoMo
            });
        } else {
            throw new Error("Không thể tạo thanh toán MoMo");
        }
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng và thanh toán:", error.message);
        res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
    }
};
export const checkAndUpdatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        // 1. Tìm đơn hàng trong DB
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại." });
        }

        // 2. Kiểm tra số lượng sản phẩm trong kho
        async function checkProductStock(order) {
            for (const product of order.products) {
                const productInStock = await Products.findById(product.product);
                const sizeInStock = productInStock.sizeStock.find(
                    (size) => size.size.toString() === product.size.toString()
                );
                if (sizeInStock.stock < product.quantity) {
                    return false;
                }
            }
            return true;
        }

        if (!(await checkProductStock(order))) {
            console.log("Số lượng sản phẩm trong kho không đủ");
            order.paymentStatus = "Failed";
            await order.save();
            await deleteOrderStautus(orderId);
            return res.json({
                message: `Thanh toán thất bại: Số lượng sản phẩm trong kho không đủ`,
                status: order.paymentStatus,
            });
        }

        // 2. Kiểm tra trạng thái thanh toán qua API MoMo
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const endpoint = "https://test-payment.momo.vn/v2/gateway/api/query";

        const requestId = `req-${Date.now()}`;
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const queryRequest = {
            partnerCode,
            accessKey,
            requestId,
            orderId: orderId,
            signature,
        };

        const response = await axios.post(endpoint, queryRequest);
        const { resultCode, message } = response.data;

        // 3. Cập nhật trạng thái trong DB dựa trên kết quả từ MoMo
        if (resultCode === 0) {
            // Thanh toán thành công
            order.paymentStatus = "Completed";
            await order.save();
            await updateProductStock(order.products);
            return res.json({
                message: "Thanh toán thành công. Đơn hàng đang được xử lý.",
                status: order.paymentStatus,
                order,
            });
        } else if (resultCode === 1000) {
            // Giao dịch chưa thanh toán
            return res.json({
                message: "Giao dịch chưa được thanh toán.",
                status: "Pending",
            });
        } else {
            // Thanh toán thất bại
            order.paymentStatus = "Failed";
            await order.save();
            await deleteOrderStautus(orderId);
            return res.json({
                message: `Thanh toán thất bại: ${message}`,
                status: order.paymentStatus,
            });
        }
    } catch (error) {
        console.error(
            "Lỗi khi kiểm tra và cập nhật trạng thái:",
            error.message
        );
        res.status(500).json({
            error: "Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.",
        });
    }
};

export const momoWebhook = async (req, res) => {
    try {
        const { orderId, resultCode } = req.body;

        // Kiểm tra trạng thái giao dịch
        if (resultCode === 0) {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = "Completed";
                await order.save();
                // console.log("Cập nhật trạng thái thanh toán thành công:", orderId);
            }
        } else {
            console.log("Giao dịch thất bại hoặc chưa hoàn tất:", orderId);
        }

        res.status(200).json({ message: "Webhook xử lý thành công" });
    } catch (error) {
        console.error("Lỗi xử lý webhook:", error.message);
        res.status(500).json({ error: "Lỗi xử lý webhook" });
    }
};

const updateProductStock = async (products) => {
    for (const item of products) {
        const { product, size, quantity } = item;

        // Tìm sản phẩm trong cơ sở dữ liệu
        const foundProduct = await Products.findById(product);
        if (!foundProduct) {
            throw new Error(`Sản phẩm không tồn tại: ${product}`);
        }

        // Tìm size tương ứng trong `sizeStock`
        const sizeInfo = foundProduct.sizeStock.find((stock) =>
            stock.size.equals(size)
        );
        if (!sizeInfo) {
            throw new Error(`Size không hợp lệ hoặc không tồn tại: ${size}`);
        }

        // Kiểm tra số lượng tồn kho
        if (sizeInfo.stock < quantity) {
            throw new Error(
                `Số lượng sản phẩm không đủ trong kho: ${product}, size: ${size}`
            );
        }

        // Trừ đi số lượng tồn kho
        sizeInfo.stock -= quantity;

        // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
        await foundProduct.save();
    }
};

const deleteOrderStautus = async (orderId, next) => {
    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại." });
        }

        return res
            .status(200)
            .json({ message: "Đơn hàng đã được xóa thành công." });
    } catch {
        console.error("Xóa đơn hàng thất bại");
    }
};
// Truy xuất đơn hàng
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("products.product")
            .populate("userId")
            .populate("products.size"); // Tìm đơn hàng trong cơ sở dữ liệu
        return res.status(200).json(orders); // Trả về đơn hàng
    } catch (error) {
        next(error);
    }
};
// Truy xuất chi tiết đơn hàng
export const getOrderDetail = async (req, res, next) => {
    try {
        const orderId = req.params.id; // Lấy orderId từ params

        const order = await Order.findById(orderId)
            .populate("products.product")
            .populate("products.size"); // Tìm đơn hàng theo ID và populate thông tin sản phẩm
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
        // console.log(orderId, status);

        // Kiểm tra xem trạng thái mới có hợp lệ không
        const validStatuses = [
            "Pending", //đang xử lý
            "Confirmed", // đã Xác nhận
            "Shipping", // đang vận chuyển
            // "Waitingdelivery", //Đang chờ giao hàng
            "Goodsreceived", //Đã nhận được hàng
            "Completed", //hoan thành
            "Cancelled", // hủy
            "Delivered", // Đã giao hàng
        ];
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

// lấy theo id user
export const getOrderDetailById = async (req, res, next) => {
    try {
        const userId = req.params.id; // Lấy user từ params
        // console.log(userId);
        const order = await Order.find({ userId: userId })
            .populate("products.product")
            .populate("products.size");
        const newOrders = await Promise.all(
            order.map(async (it) => {
                const products = await Promise.all(
                    it.products.map(async (x) => {
                        const isRated = await Comment.findOne({
                            userId,
                            productId: x.product._id,
                            orderId: it._id,
                        });

                        return {
                            ...x.toJSON(),
                            isRated: !!isRated,
                        };
                    })
                );

                return {
                    ...it.toJSON(),
                    products,
                };
            })
        );

        // console.log(order);
        // if (!order) {
        //   return res.status(404).json({ message: "Đơn hàng không tồn tại." });
        // }
        return res.status(200).json(newOrders); // Trả về chi tiết đơn hàng
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể lấy chi tiết đơn hàng." });
    }
};
export const updateStatusCancel = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Tìm đơn hàng
        const order = await Order.findById(req.params.id).session(session);
        // console.log(req.params.id);
        // console.log("order", order);

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Kiểm tra trạng thái đơn hàng
        if (order.status === "Cancelled") {
            return res
                .status(400)
                .json({ message: "Order has already been cancelled" });
        }
        if (order.status === "Shipping") {
            return res.status(400).json({
                message:
                    "Không thể hủy đơn hàng đang trong quá trình Vận chuyển",
            });
        }
        if (order.status === "Completed") {
            return res
                .status(400)
                .json({ message: "không thể hủy đơn hàng hoan thanhh" });
        }

        if (order.status === "Goodsreceived") {
            return res.status(400).json({
                message: "Không thể hủy đơn hàng đã được giao",
            });
        }
        if (order.status === "Delivered") {
            return res.status(400).json({
                message: "Không thể hủy đơn hàng đã được giao",
            });
        }
        // 2. Hoàn lại số lượng tồn kho cho từng sản phẩm
        for (const item of order.products) {
            const { product, size, quantity } = item;

            // Tìm sản phẩm
            const productDoc = await Products.findById(product).session(
                session
            );
            if (!productDoc)
                throw new Error(`Product with ID ${product} not found`);

            // Tìm size trong sizeStock của sản phẩm
            const sizeStockItem = productDoc.sizeStock.find(
                (stockItem) => stockItem.size.toString() === size.toString()
            );

            if (!sizeStockItem) {
                throw new Error(
                    `Size with ID ${size} not found in product ${product}`
                );
            }

            // Hoàn lại số lượng
            sizeStockItem.stock += quantity;

            // Lưu sản phẩm
            await productDoc.save({ session });
        }

        // 3. Cập nhật trạng thái đơn hàng
        order.status = "Cancelled";
        await order.save({ session });

        // 4. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Order cancelled and stock updated successfully",
        });
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();
        console.error("Error cancelling order:", error);
        return res
            .status(500)
            .json({ message: "Failed to cancel order", error: error.message });
    }
};
// update trang thái đã nhận hàng
export const updateStatusGoodsreceived = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Tìm đơn hàng
        const order = await Order.findById(req.params.id).session(session);
        console.log(order);

        if (!order) return res.status(404).json({ message: "Order not found" });

        // 2. Kiểm tra trạng thái đơn hàng
        if (order.status === "Cancelled") {
            return res
                .status(400)
                .json({ message: "Order has already been cancelled" });
        }

        // 3. Kiểm tra thời gian giao hàng
        const now = new Date();
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(now.getDate() - 2);

        if (order.status === "Delivered" && order.deliveredAt <= twoDaysAgo) {
            // Nếu đã giao hơn 2 ngày mà chưa được xác nhận, tự động cập nhật
            order.status = "Goodsreceived";
            await order.save({ session });

            // Commit transaction
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                message: "Order Goodsreceived automatically due to timeout",
            });
        }

        // 4. Nếu không phải trường hợp tự động, cập nhật theo yêu cầu
        order.status = "Goodsreceived";
        await order.save({ session });

        // Update the status to "Completed" after one minute
        setTimeout(async () => {
            order.status = "Completed";
            await order.save({ session });

            // Commit transaction
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                message: "Order Goodsreceived successfully",
            });
        }, 2000);
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();
        console.error("Error updating order status:", error);
        return res
            .status(500)
            .json({ message: "Failed to update order", error: error.message });
    }
};
