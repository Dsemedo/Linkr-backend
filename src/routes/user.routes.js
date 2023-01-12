import { Router } from "express";
import { userController, searchUserController, searchUserForName } from "../controllers/user.controller.js";
import { searchUserMiddleware } from "../middlewares/users.middlewares.js";

export const userRoute = Router();

userRoute.get("/user/:id", userController);

userRoute.get("/users", searchUserMiddleware, searchUserController);

userRoute.get("/users/:name",searchUserForName);