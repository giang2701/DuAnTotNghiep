import { Router } from "express";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
// import authSchema from "../validSchema.js/auth.js";
import { login, register } from "../controller/auth.js";
import { authShema, Login } from "../validSchema/auth.js";
import { showProfile } from "./../controller/ProfileUser.js";
import { checkAuth } from "./../middlewares/checkAuth.js";

const authRouter = Router();

authRouter.post("/register", validBodyRequest(authShema), register);
authRouter.post("/login", validBodyRequest(Login), login);

authRouter.use("/", checkAuth);
authRouter.get("/me", showProfile);
// authRouter.patch("/me", updateProfile);

export default authRouter;
