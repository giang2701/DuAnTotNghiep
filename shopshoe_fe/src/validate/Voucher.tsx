import Joi from "joi";

// Tạo schema validate
const voucherSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        "string.base": `"name" phải là một chuỗi`,
        "string.empty": `"name" không được để trống`,
        "string.min": `"name" phải có ít nhất 3 ký tự`,
        "any.required": `"name" là bắt buộc`,
    }),
    code: Joi.string().min(3).max(255).required().messages({
        "string.base": `"code" phải là một chuỗi`,
        "string.empty": `"code" không được để trống`,
        "string.min": `"code" phải có ít nhất 3 ký tự`,
        "string.max": `"code" không được vượt quá 255 ký tự`,
        "any.required": `"code" là bắt buộc`,
    }),
    discount: Joi.number().min(0).required().messages({
        "number.base": `"discount" phải là một số`,
        "number.min": `"discount" phải lớn hơn hoặc bằng 0`,
        "any.required": `"discount" là bắt buộc`,
    }),
    type: Joi.string().valid("percent", "fixed").required().messages({
        "any.only": `"type" chỉ nhận giá trị "percent" hoặc "fixed"`,
        "any.required": `"type" là bắt buộc`,
    }),
    expiryDate: Joi.optional(),
    isActive: Joi.boolean().optional().messages({
        "boolean.base": `"isActive" phải là kiểu boolean`,
    }),
    minPrice: Joi.number().min(0).required().messages({
        "number.base": `"minPrice" phải là một số`,
        "number.min": `"minPrice" phải lớn hơn hoặc bằng 0`,
        "any.required": `"minPrice" là bắt buộc`,
    }),
});

export default voucherSchema;