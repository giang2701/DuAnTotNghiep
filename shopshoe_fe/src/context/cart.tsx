import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
interface CartContextType {
  cart: number;
  setCart: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<number>(0);

  // Tải giỏ hàng từ localStorage
  useEffect(() => {
    const storedTotalQuantity = localStorage.getItem("totalQuantity");
    if (storedTotalQuantity) {
      const totalQuantity = parseInt(storedTotalQuantity, 10);
      setCart(totalQuantity); // Cập nhật state cart từ localStorage
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
