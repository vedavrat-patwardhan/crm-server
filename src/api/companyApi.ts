import { Router } from "express";
import {
  amcCall,
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyData,
  getCompanyList,
  updateCompany,
} from "../controller/companyController";
import { jwtAuth } from "../middleware/isAuth";

const companyRouter = Router();

companyRouter.get("/companies/:itemsPerPage/:page", jwtAuth, getCompanies);
companyRouter.get("/company-list", jwtAuth, getCompanyList);
companyRouter.get("/company-data/:companyId", jwtAuth, getCompanyData);
companyRouter.post("/create-company", jwtAuth, createCompany);
companyRouter.patch("/update-company/:id", jwtAuth, updateCompany);
companyRouter.delete("/delete-company/:companyId", jwtAuth, deleteCompany);
companyRouter.post("/add-amc", jwtAuth, amcCall);
companyRouter.post("/add-amc-cron", amcCall);
// companyRouter.post("/add-data", addData);

export default companyRouter;
