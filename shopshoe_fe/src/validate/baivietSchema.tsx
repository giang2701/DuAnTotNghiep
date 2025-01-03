import Joi from "joi";

const baivietSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      "string.empty": "Tiêu đề là bắt buộc.",
      "string.min": "Tiêu đề phải có ít nhất 5 ký tự.",
      "string.max": "Tiêu đề không được vượt quá 100 ký tự.",
    }),
  images: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Hình ảnh là bắt buộc.",
      "string.uri": "Hình ảnh phải là một URL hợp lệ.",
    }),
    content: Joi.string().allow("").messages({
      "string.base": "Nội dung phải là văn bản.",
    }),
});

export default baivietSchema;

