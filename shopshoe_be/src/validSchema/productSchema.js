import Joi from "joi";

const productSchema = Joi.object({
    title: Joi.string().required().min(3).messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must have at least 3 characters",
    }),
    brand: Joi.string().required().messages({
        "string.base": "Brand must be a string",
        "string.empty": "Brand cannot be empty",
        "string.min": "Brand must have at least 3 characters",
        "string.max": "Brand must have at most 255 characters",
    }),
    price: Joi.number().required().min(0).messages({
        "number.base": "Price must be a number",
        "number.empty": "Price cannot be empty",
        "number.min": "Price minimum value is 0",
    }),
    sizeStock: Joi.array()
        .items(
            Joi.object({
                size: Joi.optional(),
                stock: Joi.number().required().integer().messages({
                    "number.base": "Stock must be a number",
                }),
                price: Joi.number().required().min(0).messages({
                    "number.base": "Price must be a number",
                    "number.empty": "Price cannot be empty",
                    "number.min": "Price minimum value is 0",
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            "array.min": "At least one size-stock pair is required",
        }),
    description: Joi.string().optional(),
    images: Joi.string().uri().messages({
        "string.base": "Images must be a string",
        "string.uri": "Images must be a valid URL",
    }),
    imgCategory: Joi.array()
        .items(
            Joi.string().uri().messages({
                "string.uri": "Each image category must be a valid URL",
            })
        )
        .messages({
            "array.base": "Image category must be an array of valid URLs",
        }),
    category: Joi.string().required().messages({
        "string.base": "Category must be a string",
        "any.required": "Category is required",
    }),
});

export default productSchema;
