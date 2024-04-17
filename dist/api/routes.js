"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callApi_1 = __importDefault(require("./callApi"));
const companyApi_1 = __importDefault(require("./companyApi"));
const loginApi_1 = __importDefault(require("./loginApi"));
const usersApi_1 = __importDefault(require("./usersApi"));
const dataGenerationApi_1 = __importDefault(require("./dataGenerationApi"));
const router = (0, express_1.Router)();
router.use(loginApi_1.default);
router.use(usersApi_1.default);
router.use(companyApi_1.default);
router.use(callApi_1.default);
router.use("/data-generation", dataGenerationApi_1.default);
exports.default = router;
