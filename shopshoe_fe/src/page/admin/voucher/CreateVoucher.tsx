import { useForm } from "react-hook-form";
import { useVoucher } from "../../../context/Voucher";
import { Voucher } from "../../../interface/Voucher";
import { useState } from "react";

const CreateVoucher = () => {
  const { handleVoucher } = useVoucher();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Voucher>();
  const [formattedPrice, setFormattedPrice] = useState<string>("");
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

  return (
    <>
      <div className="container">
        <h1
          className="mt-2"
          style={{ display: "inline-block", fontFamily: "serif" }}
        >
          Voucher
        </h1>
        <span style={{ marginLeft: "5px", fontFamily: "serif" }}>Tạo Mới</span>
        <form onSubmit={handleSubmit(handleVoucher)}>
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
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
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
            {errors.code && (
              <p className="text-danger">{errors.code.message}</p>
            )}
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
              Discount Voucher(giảm theo% hoặc tiền)
            </label>
            <input
              type="number"
              id="discount"
              className="form-control"
              {...register("discount")}
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
            {/* {errors.expiryDate && (
                            <p className="text-danger">
                                {errors.expiryDate.message}
                            </p>
                        )} */}
          </div>
          <div className="mb-3">
            <label htmlFor="expiryDate" className="form-label">
              Apply from
            </label>
            <input
              type="number"
              id="expiryDate"
              className="form-control"
              {...register("minPrice")}
              onChange={handlePriceChange}
            />
            <p className="fs-5 text-danger fw-medium">{formattedPrice}</p>
          </div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateVoucher;
