import Joi from "joi";

export const brandValidate = Joi.object({
    title: Joi.string().required().min(2).max(20).messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must have at least 2 characters",
        "string.max": "Title must have at most 20 characters",
    }),
});