"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeReport = exports.companyReport = exports.addAction = exports.deleteCall = exports.updateCall = exports.createCall = exports.getCalls = void 0;
const express_validator_1 = require("express-validator");
const callModel_1 = require("../model/callModel");
const signupModel_1 = require("../model/signupModel");
const genId = (id) => {
    const today = new Date();
    today.setHours(today.getHours() + 9);
    today.setMinutes(today.getMinutes() + 30);
    const yyyy = today.getFullYear().toString();
    const mm = ("0" + (today.getMonth() + 1)).slice(-2);
    const dd = ("0" + today.getDate()).slice(-2);
    if (id.toString().includes(yyyy + mm + dd)) {
        return (parseInt(id) + 1).toString();
    }
    else {
        return yyyy + mm + dd + "01";
    }
};
let callCounter;
const getCall = (find, filterData) => {
    if (filterData.search || filterData.filters) {
        return callModel_1.callModel
            .find({
            ...find,
            callStatus: { $ne: "Completed" },
        })
            .sort({ id: -1 })
            .populate("assignedEmployeeId", "name")
            .populate("registeredBy", "name")
            .populate("companyName", "name")
            .populate("actions.employee", "name")
            .then((calls) => {
            const filteredData = calls.filter((call) => {
                return (call.startDate > +filterData.filters &&
                    (call.id.toString().includes(filterData.search) ||
                        (call.companyName &&
                            call.companyName.name
                                .toLowerCase()
                                .includes(filterData.search)) ||
                        call.assignedEmployeeId.name
                            .toLowerCase()
                            .includes(filterData.search)));
            });
            callCounter = filteredData.length;
            filterData.res.status(200).json({
                calls: filteredData.slice((+filterData.page - 1) * +filterData.itemsPerPage, +filterData.page * +filterData.itemsPerPage),
                totalCalls: callCounter,
            });
        });
    }
    else {
        callModel_1.callModel
            .find({
            ...find,
            callStatus: { $ne: "Completed" },
        })
            .count()
            .then((callCount) => {
            callCounter = callCount;
            return callModel_1.callModel
                .find({
                ...find,
                callStatus: { $ne: "Completed" },
            })
                .sort({ id: -1 })
                .skip((+filterData.page - 1) * +filterData.itemsPerPage)
                .limit(+filterData.itemsPerPage)
                .populate("assignedEmployeeId", "name")
                .populate("registeredBy", "name")
                .populate("companyName", "name")
                .populate("actions.employee", "name");
        })
            .then((result) => filterData.res
            .status(200)
            .json({ calls: result, totalCalls: callCounter }))
            .catch((error) => {
            filterData.res.status(400).json(error);
        });
    }
};
const getCalls = (req, res) => {
    const { page, _id, itemsPerPage } = req.params;
    let { search, filters } = req.query;
    search = search || "";
    filters = filters || "";
    const filterData = { page, itemsPerPage, res, search, filters };
    signupModel_1.signupModel.findById(_id, { auth: 1, _id: 1 }, (err, foundUser) => {
        const id = foundUser._id;
        if (err) {
            return res.status(400).json(err);
        }
        switch (foundUser.auth) {
            case "user":
                getCall({ assignedEmployeeId: id }, filterData);
                break;
            case "admin":
                getCall({ problemType: { $nin: ["Quotation", "Lead"] } }, filterData);
                break;
            case "sales admin":
                getCall({ problemType: { $in: ["Quotation", "Lead"] } }, filterData);
                break;
            default:
                res.status(400).json("Invalid auth");
                break;
        }
    });
};
exports.getCalls = getCalls;
const createCall = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { _id } = req.params;
    callModel_1.callModel
        .findOne({}, { id: 1 }, { sort: { id: -1 } })
        .then((result) => {
        const id = genId(result.id);
        const newCall = new callModel_1.callModel(req.body);
        newCall.id = id;
        newCall.registeredBy = _id;
        newCall
            .save()
            .then(() => {
            res.status(201).json("Call created");
        })
            .catch((err) => {
            res.status(400).json(err);
        });
    })
        .catch(() => {
        const id = genId("0");
        const newCall = new callModel_1.callModel(req.body);
        newCall.id = id;
        newCall.registeredBy = _id;
        newCall
            .save()
            .then(() => {
            res.status(201).json("Call created");
        })
            .catch((err) => {
            res.status(400).json(err);
        });
    });
};
exports.createCall = createCall;
const updateCall = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const updatedCall = new callModel_1.callModel(req.body);
    callModel_1.callModel
        .findByIdAndUpdate(req.body._id, updatedCall)
        .then(() => res.status(203).json("Call updated"))
        .catch((err) => res.status(400).json(err));
};
exports.updateCall = updateCall;
const deleteCall = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    callModel_1.callModel
        .findByIdAndDelete(req.params.callId)
        .then(() => res.status(202).json("Call deleted"))
        .catch((err) => res.status(404).json(err));
};
exports.deleteCall = deleteCall;
const addAction = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    callModel_1.callModel
        .findById(req.body._id)
        .then((result) => {
        result.actions.push({
            actionTaken: req.body.actionTaken,
            actionStarted: req.body.actionStarted,
            employee: req.body.employee,
        });
        result.assignedEmployeeId = req.body.employee;
        if (req.body.complete) {
            result.callStatus = "Completed";
            result.endDate = new Date().getTime();
        }
        else {
            result.callStatus = "In Progress";
        }
        if (!result.startAction) {
            result.startAction = new Date().toLocaleDateString();
        }
        callModel_1.callModel
            .findByIdAndUpdate(req.body._id, result)
            .then(() => {
            res.status(201).json("Action added");
        })
            .catch((err) => res.status(404).json(err));
    })
        .catch((err) => res.status(404).json(err));
};
exports.addAction = addAction;
const companyReport = (req, res) => {
    const { companyId, startDate, endDate } = req.params;
    callModel_1.callModel.find({
        callStatus: "Completed",
    }, (err, foundCalls) => {
        if (err) {
            res.status(400).json(err);
        }
        else if (foundCalls) {
            const filteredCalls = foundCalls.filter((call) => call.companyName &&
                call.companyName.toString() === companyId &&
                call.endDate <= +endDate &&
                call.startDate >= +startDate);
            res.status(200).json(filteredCalls);
        }
        else {
            res.status(404).json("Company not found");
        }
    });
};
exports.companyReport = companyReport;
const employeeReport = (req, res) => {
    const { employeeId, startDate, endDate } = req.params;
    callModel_1.callModel.find({ assignedEmployeeId: employeeId }, (err, foundCalls) => {
        if (err) {
            res.status(400).json(err);
        }
        else if (foundCalls) {
            const filteredCalls = foundCalls.filter((call) => call.callStatus === "Completed" &&
                new Date(call.startDate).getTime() >= +startDate &&
                new Date(call.endDate).getTime() <= +endDate);
            res.status(200).json(filteredCalls);
        }
        else {
            res.status(404).json("User not found");
        }
    });
};
exports.employeeReport = employeeReport;
