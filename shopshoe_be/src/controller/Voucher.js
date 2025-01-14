import Voucher from "../model/Voucher.js";
import moment from "moment-timezone";
export const GetVoucher = async (req, res, next) => {
    try {
        const data = await Voucher.find();
        if (data) {
            return res.status(200).json({
                message: "Lay danh sach thanh cong",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};
export const GetVoucherDetail = async (req, res, next) => {
    try {
        const data = await Voucher.findById(req.params.id);
        if (data) {
            return res.status(200).json({
                message: "Lay danh sach thanh cong",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};
export const CreateVoucher = async (req, res, next) => {
    try {
        const { name, code, discount, expiryDate, type, minPrice } = req.body;

        // Kiểm tra nếu mã đã tồn tại
        const existingCoupon = await Voucher.findOne({ code });
        if (existingCoupon)
            return res.status(400).json({ message: "Mã giảm giá đã tồn tại!" });

        // Chuyển đổi expiryDate từ chuỗi sang Date
        let formattedDate;
        if (expiryDate) {
            formattedDate = moment.tz(
                expiryDate,
                ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm"],
                "Ho_Chi_Minh"
            );
            if (isNaN(formattedDate)) {
                return res.status(400).json({
                    message:
                        "Ngày hết hạn không hợp lệ. Định dạng hợp lệ là DD/MM/YYYY.",
                });
            }
        }

        // Kiểm tra nếu ngày hết hạn nhỏ hơn ngày hiện tại
        const currentDate = moment.tz(new Date(), "Ho_Chi_Minh"); // Ngày hiện tại
        if (!formattedDate.isSameOrAfter(currentDate, "day")) {
            // Kiểm tra ngày hết hạn >= ngày hiện tại
            return res.status(400).json({
                message: "Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại.",
            });
        }

        const coupon = new Voucher({
            name,
            code,
            type,
            discount,
            minPrice,
            expiryDate: formattedDate, // Sử dụng ngày đã chuyển đổi
        });

        await coupon.save();
        res.status(201).json({
            message: "Mã giảm giá được tạo thành công!",
            coupon,
        });
    } catch (err) {
        res.status(500).json({ message: "Có lỗi xảy ra!", error: err.message });
    }
};

export const verify = async (req, res, next) => {
    try {
        const { code } = req.body;

        // Tìm mã giảm giá và kiểm tra trạng thái
        const coupon = await Voucher.findOne(
            { code, isActive: true },
            { expiryDate: 1, discount: 1, type: 1 }
        );

        if (!coupon)
            return res.status(400).json({ message: "Mã giảm giá không hợp lệ!" });

        // So sánh ngày hết hạn
        const currentDate = moment().tz("Asia/Ho_Chi_Minh").startOf("day");
        const expiryDate = moment(coupon.expiryDate).tz("Asia/Ho_Chi_Minh").startOf("day");

        if (currentDate.isAfter(expiryDate))
            return res.status(400).json({ message: "Mã giảm giá đã hết hạn!" });

        // Trả về dữ liệu nếu hợp lệ
        res.status(200).json({
            message: "Mã giảm giá hợp lệ!",
            discount: coupon.discount,
            type: coupon.type,
        });
    } catch (error) {
        next(error);
    }
};

export const updateVoucherStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const data = await Voucher.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );
        console.log("Trang thai moi cua Voucher:", isActive);
        if (data) {
            return res.status(200).json({
                message: "Cap nhat trang thai voucher thanh cong",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};
export const DeleteVoucher = async (req, res, next) => {
    try {
        const data = await Voucher.findByIdAndDelete(req.params.id);
        if (data) {
            return res.status(200).json({
                message: "Xoa voucher thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateVoucher = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID voucher từ params
        const { name, code, discount, expiryDate, type, minPrice, isActive } =
            req.body;

        // Kiểm tra nếu voucher tồn tại
        const existingVoucher = await Voucher.findById(id);
        if (!existingVoucher) {
            return res.status(404).json({ message: "Voucher không tồn tại!" });
        }

        // Nếu có ngày hết hạn, kiểm tra định dạng và tính hợp lệ
        if (expiryDate) {
            const formattedDate = moment.tz(
                expiryDate,
                ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm"],
                "Ho_Chi_Minh"
            );

            // Kiểm tra định dạng ngày hợp lệ
            if (!formattedDate.isValid()) {
                return res.status(400).json({
                    message:
                        "Ngày hết hạn không hợp lệ. Định dạng hợp lệ là DD/MM/YYYY.",
                });
            }

            // Kiểm tra nếu ngày hết hạn nhỏ hơn ngày hiện tại
            const currentDate = moment.tz(new Date(), "Ho_Chi_Minh");
            if (!formattedDate.isSameOrAfter(currentDate, "day")) {
                return res.status(400).json({
                    message:
                        "Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại.",
                });
            }

            existingVoucher.expiryDate = formattedDate.toDate();
        }

        // Cập nhật các trường khác
        existingVoucher.name = name || existingVoucher.name;
        existingVoucher.code = code || existingVoucher.code;
        existingVoucher.discount = discount || existingVoucher.discount;
        existingVoucher.type = type || existingVoucher.type;
        existingVoucher.minPrice = minPrice || existingVoucher.minPrice;
        existingVoucher.isActive =
            isActive !== undefined ? isActive : existingVoucher.isActive;

        // Lưu voucher đã cập nhật
        const updatedVoucher = await existingVoucher.save();

        return res.status(200).json({
            message: "Cập nhật voucher thành công!",
            voucher: updatedVoucher,
        });
    } catch (error) {
        next(error);
    }
};
