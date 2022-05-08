// @ts-nocheck
import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

export const jwtAuth: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json("Header not found");
  }
  const token = req.header("Authorization")!.split(" ")[1];
  if (!token) {
    return res.status(401).json("No token, authorization denied");
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(401).json("Unauthorized");
    }
    req.params._id = decoded._id;
    req.params.auth = decoded.auth;
    next();
  });
};
