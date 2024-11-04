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
      await getCartUser(res.data.user._id); // Gọi hàm để lấy giỏ hàng
      
      toast.success('đang nhập thành công')
      nav("/"); // Điều hướng đến trang chính
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setError("Tài khoản của bạn đã bị khóa.");
      } else {
        setError("Đăng nhập không thành công. Vui lòng kiểm tra thông tin.");
      }
      toast.error(error.response.data.message);
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
              Nếu bạn đã có tài khoản, hãy đăng nhập để tích lũy điểm thành viên
              và nhận được những ưu đãi tốt hơn!
            </p>
            <form onSubmit={handleSubmit(onSubmitLogin)}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  {...register("email", { required: "Email is required" })}
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
              <button className="btn btn-success">ĐĂNG NHẬP</button>
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
          </div>
          <div className="col-xl-6 col-lg-6 col-md-12 col-ms-12 box__link__register ">
            <p>Khách hàng mới của Zokong</p>
            <p>
              Nếu bạn chưa có tài khoản trên Zokong, hãy sử dụng tùy chọn này để
              truy cập biểu mẫu đăng ký.
            </p>
            <p>
              Bằng cách cung cấp cho Zokong thông tin chi tiết của bạn, quá
              trình mua hàng trên Zokong sẽ là một trải nghiệm thú vị và nhanh
              chóng hơn!
            </p>
            <Link to="/register" className="btn btn-danger btn_link_register">
              ĐĂNG KÝ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
