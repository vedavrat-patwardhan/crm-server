import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { SignupInterface } from "../config/interfaces";
import { signupModel } from "../model/signupModel";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const createUser: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newUser = new signupModel(req.body);
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

export const updateUser: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const updatedUser = new signupModel(req.body);
  bcrypt.hash(updatedUser.password, saltRounds, (_err, hash) => {
    updatedUser.password = hash;
    signupModel.findByIdAndUpdate(
      req.params.id,
      updatedUser,
      (err: any, result: SignupInterface) => {
        if (err) {
          return res.status(400).json(err);
        } else if (result) {
          res.status(203).json("User updated");
        } else {
          res.status(400).json("Invalid ID");
        }
      }
    );
  });
};
export const getUserData: RequestHandler = (req, res) => {
  let { page, itemsPerPage } = req.params;
  let usersCounter = 0;
  if (isNaN(+page)) {
    return res.status(403).json("Invalid page number");
  }
  signupModel
    .find()
    .count()
    .then((usersCount: number) => {
      usersCounter = usersCount;
      return signupModel
        .find({}, { password: 0 })
        .skip((+page - 1) * +itemsPerPage)
        .limit(+itemsPerPage);
    })
    .then((result: SignupInterface[]) => {
      res.status(200).json({ users: result, totalUsers: usersCounter });
    })
    .catch((err) => res.status(400).json(err));
};

export const getUserList: RequestHandler = (_req, res) => {
  signupModel
    .find({}, { name: 1 })
    .then((foundList: { _id: string; name: string }[]) =>
      res.status(200).json(foundList)
    )
    .catch((err: any) => res.status(400).json(err));
};

export const deleteUser: RequestHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  signupModel.findByIdAndDelete(
    req.params.id,
    (err: any, result: SignupInterface) => {
      if (err) {
        return res.status(400).json(err);
      } else if (result) {
        res.status(202).json("User Deleted");
      } else {
        res.status(404).json("No user with this id is present");
      }
    }
  );
};
