import Category from "../model/Category.js";
import Products from "../model/Products.js";
import Older from "../model/Older.js";
import Cart from "../model/Cart.js";
import FlashSale from "../model/FlashSale.js";
export const createProduct = async (req, res, next) => {
    try {
        console.log("createProduct");
        console.log("Request Body:", req.body);
        // Kiểm tra và upload ảnh danh mục (nếu có)
        let imgCategoryUrls = [];
        if (req.body.imgCategory && Array.isArray(req.body.imgCategory)) {
            // Giả sử mỗi ảnh đã được upload từ frontend và là URL hợp lệ
            imgCategoryUrls = req.body.imgCategory; // Nhận URL các ảnh danh mục từ request
        }

        // Tạo sản phẩm mới với các ảnh danh mục
        const data = await Products.create({
            ...req.body,
            imgCategory: imgCategoryUrls, // Lưu URL các ảnh danh mục vào DB
            sizes: req.body.sizes,
        });

        // Cập nhật danh mục liên quan
        const updateCategory = await Category.findByIdAndUpdate(
            req.body.category,
            { $push: { products: data._id } },
            { new: true }
        );

        if (data && updateCategory) {
            return res.status(201).json({
                success: true,
                data,
                message: "Tạo sản phẩm thành công!",
            });
        }
    } catch (error) {
        console.error("Error creating product:", error);
        next(error);
    }
};

