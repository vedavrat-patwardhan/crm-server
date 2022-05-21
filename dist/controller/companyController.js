"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amcCall = exports.deleteCompany = exports.updateCompany = exports.createCompany = exports.getCompanyData = exports.getCompanyList = exports.getCompanies = void 0;
const express_validator_1 = require("express-validator");
const companyModel_1 = require("../model/companyModel");
const callController_1 = require("./callController");
const getCompanies = (req, res) => {
    const { page, itemsPerPage } = req.params;
    let { search } = req.query;
    search = search || "";
    let companyCounter = 0;
    if (isNaN(+page)) {
        res.status(403).json("Invalid page number");
    }
    if (search) {
        companyModel_1.companyModel
            .find({})
            .sort({ name: 1 })
            .then((companies) => {
            const filteredData = companies.filter((company) => {
                return (company.name.toLowerCase().includes(search.toLowerCase()) ||
                    company.city.toLowerCase().includes(search.toLowerCase()));
            });
            companyCounter = filteredData.length;
            res.status(200).json({
                companies: filteredData.slice((+page - 1) * +itemsPerPage, +page * +itemsPerPage),
                totalCompanies: companyCounter,
            });
        })
            .catch((error) => {
            res.status(400).json(error);
        });
    }
    else {
        companyModel_1.companyModel
            .find()
            .count()
            .then((numCompanies) => {
            companyCounter = numCompanies;
            return companyModel_1.companyModel
                .find()
                .sort({ name: 1 })
                .skip((+page - 1) * +itemsPerPage)
                .limit(+itemsPerPage);
        })
            .then((result) => {
            res
                .status(200)
                .json({ companies: result, totalCompanies: companyCounter });
        })
            .catch((err) => res.status(400).json(err));
    }
};
exports.getCompanies = getCompanies;
const getCompanyList = (_req, res) => {
    companyModel_1.companyModel
        .find({}, { name: 1 })
        .sort({ name: 1 })
        .then((foundList) => res.status(200).json(foundList))
        .catch((err) => res.status(400).json(err));
};
exports.getCompanyList = getCompanyList;
const getCompanyData = (req, res) => {
    const { companyId } = req.params;
    companyModel_1.companyModel.findById(companyId, (err, foundCompany) => {
        if (err) {
            res.status(400).json(err);
        }
        else if (foundCompany) {
            res.status(200).json({
                company: companyId,
                contactPerson: foundCompany.contactPerson,
                name: foundCompany.name,
                streetAddress: foundCompany.streetAddress,
                city: foundCompany.city,
                state: foundCompany.state,
                pincode: foundCompany.pincode,
            });
        }
        else {
            res.status(404).json("Company not found");
        }
    });
};
exports.getCompanyData = getCompanyData;
const createCompany = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const newCompany = new companyModel_1.companyModel(req.body);
    newCompany
        .save()
        .then(() => {
        res.status(201).json("Company created");
    })
        .catch((err) => {
        res.status(400).json(err);
    });
};
exports.createCompany = createCompany;
const updateCompany = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const updatedCompany = new companyModel_1.companyModel(req.body);
    companyModel_1.companyModel.findByIdAndUpdate(id, updatedCompany, (err, result) => {
        if (err) {
            return res.status(400).json(err);
        }
        else if (result) {
            res.status(203).json("Company updated");
        }
        else {
            res.status(400).json("Invalid ID");
        }
    });
};
exports.updateCompany = updateCompany;
const deleteCompany = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    companyModel_1.companyModel.findByIdAndDelete(req.params.companyId, (err, result) => {
        if (err) {
            return res.status(400).json(err);
        }
        else if (result) {
            res.status(202).json("Company Deleted");
        }
        else {
            res.status(404).json("No company with this id is present");
        }
    });
};
exports.deleteCompany = deleteCompany;
const amcCall = () => {
    companyModel_1.companyModel.find({}).then((result) => {
        const day = new Date().getDay();
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const week = Math.ceil((new Date().getDate() + new Date(firstDay).getDay()) / 7);
        const findAmc = result.filter((value) => value.amc.maintain === true &&
            value.amc.day === day &&
            (value.amc.week === week || value.amc.week === 0));
        const amcDate = [];
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
                assignedEmployeeId: company.amc.employee,
                callStatus: "In progress",
                startDate: new Date().getTime(),
                startAction: new Date().getTime(),
                problemType: "AMC Call",
                expClosure: date.setDate(date.getDate() + 1),
                actions: [],
                registeredBy: "62756f81f05f1f54d235158f",
            };
            amcDate.push(data);
        });
        (0, callController_1.createAmcCalls)(amcDate);
    });
};
exports.amcCall = amcCall;
