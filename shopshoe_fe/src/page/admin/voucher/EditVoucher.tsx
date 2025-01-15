import { useForm } from "react-hook-form";
import { useVoucher } from "../../../context/Voucher";
import { Voucher } from "../../../interface/Voucher";
import { useState, useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import voucherSchema from "../../../validate/Voucher";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import instance from "../../../api"; // API instance để gọi các request

const EditVoucher = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const { updateVoucher, setVoucher } = useVoucher();
  // Dùng hàm cập nhật voucher từ context
  const {
    register,
    handleSubmit,
    setValue, // Để gán giá trị cho form
    watch,
    formState: { errors },
  } = useForm<Voucher>({
    resolver: joiResolver(voucherSchema),
  });

  const [formattedPrice, setFormattedPrice] = useState<string>("");
  // check %
  const validateDiscount = (discount: number, type: string) => {
    if (type === "percent" && discount > 100) {
        Swal.fire("Lỗi", "Giảm giá không được vượt quá 100%", "error");
        return false;
    }

    if (type === "fixed" && isNaN(discount)) {
        Swal.fire("Lỗi", "Giá trị giảm phải là số", "error");
        return false;
    }

    return true;
};

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setFormattedPrice(formatPrice(value));
  };

  // Lấy dữ liệu voucher khi component mount
  useEffect(() => {
    if (id) {
      // Lấy dữ liệu voucher khi chỉnh sửa
      (async () => {
        try {
          const response = await instance.get(`/voucher/${id}`);
          const data = response.data.data;

          // Chuyển đổi expiryDate sang định dạng "yyyy-MM-dd"
          const formattedExpiryDate = new Date(data.expiryDate)
            .toISOString()
            .split("T")[0];

          setValue("name", data.name);
          setValue("code", data.code);
          setValue("type", data.type);
          setValue("discount", data.discount);
          setValue("expiryDate", formattedExpiryDate as any); // Cập nhật expiryDate với định dạng chuẩn
          setValue("minPrice", data.minPrice);
        } catch (error) {
          Swal.fire("Lỗi", "Không tải được voucher", "error");
        }
      })();
    }
  }, [id, setValue]);



  const handleEdit = async (data: Voucher) => {
    const { discount, type } = data;
  
    // Kiểm tra điều kiện validate trước khi gửi form
    if (!validateDiscount(discount, type)) {
      return;
    }
  
    console.log("Form data:", data); // Xem dữ liệu đã được validate
  
    // Hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: "Xác nhận cập nhật",
      text: "Bạn có chắc chắn muốn cập nhật voucher này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    });
  
    if (!result.isConfirmed) {
      return; // Dừng nếu người dùng không xác nhận
    }
  
    try {
      if (!id) {
        Swal.fire("Lỗi", "ID voucher không hợp lệ", "error");
        return;
      }
  
      const payload = {
        ...data,
        minPrice: parseInt(data.minPrice.toString(), 10),
      };
  
      const success = await updateVoucher(id, payload);
      if (success) {
        Swal.fire("Thành công", "Voucher đã được cập nhật", "success");
        fetchVouchers();
        navigate("/admin/voucher");
      } else {
        Swal.fire("Lỗi", "Không thể cập nhật voucher", "error");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Đã xảy ra lỗi, vui lòng thử lại sau.";
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: errorMessage,
      });
    }
  };
  


  const fetchVouchers = async () => {
    try {
      const response = await instance.get("/voucher");
      setVoucher(response.data.data); // Cập nhật lại danh sách voucher từ API
    } catch (error) {
      console.error("Error fetching vouchers", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div className="container">
      <h1
        className="mt-2"
        style={{ display: "inline-block", fontFamily: "serif" }}
      >
        Voucher
      </h1>
      <span style={{ marginLeft: "5px", fontFamily: "serif" }}>Cập nhật</span>
      <form onSubmit={handleSubmit(handleEdit)}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name Voucher
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            {...register("name")}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="code" className="form-label">
            Code Voucher
          </label>
          <input
            type="text"
            id="code"
            className="form-control"
            {...register("code")}
            style={{ textTransform: "uppercase" }}
          />
          {errors.code && <p className="text-danger">{errors.code.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Discount Type
          </label>
          <div className="form-floating w-75">
            <select
              {...register("type")}
              id="type"
              className="form-select w-25"
              defaultValue=""
            >
              <option value="" disabled>
                Open this select menu
              </option>
              <option value="percent">Giảm theo %</option>
              <option value="fixed">Giảm theo tiền</option>
            </select>
            {errors.type && (
              <p className="text-danger">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="discount" className="form-label">
            Discount Voucher (giảm theo % hoặc tiền)
          </label>
          <input
            type="number"
            id="discount"
            className="form-control"
            {...register("discount")}
            onChange={(event) => {
              const discountValue = parseInt(event.target.value, 10);
              const discountType = watch("type"); // Lấy giá trị của trường "type"
              validateDiscount(discountValue, discountType); // Gọi hàm kiểm tra
            }}
          />
          {errors.discount && (
            <p className="text-danger">{errors.discount.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="expiryDate" className="form-label">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            className="form-control"
            {...register("expiryDate")}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="minPrice" className="form-label">
            Apply from
          </label>
          <input
            type="number"
            id="minPrice"
            className="form-control"
            {...register("minPrice")}
            onChange={handlePriceChange}
          />
          <p className="fs-5 text-danger fw-medium">{formattedPrice}</p>
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditVoucher;