export const updateProductById = async (req, res, next) => {
    try {
        // // Kiểm tra và lưu đường dẫn file ảnh vào cơ sở dữ liệu
        // if (req.file) {
        //     req.body.images = req.file.path; // Lưu đường dẫn của tệp hình ảnh
        // }
        console.log(req.body);
        const data = await Products.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                sizes: req.body.sizes, // Cập nhật lại mảng sizes từ body
            },
            {
                new: true,
            }
        );

        if (data) {
            return res.status(200).json({
                message: "Update san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const removeProductById = async (req, res, next) => {
    try {
        const orderProducts = await Older.find({
            products: { $elemMatch: { product: req.params.id } },
        });

        console.log(orderProducts);
        // Kiểm tra nếu có đơn hàng đang sử dụng sản phẩm này
        if (orderProducts.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Không thể xóa sản phẩm vì đang được sử dụng trong đơn hàng!",
            });
        }
        const CartProducts = await Cart.find({
            items: { $elemMatch: { product: req.params.id } },
        });

        console.log(orderProducts);
        // Kiểm tra nếu có đơn hàng đang sử dụng sản phẩm này
        if (CartProducts.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Không thể xóa sản phẩm vì đang được sử dụng trong giỏ hàng",
            });
        }
        const data = await Products.findByIdAndDelete(req.params.id);
        if (data) {
            return res.status(200).json({
                message: "Remove san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const data = await Products.findById(req.params.id)
            .populate("category")
            .populate("brand")
            .populate("flashSale");
        // console.log(data);
        if (data) {
            return res.status(200).json({
                message: "Tim san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};
export const getProductByIdSize = async (req, res, next) => {
    try {
        const data = await Products.findById(req.params.id)
            .populate("sizeStock.size") // đảm bảo tên đúng và có mô hình tương ứng
            .exec();

        if (!data) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại!",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Tìm sản phẩm thành công!",
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};
export const getAllProducts = async (req, res, next) => {
    try {
        const data = await Products.find()
            .populate("category")
            .populate("brand")
            .populate("flashSale");
        if (data) {
            return res.status(200).json({
                message: "Lay san pham thanh cong!",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};
// Hàm cập nhật trạng thái active/deactive của products
export const updateProductsStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const data = await Products.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );
        console.log("Trang thai moi cua Products:", isActive);
        if (data) {
            return res.status(200).json({
                message: "Cap nhat trang thai Products thanh cong",
                success: true,
                data,
            });
        }
    } catch (error) {
        next(error);
    }
};

// export const updateProductWithFlashSale = async (req, res, next) => {
//     try {
//         const productId = req.params.id;
//         const { flashSale } = req.body;

//         // Kiểm tra flashSale có tồn tại hay không
//         const flashSaleRecord = await FlashSale.findById(flashSale);
//         if (!flashSaleRecord) {
//             return res.status(404).json({
//                 message: "Flash Sale không tồn tại.",
//                 success: false,
//             });
//         }

//         // Kiểm tra nếu Flash Sale đã hết hạn
//         const now = new Date();
//         if (new Date(flashSaleRecord.endDate) < now) {
//             return res.status(400).json({
//                 message: "Flash Sale đã hết hạn, không thể áp dụng.",
//                 success: false,
//             });
//         }

//         // Kiểm tra xem sản phẩm đã có Flash Sale nào đang áp dụng chưa
//         const existingProduct = await Products.findById(productId);
//         if (existingProduct.flashSale) {
//             return res.status(400).json({
//                 message: "Sản phẩm đã có mã Flash Sale đang áp dụng.",
//                 success: false,
//             });
//         }



//         // Cập nhật sản phẩm với ID flashSale
//         const updatedProduct = await Products.findByIdAndUpdate(
//             productId,
//             { flashSale },
//             { new: true }
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 message: "Không tìm thấy sản phẩm.",
//                 success: false,
//             });
//         }

//         // Sau khi cập nhật Flash Sale, tính toán giá sản phẩm
//         const product = await Products.findById(productId).populate("flashSale");

//         if (!product) {
//             return res.status(404).json({
//                 message: "Không có sản phẩm tương ứng.",
//                 success: false,
//             });
//         }


//         let finalPrice = product.price;
//         let isFlashSaleActive = false;
//         let updatedSizeStock = [...product.sizeStock];

//         if (product.flashSale) {
//             const { startDate, endDate, discountPercent, isActive } = product.flashSale;
//             if (isActive && now >= new Date(startDate) && now <= new Date(endDate)) {
//                 isFlashSaleActive = true;
//                 updatedSizeStock = updatedSizeStock.map(sizeStock => {
//                     const discountedPrice = sizeStock.price * (1 - discountPercent / 100);
//                     return {
//                         size: sizeStock.size,
//                         stock: sizeStock.stock,
//                         price: sizeStock.price,
//                         salePrice: discountedPrice.toFixed(2)
//                     };
//                 });
//                 finalPrice = product.price * (1 - discountPercent / 100);
//             }
//         }

//         // Cập nhật sản phẩm với sizeStock đã tính giá giảm
//         const finalProduct = await Products.findByIdAndUpdate(
//             productId,
//             {
//                 sizeStock: updatedSizeStock,
//                 salePrice: isFlashSaleActive ? finalPrice.toFixed(2) : null,
//             },
//             { new: true }
//         );

//         res.status(200).json({
//             message: "Cập nhật Flash Sale và tính giá thành công.",
//             success: true,
//             data: finalProduct,
//         });

//     } catch (error) {
//         next(error);
//     }
// };

// hết hạn thì sẽ update flashsale khỏi sản phẩm đã hết hạn hoặc để flashsale là (null)
export const updateExpiredFlashSales = async () => {
    try {
        // Lấy ngày hiện tại
        const currentDate = new Date();

        // Tìm tất cả Flash Sale đã hết hạn
        const expiredFlashSales = await FlashSale.find({
            endDate: { $lt: currentDate },
        });

        // Cập nhật giá cho các sản phẩm có Flash Sale đã hết hạn
        for (const flashSale of expiredFlashSales) {
            const products = await Products.find({ flashSale: flashSale._id });

            for (const product of products) {
                // Đặt giá và xóa Flash Sale cho từng sản phẩm
                const updatedSizeStock = product.sizeStock.map((size) => ({
                    ...size,
                    salePrice: null, // Xóa giá giảm
                }));

                product.flashSale = null;
                product.salePrice = null;
                product.sizeStock = updatedSizeStock;
                await product.save();
            }

            // Đánh dấu Flash Sale là không hoạt động
            flashSale.isActive = false;
            await flashSale.save();
        }

        console.log("Cập nhật sản phẩm và Flash Sale đã hết hạn thành công.");
    } catch (error) {
        console.error("Error updating expired Flash Sales:", error);
    }
};


export const updateProductWithFlashSale = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { flashSale } = req.body;

        // Kiểm tra flashSale có tồn tại hay không
        const flashSaleRecord = await FlashSale.findById(flashSale);
        if (!flashSaleRecord) {
            return res.status(404).json({
                message: "Flash Sale không tồn tại.",
                success: false,
            });
        }

        // Kiểm tra nếu Flash Sale đã hết hạn
        const now = new Date();
        if (new Date(flashSaleRecord.endDate) < now) {
            return res.status(400).json({
                message: "Flash Sale đã hết hạn, không thể áp dụng.",
                success: false,
            });
        }

        // Kiểm tra xem sản phẩm đã có Flash Sale nào đang áp dụng chưa
        const existingProduct = await Products.findById(productId);
        if (existingProduct.flashSale) {
            return res.status(400).json({
                message: "Sản phẩm đã có mã Flash Sale đang áp dụng.",
                success: false,
            });
        }

        // Cập nhật sản phẩm với ID flashSale
        const updatedProduct = await Products.findByIdAndUpdate(
            productId,
            { flashSale },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm.",
                success: false,
            });
        }

        // Sau khi cập nhật Flash Sale, tính toán giá sản phẩm
        const product = await Products.findById(productId).populate("flashSale");

        if (!product) {
            return res.status(404).json({
                message: "Không có sản phẩm tương ứng.",
                success: false,
            });
        }

        let finalPrice = product.price;
        // let salePrice = product.price
        let isFlashSaleActive = false;
        let updatedSizeStock = [...product.sizeStock];

        // Kiểm tra Flash Sale và áp dụng giá nếu điều kiện thỏa mãn
        if (product.flashSale) {
            const { startDate, endDate, discountPercent, isActive } = product.flashSale;

            // Kiểm tra nếu Flash Sale chưa bắt đầu
            if (now < new Date(startDate)) {
                // Nếu chưa đến ngày bắt đầu Flash Sale, giữ giá cũ
                finalPrice = product.price;
                // salePrice = product.price
            } else if (isActive && now >= new Date(startDate) && now <= new Date(endDate)) {
                // Nếu Flash Sale đang diễn ra, áp dụng giảm giá
                isFlashSaleActive = true;
                updatedSizeStock = updatedSizeStock.map(sizeStock => {
                    const discountedPrice = sizeStock.price * (1 - discountPercent / 100);
                    return {
                        size: sizeStock.size,
                        stock: sizeStock.stock,
                        price: sizeStock.price,
                        salePrice: discountedPrice.toFixed(2)
                    };
                });
                finalPrice = product.price * (1 - discountPercent / 100);
            }
        }

        // Cập nhật sản phẩm với sizeStock đã tính giá giảm
        const finalProduct = await Products.findByIdAndUpdate(
            productId,
            {
                sizeStock: updatedSizeStock,
                salePrice: isFlashSaleActive ? finalPrice.toFixed(2) : null,
            },
            { new: true }
        );

        res.status(200).json({
            message: "Cập nhật Flash Sale và tính giá thành công.",
            success: true,
            data: finalProduct,
        });

    } catch (error) {
        next(error);
    }
};

// Lấy danh sách sản phẩm có Flash Sale
export const getFlashSaleProducts = async (req, res, next) => {
    try {
        const data = await Products.find({ flashSale: { $ne: null } })
            .populate("flashSale");

        if (data.length === 0) {
            return res.status(404).json({
                message: "Không có sản phẩm nào đang áp dụng Flash Sale.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Lấy danh sách sản phẩm Flash Sale thành công!",
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching Flash Sale products:", error);
        next(error);
    }
};

export const applyFlashSaleToMultipleProducts = async (req, res, next) => {
    try {
        const { productIds, flashSaleId } = req.body;

        // Kiểm tra Flash Sale có tồn tại không
        const flashSale = await FlashSale.findById(flashSaleId);
        if (!flashSale) {
            return res.status(404).json({ message: "Flash Sale không tồn tại!" });
        }

        const now = new Date();
        if (new Date(flashSale.endDate) < now) {
            return res.status(400).json({ message: "Flash Sale đã hết hạn!" });
        }

        // Lấy danh sách sản phẩm
        const products = await Products.find({ _id: { $in: productIds } });

        // Cập nhật giá sale
        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                // Cập nhật giá từng size
                const updatedSizeStock = product.sizeStock.map((size) => ({
                    ...size,
                    salePrice: size.price * (1 - flashSale.discountPercent / 100), // Áp dụng giảm giá cho từng size
                }));

                // Tính giá thấp nhất trong các size
                const lowestSalePrice = Math.min(...updatedSizeStock.map((size) => size.salePrice));

                // Cập nhật sản phẩm
                product.sizeStock = updatedSizeStock;
                product.flashSale = flashSaleId;
                product.salePrice = lowestSalePrice; // Cập nhật giá sale của sản phẩm
                product.price = Math.min(...product.sizeStock.map((size) => size.price)); // Cập nhật giá gốc (giá nhỏ nhất trong các size)

                return await product.save();
            })
        );


        res.status(200).json({
            message: "Áp dụng Flash Sale thành công!",
            success: true,
            data: updatedProducts,
        });
    } catch (error) {
        console.error("Error applying Flash Sale:", error);
        next(error);
    }
};


