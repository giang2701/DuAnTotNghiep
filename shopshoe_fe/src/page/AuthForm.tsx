import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import instance from "../api";
import { useAuth } from "../context/AuthContext";
import { User } from "../interface/User";

type Props = {
    isLogin?: boolean;
};

const AuthForm = ({ isLogin }: Props) => {
    const { login: contextLogin } = useAuth();
    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm<User>();

    const onSubmit = async (data: User) => {
        try {
            if (isLogin) {
                const res = await instance.post(`/auth/login`, {
                    email: data.email,
                    password: data.password,
                });
                contextLogin(res.data.accessToken, res.data.user);
            } else {
                const res = await instance.post(`/auth/register`, {
                    username: data.username, // <-- Thêm `username` vào dữ liệu gửi đi
                    email: data.email,
                    password: data.password,
                });
                alert(res.data.message);
            }
        } catch (error: any) {
            console.log(error);
            alert(error.response?.data?.message || "Error!");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{isLogin ? "Login" : "Register"}</h1>

            {!isLogin && (
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("username", {
                            required: "Username is required",
                        })} // <-- Đăng ký `username` và thêm yêu cầu
                    />
                    {errors.username && (
                        <span className="text-danger">
                            {errors.username.message}
                        </span>
                    )}
                </div>
            )}
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    className="form-control"
                    {...register("email", { required: "Email is required" })} // <-- Thêm yêu cầu cho `email`
                />
                {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                )}
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    type="password"
                    className="form-control"
                    {...register("password", {
                        required: "Password is required",
                    })} // <-- Thêm yêu cầu cho `password`
                />
                {errors.password && (
                    <span className="text-danger">
                        {errors.password.message}
                    </span>
                )}
            </div>

            {!isLogin && (
                <div className="mb-3">
                    <label htmlFor="confirmPass" className="form-label">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        {...register("confirmPass", {
                            required: "Confirm Password is required",
                        })} // <-- Thêm yêu cầu cho `confirmPass`
                    />
                    {errors.confirmPass && (
                        <span className="text-danger">
                            {errors.confirmPass.message}
                        </span>
                    )}
                </div>
            )}
            <button className="btn btn-success">
                {isLogin ? "Login" : "Register"}
            </button>
            {isLogin ? (
                <Link to="/register">Register</Link>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </form>
    );
};

export default AuthForm;
