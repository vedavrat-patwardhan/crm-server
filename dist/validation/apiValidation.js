"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
const signupModel_1 = require("../model/signupModel");
const validateRegister = () => {
    return [
        (0, express_validator_1.check)("email")
            .normalizeEmail()
            .isEmail()
            .withMessage("Invalid mail")
            .custom((value) => {
            return signupModel_1.signupModel
                .findOne({ email: value })
                .then((user) => {
                if (user) {
                    return Promise.reject("Email already exists");
                }
            });
        }),
        (0, express_validator_1.check)("password")
            .isLength({ min: 6 })
            .withMessage("Password must be atleast 6 characters"),
    ];
};
exports.validateRegister = validateRegister;
