export interface User {
    _id?: string | number;
    username?: string;
    email: string;
    password: string;
    confirmPass: string;
    role?: "admin" | "member";
    level?: string;
    avatar?: string;
    isActive?: boolean; // Thêm thuộc tính isActive vào đây  thêm đoạn này vào interface user
    permissions: string[];
}
