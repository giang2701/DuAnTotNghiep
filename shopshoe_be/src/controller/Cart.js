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
        const cart = await Cart.findOne({
            user: userId,
        }).populate("items.product");

        // if (!cart) {
        //     return res.status(404).json({
        //         message: "Giỏ hàng không tồn tại."
        //     });
        // }

        return res.status(200).json({
            cart,
        });
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return res.status(500).json({
            message: "Lỗi máy chủ. Không thể lấy giỏ hàng.",
        });
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
        if (!userId || !productId || !size || quantity === undefined) {
            return res.status(400).json({
                message: "Thiếu thông tin yêu cầu.",
            });
        }

        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại.",
            });
        }

        // Tìm giá và số lượng tồn kho tương ứng với size trong sizeStock
        const sizeInfo = product.sizeStock.find(
            (item) => item.size.toString() === size
        );

        if (!sizeInfo) {
            return res.status(400).json({
                message: "Size không hợp lệ hoặc không tồn tại.",
            });
        }

        const price = sizeInfo.price; // Lấy giá từ size cụ thể
        const availableStock = sizeInfo.stock; // Lấy số lượng tồn kho

        let cart = await Cart.findOne({
            user: userId,
        });

        // Nếu chưa có giỏ hàng, tạo mới
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
            });
        }

        // Tính số lượng sản phẩm hiện có trong giỏ hàng
        const existingItemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId &&
                item.size.toString() === size
        );

        let currentQuantity = 0;
        if (existingItemIndex > -1) {
            // Nếu sản phẩm đã tồn tại, lấy số lượng hiện tại
            currentQuantity = cart.items[existingItemIndex].quantity;
        }

        // Kiểm tra xem số lượng yêu cầu có vượt quá số lượng tồn kho không
        if (currentQuantity + quantity > availableStock) {
            return res.status(400).json({
                message: "Sản phẩm đã quá số lượng tồn kho.",
            });
        }

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

        // Tính tổng giá trị của giỏ hàng
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + item.quantity * item.price;
        }, 0);

        // Lưu giỏ hàng vào cơ sở dữ liệu
        await cart.save();

        return res.status(200).json({
            message: "Sản phẩm đã được thêm vào giỏ hàng.",
            cart,
        });
    } catch (error) {
        console.error(error); // Ghi lại lỗi để kiểm tra
        return res.status(500).json({
            message: "Lỗi máy chủ. Không thể thêm vào giỏ hàng.",
        });
    }
};

// Cập nhật giỏ hàng (update cart)
export const updateCart = async (req, res, next) => {
    try {
        const cartId = req.params.id;
        const { productId, size, quantity } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({
                message: "Giỏ hàng không tồn tại.",
            });
        }

        console.log(
            "Trạng thái giỏ hàng trước khi cập nhật:",
            JSON.stringify(cart, null, 2)
        );

        const itemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId &&
                item.size.toString() === size
        );

        if (itemIndex > -1) {
            // Nếu sản phẩm đã có, cập nhật số lượng
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
        } else {
            // Lấy giá sản phẩm từ cơ sở dữ liệu
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: "Sản phẩm không tồn tại.",
                });
            }

            if (quantity > 0) {
                cart.items.push({
                    product: productId,
                    size: size,
                    quantity: quantity,
                    price: product.price, // Sử dụng giá từ sản phẩm
                });
            } else {
                return res.status(400).json({
                    message: "Số lượng sản phẩm không hợp lệ.",
                });
            }
        }

        // Lưu giỏ hàng đã cập nhật và tính tổng giá
        await cart.save();

        console.log(
            "Trạng thái giỏ hàng sau khi cập nhật:",
            JSON.stringify(cart, null, 2)
        );

        return res.status(200).json({
            message: "Giỏ hàng đã được cập nhật.",
            cart,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        return res.status(500).json({
            message: "Lỗi máy chủ. Không thể cập nhật giỏ hàng.",
        });
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
            return res.status(404).json({
                message: "Giỏ hàng không tồn tại.",
            });
        }

        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Nếu sản phẩm tồn tại trong giỏ hàng, xóa nó
            cart.items.splice(itemIndex, 1); // Xóa sản phẩm
            await cart.save(); // Lưu giỏ hàng đã cập nhật
            return res.status(200).json({
                message: "Sản phẩm đã được xóa khỏi giỏ hàng.",
                cart,
            });
        } else {
            return res.status(404).json({
                message: "Sản phẩm không có trong giỏ hàng.",
            });
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        return res.status(500).json({
            message: "Lỗi máy chủ. Không thể xóa sản phẩm.",
        });
    }
};

export const deleteCart = async (req, res, next) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        if (!cart) throw new ApiError(404, "Cart Not Found");
        res.status(StatusCodes.OK).json({
            message: "Delete Cart Done",
        });
    } catch (error) {
        next(error);
    }
};
