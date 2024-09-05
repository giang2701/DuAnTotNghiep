import User from "../model/User.js";
import { verifyToken } from "../utils/jwt.js";

export const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const decode = verifyToken(token);
        if (!decode) {
            return res.status(401).json({
                message: "Token invalid or token expired",
            });
        }

        const user = await User.findById(decode._id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
};
