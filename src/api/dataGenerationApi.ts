import { Router } from "express";
import { jwtAuth } from "../middleware/isAuth";
import { getCallDetails } from "../controller/dataGeneratorController";

const dataGeneratorRouter = Router();

dataGeneratorRouter.get("/call-details", jwtAuth, getCallDetails);

export default dataGeneratorRouter;
