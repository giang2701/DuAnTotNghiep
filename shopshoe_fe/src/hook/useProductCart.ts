import instance from "../api";
import { useCart } from "../context/cart";
import { useUser } from "../context/user";

const useProductCart = () => {
  const { setCart } = useCart();
  // const { setUser } = useUser();

  const getCartUser = async (userId: string) => {
    try {
      // const userStorage = localStorage.getItem("user") || "{}";
      // const user = JSON.parse(userStorage);
      // setUser(user);
      // if (!user._id) return;

      const cartResponse = await instance.get(`/cart?userId=${userId}`);
      //lọc giỏ hàng
      const userCart = cartResponse.data.find(
        (cart: any) => cart.user === userId
      );
      const items = userCart ? userCart.items : [];

      // Tính tổng số lượng và tổng số tiền của các sản phẩm
      const totalQuantity = items.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
      const totalPrice = items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );

      // Cập nhật cart trong localStorage
      localStorage.setItem("cartItems", JSON.stringify(items));
      localStorage.setItem("totalQuantity", totalQuantity.toString());
      localStorage.setItem("totalPrice", totalPrice.toString());

      // Cập nhật state cart
      setCart(totalQuantity); // Cập nhật cart từ context

      console.log("Số lượng sản phẩm mới trong giỏ hàng:", totalQuantity);
      console.log("Tổng tiền trong giỏ hàng:", totalPrice);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  return { getCartUser };
};

export default useProductCart;
