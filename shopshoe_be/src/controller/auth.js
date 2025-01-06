import User from "../model/User.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword, hassPassword } from "../utils/password.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
    try {
        /**
         * 1. Kiem tra email co dk dang ky trong he thong chua?
         * 2. Ma ma password
         * 3. Khoi tao user moi
         * 4. Thong bao thanh cong
         */
        const { username, email, password, level } = req.body;
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
            level,
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
        if (!useExists.isActive) {
            return res.status(403).json({
                message: "Tài khoản của bạn bị khóa vì vi phạm chính sách.",
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
// Khởi tạo từ Google ouuth
export const googleLogin = async (req, res) => {
    const { name, email } = req.body;
    try {
        let user = await User.findOne({
            email,
        });
        if (!user) {
            // nếu người dùng chưa tồn tại, tạo mới
            user = await User.create({
                username: name,
                email,
            });
        }
        // Kiểm tra tk có bị khóa không
        if (!user.isActive) {
            return res.status(403).json({
                message: "Tài khoản của bạn bị khóa vì vi phạm chính sách.",
            });
        }
        // Tạo token cho người dùng
        const token = generateToken(
            {
                _id: user._id,
            },
            "100d"
        );
        // đăng nhập tc
        return res.status(200).json({
            success: true,
            user,
            accessToken: token,
            message: "Đăng nhập Google thành công",
        });
    } catch (error) {
        console.error("Error during Google login:", error);

        if (error.message && error.message.includes("jwt")) {
            return res.status(401).json({
                message: "Token không hợp lệ hoặc đã hết hạn.",
            });
        }
        return res.status(500).json({
            message: "Đăng nhập thất bại. Vui lòng thử lại sau.",
            error: error.message,
        });
    }
};

const JWT_SECRET = process.env.JWT_SECRET;
// Quên mật khẩu
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra xem email có tồn tại trong hệ thống không
        const user = await User.findOne({
            email,
        });
        if (!user) {
            return res.status(404).json({
                message: "Email chưa được đăng ký.",
            });
        }

        // Tạo token đặt lại mật khẩu
        const token = jwt.sign(
            {
                id: user._id,
            },
            JWT_SECRET, //mã bí bật
            {
                expiresIn: "1h",
            }
        );

        // Link đặt lại mật khẩu
        const resetLink = `http://localhost:5173/reset-password/${token}`;

        // Cấu hình gửi email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "nguyenvangiangshoeshop@gmail.com",
                pass: "yiko mjum endw ycxw",
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Đặt lại mật khẩu tài khoản Web ZoKong",
            html: `
                <p> Xin chào ${email} </p>
                <p>Bấm vào link sau để đặt lại mật khẩu:</p>
                <a href="${resetLink}">Bấm vào đây</a>
                <p>Link này sẽ hết hạn sau 1 giờ.</p>
            `,
        };

        // Gửi email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error occurred:", error); // In chi tiết lỗi
                return res.status(500).json({
                    message: error.message,
                    error: error.message, // Trả lại thông báo lỗi chi tiết
                });
            }
            res.status(200).json({
                message: "Email đặt lại mật khẩu đã được gửi.",
            });
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: error.message,
        });
    }
};

// Hàm verifyToken để xác minh token JWT
export const verifyToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            message: "Token không tồn tại",
        });
    }
    try {
        // Giải mã token và lấy thông tin User
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Tìm người dùng dựa trên id trong token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
            });
        }

        // Nếu tìm thấy user, trả về email
        res.status(200).json({
            email: user.email,
        });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(400).json({
            message: error.message,
            error: error.message,
        });
    }
};
// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Tìm người dùng bằng email
        const user = await User.findOne({
            email,
        });
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
            });
        }

        // Mã hóa mật khẩu và update
        const hashedPassword = hassPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Đặt lại mật khẩu thành công.",
        });
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        res.status(500).json({
            message: error,
        });
    }
};
