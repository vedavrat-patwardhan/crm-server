"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = require("../controller/loginController");
const isAuth_1 = require("../middleware/isAuth");
const loginRouter = (0, express_1.Router)();
loginRouter.post("/register/:auth", loginController_1.register);
loginRouter.post("/login", loginController_1.login);
loginRouter.patch("/change-pass", isAuth_1.jwtAuth, loginController_1.changePass);
exports.default = loginRouter;
