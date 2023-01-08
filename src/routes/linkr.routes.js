import { Router } from "express";
import { linkrController, getPosts, linkrDeleteController, linkrPatchController } from "../controllers/linkr.controller.js";
import { linkrMiddleware, deleteMiddleware } from "../middlewares/linkr.middleware.js";
export const linkrRoute = Router();

linkrRoute.post("/timeline", linkrMiddleware, linkrController);

linkrRoute.get("/timeline", getPosts);

linkrRoute.delete("/timeline/:id", deleteMiddleware , linkrDeleteController);

linkrRoute.patch("/timeline/:id", linkrMiddleware , linkrPatchController);