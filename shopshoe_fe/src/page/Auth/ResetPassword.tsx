import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../api";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState(""); // Lưu email lấy được
    const nav = useNavigate();

    // Lấy email từ token
    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const response = await instance.post("/auth/verifyToken", {
                    token,
                });
                setEmail(response.data.email); // Lưu email từ API
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message || "Lỗi xác minh token."
                );
            }
        };

        fetchEmail();
    }, [token]);

    const handleResetPassword = async () => {
        // validate
        if (newPassword.length < 6 || newPassword.length > 18) {
            toast.error("Mật khẩu phải từ 6-18 ký tự.");
            return;
        }

        try {
            const response = await instance.post("/auth/resetPassword", {
                email, // Gửi email thay vì token
                newPassword,
            });
            toast.success(response.data.message);
            setTimeout(() => {
                nav("/login");
            }, 2000);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Lỗi khi đặt lại mật khẩu."
            );
        }
    };

    return (
        <div className="password-setup-container">
            <div className="password-setup-card">
                <button className="back-button" onClick={() => nav("/login")}>
                    ←
                </button>
                <h2 className="password-setup-title">Thiết Lập Mật Khẩu</h2>
                {email ? (
                    <p className="password-setup-subtitle">
                        Tạo mật khẩu mới cho <span>{email}</span>
                    </p>
                ) : (
                    <p className="password-setup-subtitle">Đang tải email...</p>
                )}
                <div className="password-input-container">
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                    />
                </div>
                <ul className="password-rules">
                    <li>Mật khẩu phải từ 6-18 ký tự.</li>
                </ul>
                <button onClick={handleResetPassword} className="submit-button">
                    Đặt lại mật khẩu
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
