import React, { useContext } from "react";
import { SizeContext, SizeContextType } from "../../../context/Size";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { Size } from "../../../interface/Size";
import { joiResolver } from "@hookform/resolvers/joi";
const SizeSchema = Joi.object({
    nameSize: Joi.number().messages({
        "string.base": "Size must be a number",
        "string.empty": "Size cannot be empty",
    }),
});
const AddSize = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<Size>({ resolver: joiResolver(SizeSchema) });
    const { CreateSize } = useContext(SizeContext) as SizeContextType;
    return (
        <>
            <div className="container">
                <form
                    action=""
                    onSubmit={handleSubmit((dataSize) => CreateSize(dataSize))}
                >
                    <label htmlFor="" className="form-label">
                        Size
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập size..."
                        {...register("nameSize")}
                    />
                    {errors.nameSize && <p>{errors.nameSize.message}</p>}
                    <button className="btn btn-primary mt-2">add size</button>
                </form>
            </div>
        </>
    );
};

export default AddSize;
