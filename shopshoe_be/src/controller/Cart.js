// Cart Controller
import Cart from "../model/Cart.js";
import Product from "../model/Products.js";
// Lấy dữ liệu giỏ hàng(Lấy dữ liệu) của nhiều người dùng(mục đích để quản lý cart người dùng)
export const getAllCarts = async (req, res, next) => {
    try {
        const carts = await Cart.find().populate("items.product");
        res.status(200).json(carts); // Sử dụng 200 OK thay cho StatusCodes.OK
    } catch (error) {
        next(error); // Chuyển tiếp lỗi
    }
};
// Lấy dữ liệu giỏ hàng(Lấy dữ liệu) của 1 người dùng(mục đích đổ ra dữ liệu giỏ hàng cho người dung người dùng)
export const getCartIdUser = async (req, res, next) => {
    try {
        const { id: userId } = req.params; // Lấy userId từ params
        const cart = await Cart.findOne({ user: userId }).populate(
            "items.product"
        );

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể lấy giỏ hàng." });
    }
};
export const getCartDetail = async (req, res, next) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) throw new ApiError(404, "Cart Not Found");
        return res.status(200).json({
            success: true,
            message: "Get Cart Detail Success",
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};
// Thêm sản phẩm vào giỏ hàng(add cart)
export const AddToCart = async (req, res, next) => {
    try {
        const { userId, productId, size, quantity } = req.body;
        // Kiểm tra dữ liệu đầu vào
        if (!userId || !productId || !size || !quantity) {
            return res
                .status(400)
                .json({ message: "Thiếu thông tin yêu cầu." });
        }
        // Tìm sản phẩm trong cơ sở dữ liệu để lấy giá theo size
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại." });
        }

        // Tìm giá tương ứng với size trong sizeStock
        const sizeInfo = product.sizeStock.find(
            (item) => item.size.toString() === size
        );

        if (!sizeInfo) {
            return res
                .status(400)
                .json({ message: "Size không hợp lệ hoặc không tồn tại." });
        }

        const price = sizeInfo.price; // Lấy giá từ size cụ thể
        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ user: userId });

        // Nếu chưa có giỏ hàng, tạo mới
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng với size cụ thể
        // hàm này giúp so sánh ID user với ID người dùng trong
        // giỏ hàng và ID sản size  với size của sản phẩm trong giỏ hàng.
        // nếu khác nhau(không tìm thấy id sản phẩm và size) thì findIndex sẽ trả giá trị là -1 ,giống thì trả về khác  -1
        const existingItemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId &&
                item.size.toString() === size
        );

        if (existingItemIndex > -1) {
            // Sản phẩm đã tồn tại, tăng số lượng
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            cart.items.push({
                product: productId,
                size: size,
                quantity: quantity,
                price: price,
            });
        }

        // Lưu giỏ hàng vào cơ sở dữ liệu
        await cart.save();
        // // Tính tổng giá trị của giỏ hàng
        // cart.totalPrice = cart.items.reduce((total, item) => {
        //     return total + item.quantity * item.price;
        // }, 0);
        return res
            .status(200)
            .json({ message: "Sản phẩm đã được thêm vào giỏ hàng.", cart });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể thêm vào giỏ hàng." });
    }
};
// Cập nhật giỏ hàng (update cart)
export const updateCart = async (req, res, next) => {
    try {
        const cartId = req.params.id; // Lấy cartId từ params
        console.log(cartId);
        const { productId, quantity } = req.body; // Lấy productId và quantity từ body

        // Tìm giỏ hàng theo ID
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
        }

        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            if (quantity <= 0) {
                // Nếu số lượng <= 0, có thể xóa sản phẩm khỏi giỏ hàng
                cart.items.splice(itemIndex, 1); // Xóa sản phẩm
            } else {
                // Cập nhật số lượng
                cart.items[itemIndex].quantity += quantity;
            }
        } else {
            return res
                .status(404)
                .json({ message: "Sản phẩm không có trong giỏ hàng." });
        }

        // Lưu giỏ hàng đã cập nhật vào cơ sở dữ liệu
        await cart.save();

        return res
            .status(200)
            .json({ message: "Giỏ hàng đã được cập nhật.", cart });
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể cập nhật giỏ hàng." });
    }
};

// Xóa giỏ hàng (remove cart)
export const removeCart = async (req, res, next) => {
    try {
        const cartId = req.params.id; // Lấy cartId từ params
        const { productId } = req.body; // Lấy productId từ body

        // Tìm giỏ hàng theo ID
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
        }

        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Nếu sản phẩm tồn tại trong giỏ hàng, xóa nó
            cart.items.splice(itemIndex, 1); // Xóa sản phẩm
            await cart.save(); // Lưu giỏ hàng đã cập nhật
            return res
                .status(200)
                .json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng.", cart });
        } else {
            return res
                .status(404)
                .json({ message: "Sản phẩm không có trong giỏ hàng." });
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        return res
            .status(500)
            .json({ message: "Lỗi máy chủ. Không thể xóa sản phẩm." });
    }
};