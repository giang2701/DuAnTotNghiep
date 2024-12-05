import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { CartItem } from "../interface/Products";
import axios from "axios";
import Loading from "../component/Loading";

interface CartContextType {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number, size: string) => void;
    getTotalPrice: () => string | number | never[];
    fetchCart: () => void;
    totalItems: number | string | never[];
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<{ _id: string } | undefined>(undefined);
    const [IDCart, setIDCart] = useState<{ _id: string } | undefined | "">(
        undefined
    );

    useEffect(() => {
        // Hàm xử lý khi có sự thay đổi trong localStorage
        const handleStorageChange = () => {
            const userFromLocalStorage = localStorage.getItem("user");
            if (userFromLocalStorage) {
                setUser(JSON.parse(userFromLocalStorage)); // Cập nhật lại state user
            } else {
                setLoading(false); // Nếu không có user, có thể đánh dấu đã tải xong
            }
        };

        // Lấy thông tin user từ localStorage khi component mount
        const userFromLocalStorage = localStorage.getItem("user");
        if (userFromLocalStorage) setUser(JSON.parse(userFromLocalStorage));
        else setLoading(false);

        // Lắng nghe sự kiện thay đổi trong localStorage
        window.addEventListener("storage", handleStorageChange);

        // Thêm một lắng nghe sự thay đổi trong localStorage của tab hiện tại
        const handleLocalStorageChange = () => {
            const userFromLocalStorage = localStorage.getItem("user");
            if (userFromLocalStorage) {
                setUser(JSON.parse(userFromLocalStorage)); // Cập nhật lại state user ngay khi thay đổi
            } else {
                setLoading(false); // Nếu không có user, đánh dấu là không có người dùng
            }
        };

        // Lắng nghe sự thay đổi trong localStorage của tab hiện tại (khi localStorage thay đổi trong cùng một tab)
        window.localStorage.setItem = new Proxy(window.localStorage.setItem, {
            apply(target, thisArg, args: [string, string]) {
                const result = target.apply(thisArg, args);
                if (args[0] === "user") handleLocalStorageChange(); // Nếu key là "user", gọi hàm cập nhật state
                return result;
            },
        });

        // Cleanup event listener khi component unmount
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            // Gỡ bỏ proxy khi không cần thiết nữa
            window.localStorage.setItem = window.localStorage.__proto__.setItem;
        };
    }, []);

    // lấy danh dách giỏ hàng giựa id của người dùng
    const fetchCart = async () => {
        if (user) {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/cart/user/${user._id}`
                );
                const userCart = response.data.cart;
                setIDCart(userCart._id);
                setCart(userCart.items || []);
            } catch (error) {
                // console.error("Lỗi khi lấy giỏ hàng từ MongoDB:", error);
                setCart([]);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && user._id) {
            fetchCart();
        }
    }, [user?._id]);

    // xóa sản phẩm có trong giỏ hàng
    const removeFromCart = async (productId: string) => {
        if (!user) {
            alert("Bạn cần đăng nhập để xóa sản phẩm!");
            return;
        }
        try {
            if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
                const response = await axios.delete(
                    `http://localhost:8000/api/cart/${IDCart}`,
                    { data: { productId } }
                );

                if (response.status === 200) fetchCart();
                else alert("Xóa sản phẩm không thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
            alert("Đã có lỗi xảy ra khi xóa sản phẩm.");
        }
    };

    // sửa sl sản phẩm
    const updateQuantity = async (
        productId: string,
        quantity: number,
        size: string
    ) => {
        if (!user || quantity < 1) return;
        console.log(
            "Updating quantity for product:",
            productId,
            "with quantity:",
            quantity,
            "and size:",
            size
        );
        try {
            const response = await axios.put(
                `http://localhost:8000/api/cart/${IDCart}`,
                { productId, size, quantity }
            );
            if (response.status === 200) {
                fetchCart(); // làm mới giỏ hàng
            } else {
                alert("Cập nhật số lượng không thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
            alert(
                "Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau."
            );
        }
    };

    const getTotalPrice = () => {
        if (!cart || !Array.isArray(cart)) return 0;

        const total = cart.reduce((acc, item) => {
            const price = item.price || item.product.price; // Sử dụng giá theo size nếu có
            return acc + price * item.quantity;
        }, 0);

        return total;
    };
    // hàm tính số lượng hiển thị lên icon
    const totalItems = Array.isArray(cart)
        ? cart.reduce((acc, item, index) => {
              if (
                  cart.findIndex(
                      (i) =>
                          i.product._id === item.product._id &&
                          i.size === item.size
                  ) === index
              ) {
                  return acc + 1;
              }
              return acc;
          }, 0)
        : 0;
    const clearCart = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/cart/all/${IDCart}`
            );
            if (response.status === 200) {
                setCart([]);
                localStorage.removeItem("cartItems");
            } else {
                alert("");
            }
        } catch (error) {}
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                removeFromCart,
                updateQuantity,
                getTotalPrice,
                totalItems,
                fetchCart,
                clearCart,
            }}
        >
            {loading ? <Loading /> : children}
        </CartContext.Provider>
    );
};
