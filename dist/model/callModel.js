"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callModel = void 0;
const mongoose_1 = require("mongoose");
const companyModel_1 = require("./companyModel");
const signupModel_1 = require("./signupModel");
const actionSchema = new mongoose_1.Schema({
    actionTaken: { type: String, required: true },
    actionStarted: { type: String, required: true },
    employee: { type: mongoose_1.Schema.Types.ObjectId, ref: signupModel_1.signupModel, required: true },
});
const callSchema = new mongoose_1.Schema({
    id: { type: Number, required: true, unique: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    callDescription: { type: String, required: true },
    contactPerson: String,
    companyName: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: companyModel_1.companyModel,
    },
    email: String,
    mobile: [String],
    assignedEmployeeId: { type: mongoose_1.Schema.Types.ObjectId, ref: signupModel_1.signupModel },
    registeredBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: signupModel_1.signupModel,
        required: true,
    },
    callStatus: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: String,
    startAction: String,
    endAction: String,
    problemType: { type: String, required: true },
    expClosure: { type: String, required: true },
    actions: [actionSchema],
});
exports.callModel = (0, mongoose_1.model)("call", callSchema);
