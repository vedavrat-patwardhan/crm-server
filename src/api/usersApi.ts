import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserData,
  getUserList,
  updateUser,
} from "../controller/usersController";
import { jwtAuth } from "../middleware/isAuth";

const usersRouter = Router();

usersRouter.post("/create-user", jwtAuth, createUser);
usersRouter.get("/users/:itemsPerPage/:page", jwtAuth, getUserData);
usersRouter.get("/users-list", jwtAuth, getUserList);
usersRouter.patch("/update-user/:id", jwtAuth, updateUser);
usersRouter.delete("/delete-user/:id", jwtAuth, deleteUser);

export default usersRouter;
