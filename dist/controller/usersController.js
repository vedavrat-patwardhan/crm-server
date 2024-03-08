"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserList = exports.getUserData = exports.updateUser = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const signupModel_1 = require("../model/signupModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const createUser = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const newUser = new signupModel_1.signupModel(req.body);
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
exports.createUser = createUser;
const updateUser = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const updatedUser = new signupModel_1.signupModel(req.body);
    bcrypt_1.default.hash(updatedUser.password, saltRounds, (_err, hash) => {
        updatedUser.password = hash;
        signupModel_1.signupModel.findByIdAndUpdate(req.params.id, updatedUser, (err, result) => {
            if (err) {
                return res.status(400).json(err);
            }
            else if (result) {
                res.status(203).json("User updated");
            }
            else {
                res.status(400).json("Invalid ID");
            }
        });
    });
};
exports.updateUser = updateUser;
const getUserData = (req, res) => {
    let { page, itemsPerPage } = req.params;
    let { search } = req.query;
    search = search !== null && search !== void 0 ? search : "";
    let usersCounter = 0;
    if (isNaN(+page)) {
        return res.status(403).json("Invalid page number");
    }
    if (search) {
        signupModel_1.signupModel
            .find({ disabled: false })
            .sort({ name: 1 })
            .then((users) => {
            usersCounter = users.length;
            const filteredData = users.filter((user) => {
                return (user.name.toLowerCase().includes(search.toLowerCase()));
            });
            res.status(200).json({
                users: filteredData.slice((+page - 1) * +itemsPerPage, +page * +itemsPerPage),
                totalUsers: usersCounter,
            });
        });
    }
    else {
        signupModel_1.signupModel
            .find({ disabled: false })
            .count()
            .then((usersCount) => {
            usersCounter = usersCount;
            return signupModel_1.signupModel
                .find({ disabled: false }, { password: 0 })
                .skip((+page - 1) * +itemsPerPage)
                .limit(+itemsPerPage);
        })
            .then((result) => {
            res.status(200).json({ users: result, totalUsers: usersCounter });
        })
            .catch((err) => res.status(400).json(err));
    }
};
exports.getUserData = getUserData;
const getUserList = (_req, res) => {
    signupModel_1.signupModel
        .find({ disabled: false }, { name: 1 })
        .then((foundList) => res.status(200).json(foundList))
        .catch((err) => res.status(400).json(err));
};
exports.getUserList = getUserList;
const deleteUser = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    signupModel_1.signupModel.findByIdAndUpdate(req.params.id, { disabled: true }, (err, result) => {
        if (err) {
            return res.status(400).json(err);
        }
        else if (result) {
            res.status(202).json("User Disabled");
        }
        else {
            res.status(404).json("No user with this id is present");
        }
    });
};
exports.deleteUser = deleteUser;
