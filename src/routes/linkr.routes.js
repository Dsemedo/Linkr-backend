import { Router } from "express";
import { linkrController, getPosts } from "../controllers/linkr.controller.js";
import { linkrMiddleware } from "../middlewares/linkr.middleware.js";
export const linkrRoute = Router();

linkrRoute.post("/timeline", linkrMiddleware, linkrController);

linkrRoute.get("/timeline", getPosts);
