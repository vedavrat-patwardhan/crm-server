import { RequestHandler, Response } from "express";
import { signupModel } from "../model/signupModel";
import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SignupInterface } from "../config/interfaces";

const saltRounds = 10;

const hashPass = (res: Response, newUser: any) => {
  bcrypt.hash(newUser.password, saltRounds, (_err, hash) => {
    newUser.password = hash;
    newUser
      .save()
      .then((user: SignupInterface) => res.status(201).json(user))
      .catch((error: any) => {
        res.status(400).json(error);
      });
  });
};

export const register: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { auth } = req.params;
  const newUser = new signupModel({ ...req.body, auth });
  if (auth === "admin") {
    hashPass(res, newUser);
  } else {
    const { adminMail, adminPassword } = req.query;
    signupModel.findOne(
      { email: adminMail },
      (err: any, admin: SignupInterface) => {
        if (err) {
          res.status(400).json(err);
        } else if (admin && admin.auth.includes("admin")) {
          //@ts-ignore:next-line
          bcrypt.compare(adminPassword, admin.password, (_err2, result) => {
            if (result) {
              hashPass(res, newUser);
            } else {
              res.status(400).json("Invalid Admin Password");
            }
          });
        } else {
          res.status(400).json("Invalid Admin Credentials");
        }
      }
    );
  }
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body;
  signupModel.findOne({ email }, (err: any, foundUser: SignupInterface) => {
    if (err) {
      return res.status(400).json(err);
    }
    if (foundUser?.disabled) {
      return res.status(401).json({ email: "This user is disabled" });
    }
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, (_err2, result) => {
        if (result) {
          const token = jwt.sign(
            {
              _id: foundUser._id,
              auth: foundUser.auth,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "8h" }
          );
          res.status(200).json({ token, auth: foundUser.auth });
        } else {
          res.status(400).json({ email: "", password: "Wrong Password" });
        }
      });
    } else {
      res
        .status(400)
        .json({ email: "This email does not exist", password: "" });
    }
  });
};

export const changePass: RequestHandler = (req, res) => {
  const { currentPass, newPass } = req.body;
  const { _id } = req.params;
  signupModel
    .findById(_id)
    .then((foundUser: SignupInterface) => {
      bcrypt.compare(
        currentPass,
        foundUser.password,
        (err: any, result: boolean) => {
          if (err) {
            return res.status(400).json(err);
          }
          if (result) {
            bcrypt.hash(newPass, saltRounds, (err1, hash) => {
              signupModel
                .findByIdAndUpdate(_id, { password: hash })
                .then(() =>
                  res.status(202).json("Password updated successfully")
                );
            });
          } else {
            res.status(404).json({
              currentPass: "Wrong Password",
              confirmNewPass: "",
            });
          }
        }
      );
    })
    .catch((error) => {
      res.status(404).json(error);
    });
};
