"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./api/routes"));
const node_schedule_1 = require("node-schedule");
const companyController_1 = require("./controller/companyController");
const port = process.env.PORT || 5000;
dotenv_1.default.config();
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect(process.env.MONGO_URI || process.env.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "50mb" }));
(0, node_schedule_1.scheduleJob)("0 9 * * *", () => {
    (0, companyController_1.amcCall)();
});
app.all("/*", (_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(routes_1.default);
app.use("/", (req, res) => res.json("404 not found"));
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
