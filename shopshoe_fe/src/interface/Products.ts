import { Brand } from "./Brand";
import { Category } from "./Category";
import { Size } from "./Size";

// Define the interface for sizeStock, which is an array of objects
export interface sizeStock {
  size: Size;
  stock: number; // stock is required
  price: number; // price is required
  salePrice?: number;
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
  flashSale?: FlashSale; // Thêm tùy chọn flashSale
  salePrice: number
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

export interface FlashSale {
  _id: string;
  title: string
  salePrice: number; // Tỷ lệ giảm giá 
  startDate: string; // Thời gian bắt đầu 
  endDate: string;   // Thời gian kết thúc 
  discountPercent: number
  type: string;
  isActive: boolean;
}
