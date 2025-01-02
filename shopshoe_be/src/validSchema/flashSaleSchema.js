import Joi from "joi";

// Tạo schema validate
const flashSaleSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.base": `"name" phải là một chuỗi`,
        "string.empty": `"name" không được để trống`,
        "string.min": `"name" phải có ít nhất 3 ký tự`,
        "any.required": `"name" là bắt buộc`,
    }),
    discountPercent: Joi.number()
        .min(0)
        .required()
        .when("type", {
            is: "percent",
            then: Joi.number().max(100).messages({
                "number.max": `"discountPercent" không được vượt quá 100% khi "type" là giảm theo phần trăm`,
            }),
            otherwise: Joi.number().messages({
                "number.base": `"discountPercent" phải là một số`,
            }),
        })
        .messages({
            "number.base": `"discountPercent" phải là một số`,
            "number.min": `"discountPercent" phải lớn hơn hoặc bằng 0`,
            "any.required": `"discountPercent" là bắt buộc`,
        }),
    type: Joi.string().valid("percent").required().messages({
        "any.only": `"type" chỉ nhận giá trị "percent"`,
        "any.required": `"type" là bắt buộc`,
    }),
    startDate: Joi.optional(),

    endDate: Joi.optional()

});

export default flashSaleSchema;