import { Router } from "express";
import { changePass, login, register } from "../controller/loginController";
import { jwtAuth } from "../middleware/isAuth";
// import { validateRegister } from "../validation/apiValidation";

const loginRouter = Router();

loginRouter.post("/register/:auth",  register);
loginRouter.post("/login", login);
loginRouter.patch("/change-pass", jwtAuth, changePass);

export default loginRouter;
