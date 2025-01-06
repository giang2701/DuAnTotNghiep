import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../interface/User";
import { LoginSchema } from "../../validate/AuthFormSchema";
import { toast } from "react-toastify";
import { useState } from "react";
import useProductCart from "../../hook/useProductCart";
import Swal from "sweetalert2";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<User>({
        resolver: joiResolver(LoginSchema),
    });
    const nav = useNavigate();
    const { login: contextLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const { getCartUser } = useProductCart(); // Sử dụng hook

    const onSubmitLogin = async (data: User) => {
        try {
            const res = await instance.post(`/auth/login`, {
                email: data.email,
                password: data.password,
            });
            // Đăng nhập thành công
            contextLogin(res.data.accessToken, res.data.user);

            // Cập nhật localStorage với thông tin user
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Lấy giỏ hàng của người dùng
            if (res.data.user.role !== "admin") {
                await getCartUser(res.data.user._id);
            }

            Swal.fire({
                title: "Good job!",
                text: "Đăng Nhập Thành Công",
                icon: "success",
            });
            setTimeout(() => {
                nav("/");
            }, 2000);
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setError("Tài khoản của bạn đã bị khóa.");
            } else {
                setError(
                    "Đăng nhập không thành công. Vui lòng kiểm tra thông tin."
                );
            }
            toast.error(error.response.data.message);
        }
    };

    const handleGoogleLogin = async (decodedToken: any) => {
        try {
            console.log(decodedToken.name, decodedToken.email);

            const res = await instance.post(
                `/auth/google`,
                {
                    name: decodedToken.name,
                    email: decodedToken.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`, // Gửi token trong header
                    },
                }
            );
            // Lấy giỏ hàng của người dùng
            if (res.data.user.role !== "admin") {
                await getCartUser(res.data.user._id);
            }
            // Xử lý kết quả đăng nhập
            contextLogin(res.data.accessToken, res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            Swal.fire({
                title: "Good job!",
                text: "Đăng nhập Google thành công",
                icon: "success",
            });
            setTimeout(() => {
                nav("/");
                window.location.reload();
            }, 0);
        } catch (error) {
            toast.error("Đăng nhập Google không thành công.");
            console.log(error);
        }
    };
    return (
        <>
            <div className="container">
                <img src="../../../public" alt="" />
                <div className="row row__login">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-ms-12 box__login">
                        <p>Bạn đã có tài khoản Zokong</p>
                        <p>
                            Nếu bạn đã có tài khoản, hãy đăng nhập để tích lũy
                            điểm thành viên và nhận được những ưu đãi tốt hơn!
                        </p>
                        <form onSubmit={handleSubmit(onSubmitLogin)}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                    placeholder="Email"
                                />
                                {errors.email && (
                                    <span className="text-danger fs-4 ">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    placeholder="Password"
                                />
                                {errors.password && (
                                    <span className="text-danger fs-4">
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                            <button className="btn btn-success">
                                ĐĂNG NHẬP
                            </button>
                            <p className="text-center fs-3">---</p>
                            <Link
                                to="/forgot-password"
                                className="nav-link text-center fs-3 text-primary"
                                style={{ margin: "-10px 0px 0px 10px" }}
                            >
                                Quên mật khẩu ?
                            </Link>
                            <p className="text-center fs-3">---</p>
                            {error && (
                                <p
                                    className="error-message"
                                    style={{ fontSize: "19px", color: "red" }}
                                >
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    {error}
                                </p>
                            )}
                            <Link
                                to="/register"
                                className="btn btn-danger btn_link_register__mobile"
                            >
                                ĐĂNG KÝ
                            </Link>
                        </form>
                        <div className="mt-3">
                            <GoogleLogin
                                onSuccess={(response: any) => {
                                    const decoded = jwtDecode(
                                        response?.credential
                                    );
                                    console.log(decoded);
                                    handleGoogleLogin(decoded);
                                }}
                                onError={() =>
                                    toast.error("Google Login thất bại!")
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-ms-12 box__link__register ">
                        <p>Khách hàng mới của Zokong</p>
                        <p>
                            Nếu bạn chưa có tài khoản trên Zokong, hãy sử dụng
                            tùy chọn này để truy cập biểu mẫu đăng ký.
                        </p>
                        <p>
                            Bằng cách cung cấp cho Zokong thông tin chi tiết của
                            bạn, quá trình mua hàng trên Zokong sẽ là một trải
                            nghiệm thú vị và nhanh chóng hơn!
                        </p>
                        <Link
                            to="/register"
                            className="btn btn-danger btn_link_register"
                        >
                            ĐĂNG KÝ
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
