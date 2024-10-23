import Joi from "joi";

export const SizeSchema = Joi.object({
    nameSize: Joi.number().required().messages({
        "number.empty": "Size cannot be empty",
        "number.base": "Size must be a number",
    }),
});
