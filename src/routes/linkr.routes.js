import { Router } from "express";
import { linkrController, getPosts, linkrDeleteController } from "../controllers/linkr.controller.js";
import { linkrMiddleware, deleteMiddleware } from "../middlewares/linkr.middleware.js";
export const linkrRoute = Router();

linkrRoute.post("/timeline", linkrMiddleware, linkrController);

linkrRoute.get("/timeline", getPosts);

linkrRoute.delete("/timeline/:id", deleteMiddleware , linkrDeleteController);