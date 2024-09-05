import User from "../model/User.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword, hassPassword } from "../utils/password.js";

export const register = async (req, res, next) => {
    try {
        /**
         * 1. Kiem tra email co dk dang ky trong he thong chua?
         * 2. Ma ma password
         * 3. Khoi tao user moi
         * 4. Thong bao thanh cong
         */
        const { username, email, password } = req.body;
        const useExists = await User.findOne({ email });
        console.log(useExists);
        if (useExists) {
            return res.status(400).json({
                message: "Email da ton tai",
            });
        }

        const hassPass = hassPassword(password);
        if (!hassPass) {
            return res.status(400).json({
                message: "Ma hoa mat khau that bai!",
            });
        }

        const user = await User.create({
            username,
            email,
            password: hassPass,
        });

        user.password = undefined;

        return res.status(201).json({
            success: true,
            user,
            message: "Dang ky thanh cong!",
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        /**
         * 1. Kiem tra email co dk dang ky trong he thong chua?
         * 2. Giai ma password
         * 3. Generate token
         * 4. Thong bao thanh cong
         */

        const { email, password } = req.body;
        const useExists = await User.findOne({ email });
        console.log(useExists);
        if (!useExists) {
            return res.status(404).json({
                message: "Email chua dang ky!",
            });
        }

        const isMatch = comparePassword(password, useExists.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Mat khau khong dung!",
            });
        }

        const token = generateToken({ _id: useExists._id }, "100d");
        useExists.password = undefined;

        return res.status(200).json({
            success: true,
            user: useExists,
            accessToken: token,
            message: "Login successfully!",
        });
    } catch (error) {
        next(error);
    }
};
