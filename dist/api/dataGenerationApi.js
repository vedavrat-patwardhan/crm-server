"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataGeneratorController_1 = require("../controller/dataGeneratorController");
const dataGeneratorRouter = (0, express_1.Router)();
dataGeneratorRouter.get("/call-details", dataGeneratorController_1.getCallDetails);
exports.default = dataGeneratorRouter;
