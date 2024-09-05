import Joi from "joi";
const productSchema = Joi.object({
    title: Joi.string().required().min(3).max(255).messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must have at least 3 characters",
        "string.max": "Title must have at most 255 characters",
    }),
    brand: Joi.string().required().min(3).max(255).messages({
        "string.base": "brand must be a string",
        "string.empty": "brand cannot be empty",
        "string.min": "brand must have at least 3 characters",
        "string.max": "brand must have at most 255 characters",
    }),
    sizeStock: Joi.array()
        .items(
            Joi.object({
                size: Joi.number().required().integer().positive(),
                stock: Joi.number().required().integer().min(0),
            })
        )
        .min(1)
        .required(),
    price: Joi.number().required().min(0).messages({
        "string.base": "price must be a number",
        "string.empty": "price cannot be empty",
        "string.min": "price minimum value is 0",
    }),
    description: Joi.string().optional(),
    images: Joi.string().messages({
        "string.base": "images must be a string",
    }),
    category: Joi.string().messages({
        "string.base": "category must be a string",
    }),
});
export default productSchema;
