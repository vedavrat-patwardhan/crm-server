"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePass = exports.login = exports.register = void 0;
const signupModel_1 = require("../model/signupModel");
const express_validator_1 = require("express-validator");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const hashPass = (res, newUser) => {
    bcrypt_1.default.hash(newUser.password, saltRounds, (_err, hash) => {
        newUser.password = hash;
        newUser
            .save()
            .then((user) => res.status(201).json(user))
            .catch((error) => {
            res.status(400).json(error);
        });
    });
};
const register = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { auth } = req.params;
    const newUser = new signupModel_1.signupModel({ ...req.body, auth });
    if (auth === "admin") {
        hashPass(res, newUser);
    }
    else {
        const { adminMail, adminPassword } = req.query;
        signupModel_1.signupModel.findOne({ email: adminMail }, (err, admin) => {
            if (err) {
                res.status(400).json(err);
            }
            else if (admin && admin.auth.includes("admin")) {
                bcrypt_1.default.compare(adminPassword, admin.password, (_err2, result) => {
                    if (result) {
                        hashPass(res, newUser);
                    }
                    else {
                        res.status(400).json("Invalid Admin Password");
                    }
                });
            }
            else {
                res.status(400).json("Invalid Admin Credentials");
            }
        });
    }
};
exports.register = register;
const login = (req, res) => {
    const { email, password } = req.body;
    signupModel_1.signupModel.findOne({ email }, (err, foundUser) => {
        if (err) {
            return res.status(400).json(err);
        }
        if (foundUser === null || foundUser === void 0 ? void 0 : foundUser.disabled) {
            return res.status(401).json({ email: "This user is disabled" });
        }
        if (foundUser) {
            bcrypt_1.default.compare(password, foundUser.password, (_err2, result) => {
                if (result) {
                    const token = jwt.sign({
                        _id: foundUser._id,
                        auth: foundUser.auth,
                    }, process.env.JWT_SECRET, { expiresIn: "8h" });
                    res.status(200).json({ token, auth: foundUser.auth });
                }
                else {
                    res.status(400).json({ email: "", password: "Wrong Password" });
                }
            });
        }
        else {
            res
                .status(400)
                .json({ email: "This email does not exist", password: "" });
        }
    });
};
exports.login = login;
const changePass = (req, res) => {
    const { currentPass, newPass } = req.body;
    const { _id } = req.params;
    signupModel_1.signupModel
        .findById(_id)
        .then((foundUser) => {
        bcrypt_1.default.compare(currentPass, foundUser.password, (err, result) => {
            if (err) {
                return res.status(400).json(err);
            }
            if (result) {
                bcrypt_1.default.hash(newPass, saltRounds, (err1, hash) => {
                    signupModel_1.signupModel
                        .findByIdAndUpdate(_id, { password: hash })
                        .then(() => res.status(202).json("Password updated successfully"));
                });
            }
            else {
                res.status(404).json({
                    currentPass: "Wrong Password",
                    confirmNewPass: "",
                });
            }
        });
    })
        .catch((error) => {
        res.status(404).json(error);
    });
};
exports.changePass = changePass;
