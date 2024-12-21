import { useContext } from "react";
import { SizeContext, SizeContextType } from "../../../context/Size";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { Size } from "../../../interface/Size";
import { joiResolver } from "@hookform/resolvers/joi";

const SizeSchema = Joi.object({
    nameSize: Joi.number()
        .integer()
        .min(36)
        .max(50)
        .required()
        .messages({
            "number.base": "Size phải là một số",
            "number.empty": "Size không được để trống",
            "number.integer": "Size phải là số nguyên",
            "number.min": "Size phải lớn hơn hoặc bằng 36",
            "number.max": "Size không được lớn hơn 50",
            "any.required": "Size là trường bắt buộc",
        }),
});

const errorStyle = {
    color: "#dc3545",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "5px",
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    borderLeft: "3px solid #dc3545",
    padding: "10px 10px",
    borderRadius: "4px",
    maxWidth: "500px",
};

const AddSize = () => {
    const { CreateSize } = useContext(SizeContext) as SizeContextType;

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<Size>({ resolver: joiResolver(SizeSchema) });

    return (
        <div className="container">
            <form onSubmit={handleSubmit((dataSize) => CreateSize(dataSize))}>
                <label htmlFor="nameSize" className="form-label">
                    Size
                </label>
                <input
                    id="nameSize"
                    type="number"
                    className="form-control"
                    placeholder="Nhập size..."
                    {...register("nameSize")}
                />
                {errors.nameSize && (
                    <p style={errorStyle} className="text-danger">
                        {errors.nameSize.message}
                    </p>
                )}

                <button type="submit" className="btn btn-primary mt-2">
                    Add Size
                </button>
            </form>
        </div>
    );
};

export default AddSize;