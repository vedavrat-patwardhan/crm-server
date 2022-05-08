import { check, ValidationChain } from "express-validator";
import { SignupInterface } from "../config/interfaces";
import { signupModel } from "../model/signupModel";

export const validateRegister: () => ValidationChain[] = () => {
  return [
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid mail")
      .custom((value: any) => {
        return signupModel
          .findOne({ email: value })
          .then((user: SignupInterface) => {
            if (user) {
              return Promise.reject("Email already exists");
            }
          });
      }),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters"),
  ];
};
