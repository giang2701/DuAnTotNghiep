import Joi from "joi";

export const SizeSchema = Joi.object({
    nameSize: Joi.number()
        .min(36)
        .max(50)
        .required()
        .messages({
            "number.base": "Size phải là một số",
            "number.empty": "Size không được để trống",
            "number.min": "Size phải lớn hơn hoặc bằng 36",
            "number.max": "Size không được lớn hơn 50",
            "any.required": "Size là trường bắt buộc"
        }),
})