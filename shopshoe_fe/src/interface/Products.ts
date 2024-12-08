import { Brand } from "./Brand";
import { Category } from "./Category";
import { Size } from "./Size";

// Define the interface for sizeStock, which is an array of objects
export interface sizeStock {
  size: Size;
  stock: number; // stock is required
  price: number; // price is required
}

// Define the interface for Product
export interface Product {
  _id?: string;
  title: string;
  brand: Brand;
  price: number;
  sizeStock: sizeStock[]; // sizeStock is an array of sizeStock objects
  description?: string; // description is optional
  images?: string;
  imgCategory: string[];
  createdAt: string;
  updatedAt: string;
  category?: Category;
  isActive?: boolean;
}

export type CartItem = {
  product: Product;
  quantity: number;
  size: Size; // thêm thuộc tính kích cỡ
  userId?: string | number; // Thêm trường userId vào CartItem
  totalPrice: string;
  productId: string;
  price: number;
};
