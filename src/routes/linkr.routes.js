import { Router } from "express";
import { linkrController } from "../controllers/linkr.controller.js";
import { linkrMiddleware } from "../middlewares/linkr.middleware.js";
export const linkrRoute = Router();

linkrRoute.post("/timeline", linkrMiddleware, linkrController);
