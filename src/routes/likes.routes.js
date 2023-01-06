import { Router } from "express";
import { likesMiddleware } from "../middlewares/likes.middlewares.js";
import { addLike } from "../controllers/likes.controller.js";
export const likeRouter = Router();
likeRouter.post("/likes", likesMiddleware,addLike);
