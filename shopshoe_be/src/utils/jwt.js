import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env.js";

export const generateToken = (payload, expiresIn = "10d") => {
    //expiresIn = "10d"nếu ko chuyền thì mặc định hạn sử dụng sẽ là 10 ngày
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
