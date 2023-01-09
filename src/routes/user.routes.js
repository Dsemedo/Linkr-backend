import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
export const userRoute = Router();

userRoute.get("/user/:id", userController);