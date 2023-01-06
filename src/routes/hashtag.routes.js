import { Router } from "express";
import { hashtagController } from "../controllers/hashtag.controller.js";
export const hashtagRoute = Router();

hashtagRoute.get("/hashtag", hashtagController);


