import { Category } from "./Category";

// Define the interface for sizeStock, which is an array of objects
export interface sizeStock {
    _id: string;
    size: number; // size is required
    stock: number; // stock is required
}

// Define the interface for Product
export interface Product {
    _id?: string;
    title: string;
    brand: string;
    sizeStock: sizeStock[]; // sizeStock is an array of sizeStock objects
    price: number;
    description?: string; // description is optional
    images: string;
    imgCategory: string[];
    createdAt: string;
    updatedAt: string;
    category?: Category;
}
