import { Router } from "express";
import {
  addAction,
  companyReport,
  createCall,
  deleteCall,
  employeeReport,
  getCalls,
  updateCall,
} from "../controller/callController";
import { jwtAuth } from "../middleware/isAuth";

const callsRouter = Router();

callsRouter.get("/calls/:itemsPerPage/:page", jwtAuth, getCalls);
callsRouter.post("/create-call", jwtAuth, createCall);
callsRouter.patch("/update-call", jwtAuth, updateCall);
callsRouter.delete("/delete-call/:callId", jwtAuth, deleteCall);
callsRouter.patch("/add-action", jwtAuth, addAction);
callsRouter.get(
  "/company-report/:companyId/:startDate/:endDate",
  jwtAuth,
  companyReport
);
callsRouter.get(
  "/employee-report/:employeeId/:startDate/:endDate",
  jwtAuth,
  employeeReport
);

// callsRouter.post("/add-data", addData);

export default callsRouter;
