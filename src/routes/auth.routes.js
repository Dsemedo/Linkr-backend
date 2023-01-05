import { Router } from "express";
import {
  signUpAuthController,
  signInAuthController,
  getUsers,
} from "../controllers/auth.controller.js";
import {
  signUpAuthMiddleware,
  signInAuthMiddleware,
} from "../middlewares/auth.middleware.js";
export const authRoute = Router();

authRoute.post("/sign-in", signInAuthMiddleware, signInAuthController);

authRoute.post("/sign-up", signUpAuthMiddleware, signUpAuthController);

authRoute.get("/sign-in", getUsers);
