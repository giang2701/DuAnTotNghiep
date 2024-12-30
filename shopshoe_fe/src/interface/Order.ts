import { Size } from "./Size";
import { Product } from "./Products";
import { Category } from "./Category";
import { User } from "./User";

export interface Order {
  _id: string;
  userId: User;

  products: {
    product: Product;
    quantity: number;
    size: Size;
    _id: string;
  }[];
  totalPrice: number;
  voucher: string | null;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  imgCategory: string[];
  category?: Category;
  BookingDate: Date;
  updatedAtDate: Date;
  return?: {
    _id: string;
  };
}
