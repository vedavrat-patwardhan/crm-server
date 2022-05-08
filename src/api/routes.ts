import { Router } from "express";
import callsRouter from "./callApi";
import companyRouter from "./companyApi";
import loginRouter from "./loginApi";
import usersRouter from "./usersApi";

const router = Router();

router.use(loginRouter);
router.use(usersRouter);
router.use(companyRouter);
router.use(callsRouter);

export default router;
