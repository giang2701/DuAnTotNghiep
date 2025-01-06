import { useState } from "react";
import instance from "../../api";
import Swal from "sweetalert2";
const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    // Hàm kiểm tra email hợp lệ bằng Regex
    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleForgotPassword = async () => {
        // Kiểm tra email trước khi gửi yêu cầu
        if (!isValidEmail(email)) {
            Swal.fire("Lỗi", "Email không hợp lệ.", "error");
            return;
        }

        try {
            const response = await instance.post("/auth/forgotPassword", {
                email,
            });
            Swal.fire("Thành công", response.data.message, "success");
        } catch (error: any) {
            Swal.fire(
                "Error !",
                error.response?.data?.message ||
                    "Đã xảy ra lỗi khi gửi yêu cầu.",
                "error"
            );
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Quên mật khẩu</h2>
            <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleForgotPassword}>Gửi</button>
        </div>
    );
};

export default ForgotPassword;
