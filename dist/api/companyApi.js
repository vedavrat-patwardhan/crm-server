"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controller/companyController");
const isAuth_1 = require("../middleware/isAuth");
const companyRouter = (0, express_1.Router)();
companyRouter.get("/companies/:itemsPerPage/:page", isAuth_1.jwtAuth, companyController_1.getCompanies);
companyRouter.get("/company-list", isAuth_1.jwtAuth, companyController_1.getCompanyList);
companyRouter.get("/company-data/:companyId", isAuth_1.jwtAuth, companyController_1.getCompanyData);
companyRouter.post("/create-company", isAuth_1.jwtAuth, companyController_1.createCompany);
companyRouter.patch("/update-company/:id", isAuth_1.jwtAuth, companyController_1.updateCompany);
companyRouter.delete("/delete-company/:companyId", isAuth_1.jwtAuth, companyController_1.deleteCompany);
companyRouter.post("/add-amc", isAuth_1.jwtAuth, companyController_1.amcCall);
companyRouter.post("/add-amc-cron", companyController_1.amcCall);
exports.default = companyRouter;
