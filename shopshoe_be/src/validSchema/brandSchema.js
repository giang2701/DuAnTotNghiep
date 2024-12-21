import Joi from "joi";

export const brandValidate = Joi.object({
    title: Joi.string().required().min(2).max(20).messages({
        "string.base": "Brand phải là một chuỗi",
        "string.empty": "Brand không được để trống",
        "string.min": "Brand phải có ít nhất 2 ký tự",
        "string.max": "Brand không được quá 20 ký tự",
    }),
});