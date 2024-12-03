// Heart Controller
import Heart from "../model/Heart.js";

// Lấy dữ liệu giỏ hàng(Lấy dữ liệu) của 1 người dùng(mục đích đổ ra dữ liệu giỏ hàng cho người dung người dùng)
export const addLikeProduct = async (req, res, next) => {
    try {
        const {
            userId,
            productId
        } = req.body
        // Kiểm tra xem sản phẩm đã được yêu thích chưa
        const existingHeart = await Heart.findOne({ user: userId, product: productId });
        if (existingHeart) {
            return res.status(400).json({ message: "Sản phẩm đã có trong danh sách yêu thích" });
        }
        // Tạo mới bản ghi yêu thích
        const newHeart = new Heart({ user: userId, product: productId });
        await newHeart.save();
        res.status(201).json({
            message: ("Tim sản phẩm thành công", newHeart)
        });
    } catch (error) {
        console.error("Lỗi khi lấy thích sản phẩm:", error);
        return res
            .status(500)
            .json({
                message: "Lỗi máy chủ."
            });
    }
};

// Thêm sản phẩm vào giỏ hàng(add cart)
export const getHeartByIdUser = async (req, res, next) => {
    try {
        const heart = await Heart.find({ user: req.params.id }).populate("product")
        if (!heart) {
            return res.status(400).json({
                message: "Sản phẩm yêu thích không tồn tại",
            });
        }

        return res.status(200).json({
            message: "Lấy danh sách sản phẩm yêu thích thành công ",
            heart
        });
    } catch (error) {
        console.error(error); // Ghi lại lỗi để kiểm tra
        return res.status(500).json({
            message: "Lỗi máy chủ"
        });
    }
};
// Xóa giỏ hàng (remove cart)
export const deleteHeartByIdUser = async (req, res, next) => {
    try {
        const { userId, productId } = req.params;

        // Tìm và xóa tài liệu Heart (yêu thích) dựa trên userId và productId
        const heart = await Heart.findOneAndDelete({
            user: userId,
            product: productId,
        });

        // Kiểm tra nếu không tìm thấy sản phẩm yêu thích
        if (!heart) {
            return res.status(404).json({ message: "Sản phẩm chưa có trong danh sách yêu thích " });
        }
        // Thành công, trả về thông báo
        res.status(200).json({ message: "Sản phẩm đã bị xóa khỏi danh sách yêu thích", heart });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm sản phẩm yêu thích:", error);
        return res
            .status(500)
            .json({
                message: "Lỗi máy chủ. Không thể xóa sản phẩm."
            });
    }


};


