import FlashSale from "../model/FlashSale.js";
import moment from "moment-timezone";
import Products from "../model/Products.js";

export const createFlashSale = async (req, res, next) => {
    try {
        const { title, discountPercent, startDate, endDate, type } = req.body;
        console.log(req.body);

        // Lấy ngày hiện tại theo múi giờ Việt Nam
        const currentDate = moment.tz("Ho_Chi_Minh").startOf("day");


        // Kiểm tra các Flash Sale đang hoạt động
        const activeFlashSales = await FlashSale.find({
            $or: [
                { endDate: { $gte: new Date() } }, // Flash Sale chưa hết hạn
                { isActive: true } // Flash Sale đang hoạt động
            ]
        });

        if (activeFlashSales.length > 0) {
            return res.status(400).json({
                message: "Không thể tạo Flash Sale mới. Vui lòng đợi Flash Sale hiện tại hết hạn hoặc bị xóa.",
                success: false,
            });
        }

        // Kiểm tra và chuyển đổi ngày bắt đầu
        let StartDate;
        if (startDate) {
            StartDate = moment.tz(startDate, ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm"], "Ho_Chi_Minh");
            if (!StartDate.isValid()) {
                return res.status(400).json({
                    message: "Ngày bắt đầu không hợp lệ. Định dạng hợp lệ là DD/MM/YYYY hoặc YYYY-MM-DDTHH:mm.",
                });
            }
            if (StartDate.isBefore(currentDate)) {
                return res.status(400).json({
                    message: "Ngày bắt đầu không được nhỏ hơn ngày hiện tại.",
                });
            }
            StartDate = StartDate.toDate();
        }


        // Kiểm tra và chuyển đổi ngày kết thúc
        let EndDate;
        if (endDate) {
            EndDate = moment.tz(endDate, ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm"], "Ho_Chi_Minh");
            if (!EndDate.isValid()) {
                return res.status(400).json({
                    message: "Ngày kết thúc không hợp lệ. Định dạng hợp lệ là DD/MM/YYYY hoặc YYYY-MM-DDTHH:mm.",
                });
            }
            EndDate = EndDate.toDate();
        }

        // Kiểm tra ngày bắt đầu phải nhỏ hơn ngày kết thúc
        if (StartDate && EndDate && StartDate > EndDate) {
            return res.status(400).json({
                message: "Ngày bắt đầu phải trước ngày kết thúc.",
            });
        }

        // Tạo mới flash sale
        const flashSale = new FlashSale({
            title,
            discountPercent,
            startDate: StartDate,
            endDate: EndDate,
            type,
        });

        // Lưu vào cơ sở dữ liệu
        const savedFlashSale = await flashSale.save();
        res.status(201).json({
            message: "Tạo FlashSale thành công.",
            success: true,
            data: savedFlashSale,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllFlashSales = async (req, res, next) => {
    try {
        // Lấy tất cả Flash Sale
        const flashSales = await FlashSale.find();

        // Kiểm tra từng Flash Sale và cập nhật trạng thái nếu đã hết hạn
        const now = new Date();
        const expiredFlashSales = flashSales.filter(flashSale => new Date(flashSale.endDate) < now);

        if (expiredFlashSales.length > 0) {
            // Cập nhật trạng thái isActive thành false cho các Flash Sale đã hết hạn
            await Promise.all(
                expiredFlashSales.map(flashSale =>
                    FlashSale.updateOne({ _id: flashSale._id }, { isActive: false })
                )
            );
        }

        // Lấy danh sách Flash Sale sau khi cập nhật
        const updatedFlashSales = await FlashSale.find();

        res.status(200).json({
            message: "Lấy FlashSale thành công",
            success: true,
            data: updatedFlashSales,
        });

    } catch (error) {
        next(error);
    }
};



export const getFlashSaleById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const flashSale = await FlashSale.findById(id);
        if (!flashSale) {
            return res.status(404).json({
                message: "Flash Sale not found.",
                success: false,
            });
        }

        res.status(200).json({
            message: "Flash Sale fetched successfully.",
            success: true,
            data: flashSale,
        });
    } catch (error) {
        next(error);
    }
};

export const updateFlashSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.body; // Lấy giá trị từ req.body
        const updates = req.body;



        // Kiểm tra và chuyển đổi ngày bắt đầu
        let StartDate;
        if (startDate) {
            StartDate = moment.tz(startDate, ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm"], "Ho_Chi_Minh");
            if (!StartDate.isValid()) {
                return res.status(400).json({
                    message: "Ngày bắt đầu không hợp lệ. Định dạng hợp lệ là DD/MM/YYYY hoặc YYYY-MM-DDTHH:mm.",
                    success: false,
                });
            }

            const currentDate = moment.tz("Asia/Ho_Chi_Minh").startOf("day");
            if (StartDate.isBefore(currentDate)) {
                return res.status(400).json({
                    message: "Ngày bắt đầu không được nhỏ hơn ngày hiện tại.",
                    success: false,
                });
            }

            // Chuyển đổi StartDate thành Date hợp lệ trước khi lưu
            updates.startDate = StartDate.toDate(); // Chuyển đổi thành Date hợp lệ
        }

        // Kiểm tra và chuyển đổi ngày kết thúc
        let EndDate;
        if (endDate) {
            EndDate = moment.tz(endDate, ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm"], "Ho_Chi_Minh");
            if (!EndDate.isValid()) {
                return res.status(400).json({
                    message: "Ngày kết thúc không hợp lệ. Định dạng hợp lệ là DD/MM/YYYY hoặc YYYY-MM-DDTHH:mm.",
                    success: false,
                });
            }

            // Chuyển đổi EndDate thành Date hợp lệ trước khi lưu
            updates.endDate = EndDate.toDate(); // Chuyển đổi thành Date hợp lệ
        }

        // Cập nhật dữ liệu flash sale
        const updatedFlashSale = await FlashSale.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedFlashSale) {
            return res.status(404).json({
                message: "Flash Sale not found.",
                success: false,
            });
        }

        res.status(200).json({
            message: "Flash Sale updated successfully.",
            success: true,
            data: updatedFlashSale,
        });
    } catch (error) {
        next(error);
    }
};


export const updateFlashSaleStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const data = await FlashSale.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );
        console.log("Trang thai moi cua FlashSale:", isActive);
        if (data) {
            return res.status(200).json({
                message: "Cap nhat trang thai FlashSale thanh cong",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteFlashSale = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Xóa Flash Sale
        const deletedFlashSale = await FlashSale.findByIdAndDelete(id);
        console.log(id)
        if (!deletedFlashSale) {
            return res.status(404).json({
                message: "Flash Sale not found.",
                success: false,
            });
        }

        // Tìm tất cả sản phẩm áp dụng Flash Sale này
        const products = await Products.find({ "flashSale": id });

        for (const product of products) {
            // Cập nhật thông tin các size của sản phẩm
            for (const size of product.sizeStock) {
                if (size.flashSale?.toString() === id) {
                    // Đặt lại giá gốc và xóa salePrice
                    size.salePrice = null; // Xóa salePrice
                }
            }

            // Cập nhật thông tin sản phẩm
            product.flashSale = null;
            product.salePrice = null;

            await product.save();
        }

        res.status(200).json({
            message: "Flash Sale deleted successfully, and products updated.",
            success: true,
            data: deletedFlashSale,
        });
    } catch (error) {
        next(error);
    }
};

