import User from "../model/User.js";
import { verifyToken } from "../utils/jwt.js";
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
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
        req.user = user; // Assume req.user is populated by authentication middleware
        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Populate permissions from user
        const populatedUser = await User.findById(user._id).populate(
            "permissions"
        );
        const userPermissions = populatedUser.permissions.map(
            (perm) => perm.name
        );

        // Check if the required permission is included
        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({
                message: "Bạn không có quyền cho chức năng này!!",
            });
        }

        next();
    };
};

export default checkPermission;
