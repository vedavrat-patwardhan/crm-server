"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callController_1 = require("../controller/callController");
const isAuth_1 = require("../middleware/isAuth");
const callsRouter = (0, express_1.Router)();
callsRouter.get("/calls/:itemsPerPage/:page", isAuth_1.jwtAuth, callController_1.getCalls);
callsRouter.post("/create-call", isAuth_1.jwtAuth, callController_1.createCall);
callsRouter.patch("/update-call", isAuth_1.jwtAuth, callController_1.updateCall);
callsRouter.delete("/delete-call/:callId", isAuth_1.jwtAuth, callController_1.deleteCall);
callsRouter.patch("/add-action", isAuth_1.jwtAuth, callController_1.addAction);
callsRouter.get("/company-report/:companyId/:startDate/:endDate", isAuth_1.jwtAuth, callController_1.companyReport);
callsRouter.get("/employee-report/:employeeId/:startDate/:endDate", isAuth_1.jwtAuth, callController_1.employeeReport);
exports.default = callsRouter;
