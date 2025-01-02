import Joi from "joi";

const flashSaleSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Tên Flash Sale không được để trống",
    }),
    discountPercent: Joi.number().min(1).max(100).required().messages({
        "number.base": "Giảm giá phải là số",
        "number.min": "Giảm giá phải lớn hơn hoặc bằng 1",
        "number.max": "Giảm giá phải nhỏ hơn hoặc bằng 100",
    }),
    type: Joi.string().valid("percent").required().messages({
        "any.only": "Loại giảm giá không hợp lệ",
    }),
    startDate: Joi.date().required().messages({
        "date.base": "Ngày bắt đầu không hợp lệ",
    }),
    endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
        "date.greater": "Ngày kết thúc phải sau ngày bắt đầu",
    }),
    isActive: Joi.boolean(),
});

export default flashSaleSchema;
