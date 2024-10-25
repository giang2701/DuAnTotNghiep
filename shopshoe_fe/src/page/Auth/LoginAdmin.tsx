import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../interface/User";
import { LoginSchema } from "../../validate/AuthFormSchema";
import { toast } from "react-toastify";

const LoginAdmin = () => {
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
    try {
      const res = await instance.post(`/auth/login`, {
        email: data.email,
        password: data.password,
      });
      contextLogin(res.data.accessToken, res.data.user);
      nav("/");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className="container">
        <div className="box_loginAdmin">
          <p className="p_Login">Đăng nhập</p>
          <form action="" onSubmit={handleSubmit(onSubmitLogin)}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                {...register("email", {
                  required: "Email is required",
                })} // <-- Thêm yêu cầu cho `email`
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-danger fs-4 ">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="mb-5">
              <input
                type="password"
                className="form-control"
                {...register("password", {
                  required: "Password is required",
                })} // <-- Thêm yêu cầu cho `password`
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-danger fs-4">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button className="button_loginAdmin">ĐĂNG NHẬP</button>
          </form>
        </div>
        <div className="box_loginImage">
          <img src="../../../public/images/loginAdmin.png" alt="" />
        </div>
      </div>
    </>
  );
};

export default LoginAdmin;
