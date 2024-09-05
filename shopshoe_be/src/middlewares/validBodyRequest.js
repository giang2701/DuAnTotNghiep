export const validBodyRequest = (schema) => async (req, res, next) => {
    try {
        const { error } = await schema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: "Invalid request data",
                errors,
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};
