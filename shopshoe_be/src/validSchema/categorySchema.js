import Joi from "joi";

export const categorySchema = Joi.object({
    title: Joi.string().required().min(0).max(255).messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must have at least 6 characters",
        "string.max": "Title must have at most 255 characters",
    }),
});
