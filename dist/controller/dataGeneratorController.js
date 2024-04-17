"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallDetails = void 0;
const callModel_1 = require("../model/callModel");
const getCallDetails = async (req, res) => {
    const { fromTime, toTime } = req.query;
    const fromTimeInSec = new Date(fromTime).getTime();
    const toTimeInSec = new Date(toTime).getTime();
    const calls = await callModel_1.callModel
        .find({
        startDate: {
            $gte: fromTimeInSec,
            $lte: toTimeInSec,
        },
    })
        .populate("companyName", "name")
        .populate("assignedEmployeeId", "name")
        .populate("actions.employee", "name");
    console.log(calls.length);
    const data = calls.map((call) => ({
        companyDetails: call.companyName.name,
        initiallyAssignedEmployee: call.assignedEmployeeId.name,
        actors: [
            ...new Set(call.actions
                .filter((action) => { var _a; return (_a = action.employee) === null || _a === void 0 ? void 0 : _a.name; })
                .map((action) => action.employee.name)),
        ].join(", "),
        callType: call.problemType,
    }));
    res.status(200).json(data);
};
exports.getCallDetails = getCallDetails;
