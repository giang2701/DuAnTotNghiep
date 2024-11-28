import Voucher from "../model/Voucher.js";

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
        const { name, code, discount, expiryDate, type } = req.body;

        // Kiểm tra nếu mã đã tồn tại
        const existingCoupon = await Voucher.findOne({ code });
        if (existingCoupon)
            return res.status(400).json({ message: "Mã giảm giá đã tồn tại!" });

        // Chuyển đổi expiryDate từ chuỗi sang Date
        let formattedDate;
        if (expiryDate) {
            const [day, month, year] = expiryDate.split("/");
            formattedDate = new Date(`${year}-${month}-${day}`);
            if (isNaN(formattedDate)) {
                return res.status(400).json({
                    message:
                        "Ngày hết hạn không hợp lệ. Định dạng hợp lệ là DD/MM/YYYY.",
                });
            }
        }

        const coupon = new Voucher({
            name,
            code,
            type,
            discount,
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
        const coupon = await Voucher.findOne({ code, isActive: true });

        if (!coupon)
            return res
                .status(400)
                .json({ message: "Mã giảm giá không hợp lệ!" });
        if (new Date() > coupon.expiryDate)
            return res.status(400).json({ message: "Mã giảm giá đã hết hạn!" });
        res.status(200).json({
            message: "Mã giảm giá hợp lệ!",
            discount: coupon.discount,
            type: coupon.type, // Trả về loại giảm giá
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
