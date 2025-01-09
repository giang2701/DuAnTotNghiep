export const updateStatusCancel = async (req, res, next) => {
    try {
        // 1. Tìm đơn hàng
        const order = await Order.findById(req.params.id);
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
            const productDoc = await Products.findById(product);
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
            await productDoc.save();
        }

        // 3. Cập nhật trạng thái đơn hàng
        order.status = "Cancelled";
        await order.save();
        return res.status(200).json({
            message: "Order cancelled and stock updated successfully",
        });
    } catch (error) {
        // Rollback transaction nếu có lỗi

        console.error("Error cancelling order:", error);
        return res
            .status(500)
            .json({ message: "Failed to cancel order", error: error.message });
    }
};
// update trang thái đã nhận hàng
export const updateStatusGoodsreceived = async (req, res, next) => {
    try {
        // 1. Tìm đơn hàng
        const order = await Order.findById(req.params.id);
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
            await order.save();
            return res.status(200).json({
                message: "Order Goodsreceived automatically due to timeout",
            });
        }

        // 4. Nếu không phải trường hợp tự động, cập nhật theo yêu cầu
        order.status = "Goodsreceived";
        await order.save();

        // Update the status to "Completed" after one minute
        setTimeout(async () => {
            order.status = "Completed";
            await order.save();
            return res.status(200).json({
                message: "Order Goodsreceived successfully",
            });
        }, 2000);
    } catch (error) {
        console.error("Error updating order status:", error);
        return res
            .status(500)
            .json({ message: "Failed to update order", error: error.message });
    }
};
