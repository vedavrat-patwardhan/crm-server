import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./api/routes";
dotenv.config();

const port = process.env.PORT ?? 5000;

mongoose.Promise = global.Promise;
//@ts-ignore:next-line
mongoose.connect(process.env.MONGO_URI ?? process.env.mongodbUri, {
  //For mongoDB connection
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));

app.all("/*", (_req: Request, res: Response, next: NextFunction) => {
  //For CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(router);
app.use("/", (req, res) => res.json("404 not found"));
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
