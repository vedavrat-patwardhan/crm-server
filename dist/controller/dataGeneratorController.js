"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallDetails = void 0;
const callModel_1 = require("../model/callModel");
const getCallDetails = async (req, res) => {
    const { fromTime, toTime } = req.query;
    if (!fromTime || !toTime) {
        return res.status(400).json({
            message: "Please provide a valid fromTime and toTime",
        });
    }
    const calls = await callModel_1.callModel
        .find({
        startDate: {
            $gte: +fromTime,
            $lte: +toTime,
        },
    })
        .populate("companyName", "name")
        .populate("assignedEmployeeId", "name")
        .populate("actions.employee", "name");
    const data = calls.map((call) => ({
        companyDetails: call.companyName.name,
        initiallyAssignedEmployee: call.assignedEmployeeId.name,
        Engineers: [
            ...new Set(call.actions
                .filter((action) => { var _a; return (_a = action.employee) === null || _a === void 0 ? void 0 : _a.name; })
                .map((action) => action.employee.name)),
        ].join(", "),
        callType: call.problemType,
    }));
    res.status(200).json(data);
};
exports.getCallDetails = getCallDetails;
