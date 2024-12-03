import { Product } from "./Products";
import { User } from "./User";

export interface Heart {
    _id: string;
    user: User;
    product: Product;
}