import { RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import mongoose, { Types } from "mongoose";
import { CompanyInterface } from "../config/interfaces";
import { callModel } from "../model/callModel";
import { companyModel } from "../model/companyModel";
import { createAmcCalls } from "./callController";

// const ITEMS_PER_PAGE = 10;

export const getCompanies: RequestHandler = (req, res) => {
  const { page, itemsPerPage } = req.params;
  let { search } = req.query;
  search = search || "";
  let companyCounter = 0;
  if (isNaN(+page)) {
    res.status(403).json("Invalid page number");
  }
  if (search) {
    companyModel
      .find({})
      .sort({ name: 1 })
      .then((companies: CompanyInterface[]) => {
        const filteredData = companies.filter((company: CompanyInterface) => {
          return (
            //@ts-ignore
            company.name.toLowerCase().includes(search.toLowerCase()) ||
            //@ts-ignore
            company.city.toLowerCase().includes(search.toLowerCase())
          );
        });
        companyCounter = filteredData.length;
        res.status(200).json({
          companies: filteredData.slice(
            (+page - 1) * +itemsPerPage,
            +page * +itemsPerPage
          ),
          totalCompanies: companyCounter,
        });
      })
      .catch((error: any) => {
        res.status(400).json(error);
      });
  } else {
    companyModel
      .find()
      .count()
      .then((numCompanies: number) => {
        companyCounter = numCompanies;
        return companyModel
          .find()
          .sort({ name: 1 })
          .skip((+page - 1) * +itemsPerPage)
          .limit(+itemsPerPage);
      })
      .then((result: CompanyInterface[]) => {
        res
          .status(200)
          .json({ companies: result, totalCompanies: companyCounter });
      })
      .catch((err) => res.status(400).json(err));
  }
};

export const getCompanyList: RequestHandler = (_req, res) => {
  companyModel
    .find({}, { name: 1 })
    .sort({ name: 1 })
    .then((foundList: { _id: string; name: string }[]) =>
      res.status(200).json(foundList)
    )
    .catch((err: any) => res.status(400).json(err));
};

export const getCompanyData: RequestHandler = (req, res) => {
  const { companyId } = req.params;
  companyModel.findById(
    companyId,
    (err: any, foundCompany: CompanyInterface) => {
      if (err) {
        res.status(400).json(err);
      } else if (foundCompany) {
        res.status(200).json({
          company: companyId,
          contactPerson: foundCompany.contactPerson,
          name: foundCompany.name,
          streetAddress: foundCompany.streetAddress,
          city: foundCompany.city,
          state: foundCompany.state,
          pincode: foundCompany.pincode,
        });
      } else {
        res.status(404).json("Company not found");
      }
    }
  );
};

export const createCompany: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const newCompany = new companyModel(req.body);
  newCompany
    .save()
    .then(() => {
      res.status(201).json("Company created");
    })
    .catch((err: any) => {
      res.status(400).json(err);
    });
};

export const updateCompany: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const updatedCompany = new companyModel(req.body);
  companyModel.findByIdAndUpdate(
    id,
    updatedCompany,
    (err: any, result: CompanyInterface) => {
      if (err) {
        return res.status(400).json(err);
      } else if (result) {
        res.status(203).json("Company updated");
      } else {
        res.status(400).json("Invalid ID");
      }
    }
  );
};

export const deleteCompany: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  companyModel.findByIdAndDelete(
    req.params.companyId,
    (err: any, result: CompanyInterface) => {
      if (err) {
        return res.status(400).json(err);
      } else if (result) {
        res.status(202).json("Company Deleted");
      } else {
        res.status(404).json("No company with this id is present");
      }
    }
  );
};

export const amcCall: RequestHandler = (_req, res) => {
  companyModel.find({}).then((result: CompanyInterface[]) => {
    const day = new Date().getDay();
    const date = new Date();
    const week = Math.ceil(new Date().getDate() / 7);
    const findAmc = result.filter(
      (value) =>
        value.amc.maintain === true &&
        (value.amc.day === -1 ||
          (value.amc.day === day &&
            (value.amc.week === week || value.amc.week === 0)))
    );
    const amcData: any[] = [];
    findAmc.forEach((company) => {
      const data = {
        streetAddress: company.streetAddress,
        city: company.city,
        state: company.state,
        pincode: company.pincode,
        callDescription: "AMC Call",
        companyName: company._id,
        customerName: company.contactPerson[0].name,
        email: company.contactPerson[0].email,
        mobile: company.contactPerson[0].mobile,
        assignedEmployeeId: new mongoose.Types.ObjectId(company.amc.employee),
        callStatus: "In progress",
        startDate: new Date().getTime(),
        startAction: new Date().toLocaleString().split(",")[0],
        problemType: "AMC Call",
        expClosure: date.setDate(date.getDate() + 1),
        actions: [],
        registeredBy: new mongoose.Types.ObjectId("62756f81f05f1f54d235158f"),
      };
      amcData.push(data);
    });
    createAmcCalls(res, amcData);
  });
};
// export const addData: RequestHandler = (req, res) => {
//   companyModel.collection.insertMany(req.body, (err: any, result: any) => {
//     if (err) {
//       return res.status(400).json(err);
//     } else {
//       res.status(200).json("Companies added");
//     }
//   });
// };
