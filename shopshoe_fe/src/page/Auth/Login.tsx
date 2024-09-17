import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import instance from "../../api";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../interface/User";
import { LoginSchema } from "../../validate/AuthFormSchema";

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
    const onSubmitLogin = async (data: User) => {
        const res = await instance.post(`/auth/login`, {
            email: data.email,
            password: data.password,
        });
        contextLogin(res.data.accessToken, res.data.user);
        // console.log(data);
        nav("/");
    };
    return (
        <>
            <h1>Login</h1>
            <form action="" onSubmit={handleSubmit(onSubmitLogin)}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        {...register("email", {
                            required: "Email is required",
                        })} // <-- Thêm yêu cầu cho `email`
                    />
                    {errors.email && (
                        <span className="text-danger">
                            {errors.email.message}
                        </span>
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
                <button className="btn btn-success">Login</button>
            </form>
        </>
    );
};

export default Login;
