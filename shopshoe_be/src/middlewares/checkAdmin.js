export const checkIsAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
};
