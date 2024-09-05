export interface User {
    id?: string | number;
    username?: string;
    email: string;
    password: string;
    confirmPass: string;
    role?: "admin" | "member";
}
