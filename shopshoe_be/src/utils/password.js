import bcryptjs from "bcryptjs";

export const hassPassword = (password) => {
    // const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, 10);
};

export const comparePassword = (password, hashPassword) => {
    return bcryptjs.compareSync(password, hashPassword);
};
