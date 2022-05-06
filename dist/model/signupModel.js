"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupModel = void 0;
const mongoose_1 = require("mongoose");
const signupSchema = new mongoose_1.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    dob: String,
    mobileNo: { type: [String], required: true },
    auth: { type: String, required: true },
});
exports.signupModel = (0, mongoose_1.model)("user", signupSchema);
