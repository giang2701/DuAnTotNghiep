import Joi from "joi";

export const authShema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.email": "Email must be a valid email",
    }),
    password: Joi.string().required().min(6).max(255).messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Password must have at least 6 characters",
        "string.max": "Password must have at most 255 characters",
    }),
    level: Joi.string().optional(),
    role: Joi.string().optional(),
});
export const Login = Joi.object({
    email: Joi.string().required().email().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.email": "Email must be a valid email",
    }),
    password: Joi.string().required().min(6).max(255).messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Password must have at least 6 characters",
        "string.max": "Password must have at most 255 characters",
    }),
});
