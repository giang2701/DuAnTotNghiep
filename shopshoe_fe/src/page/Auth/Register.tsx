import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import instance from "../../api";
import { User } from "../../interface/User";
import { RegisterSchema } from "../../validate/AuthFormSchema";
import { useNavigate } from "react-router-dom";

type Props = {};

const Register = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: joiResolver(RegisterSchema),
  });
  const nav = useNavigate();
  const onSubmitRegister = async (data: User) => {
    const res = await instance.post(`/auth/register`, {
      username: data.username, // <-- Thêm `username` vào dữ liệu gửi đi
      email: data.email,
      password: data.password,
    });
    alert(res.data.message);
    nav("/login");
    console.log(data);
  };
  return (
    <>
      <div className="container">
        <div className="register">
          <p>ĐĂNG KÝ</p>
          <form action="" onSubmit={handleSubmit(onSubmitRegister)}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Username..."
                {...register("username", {
                  required: "Username is required",
                })} // <-- Đăng ký `username` và thêm yêu cầu
              />
              {errors.username && (
                <span className="text-danger">{errors.username.message}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Email..."
                {...register("email", {
                  required: "Email is required",
                })} // <-- Thêm yêu cầu cho `email`
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
                placeholder="Password..."
                {...register("password", {
                  required: "Password is required",
                })} // <-- Thêm yêu cầu cho `password`
              />
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPass" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password..."
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
            <button className="btn button-register">ĐĂNG KÝ</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
