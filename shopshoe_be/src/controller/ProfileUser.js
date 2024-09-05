import User from "../model/User.js";

export const showProfile = async (req, res, next) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            return res.status(200).json({
                success: true,
                user,
            });
        }
    } catch (error) {
        next(error);
    }
};
