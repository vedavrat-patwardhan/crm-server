"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyModel = void 0;
const mongoose_1 = require("mongoose");
const signupModel_1 = require("./signupModel");
const personDetailsSchema = new mongoose_1.Schema({
    name: String,
    mobile: [String],
    email: String,
}, { _id: false });
const companySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    contactPerson: [personDetailsSchema],
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    hasAmc: { type: Boolean, required: true },
    amc: [
        {
            week: { type: Number, enum: [0, 1, 2, 3, 4] },
            day: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6] },
            employee: { type: mongoose_1.Schema.Types.ObjectId, ref: signupModel_1.signupModel },
        },
    ],
    weeklyOff: [String],
});
exports.companyModel = (0, mongoose_1.model)("company", companySchema);
