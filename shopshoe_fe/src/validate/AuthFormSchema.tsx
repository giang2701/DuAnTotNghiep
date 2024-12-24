import Joi from "joi";
export const LoginSchema = Joi.object({
    email: Joi.string().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be a valid email",
    }),
    password: Joi.string().required().min(6).max(255).messages({
        "string.base": "Password must be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must have at least 6 characters",
        "string.max": "Password must have at most 255 characters",
    }),
});
export const RegisterSchema = Joi.object({
    username: Joi.string().required().min(3).max(20).messages({
        "string.base": "Username must be a string",
        "string.empty": "Username cannot be empty",
        "string.min": "Username must have at least 3 characters",
        "string.max": "Username must have at most 20 characters",
    }),
    email: Joi.string().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be a valid email",
    }),
    password: Joi.string().required().min(6).max(255).messages({
        "string.base": "Password must be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must have at least 6 characters",
        "string.max": "Password must have at most 255 characters",
    }),
    confirmPass: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "Mật Khẩu không khớp",
        "string.empty": "Confirm password cannot be empty",
    }),
});
