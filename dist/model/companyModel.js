"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyModel = void 0;
const mongoose_1 = require("mongoose");
const signupModel_1 = require("./signupModel");
const personDetailsSchema = new mongoose_1.Schema({
    name: String,
    mobile: [String],
    email: String,
});
const companySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    contactPerson: [personDetailsSchema],
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    amc: {
        maintain: { type: Boolean, required: true },
        week: Number,
        day: Number,
        employee: { type: String, ref: signupModel_1.signupModel },
    },
    weeklyOff: [String],
});
exports.companyModel = (0, mongoose_1.model)("company", companySchema);
