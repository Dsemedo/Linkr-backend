import { Router } from "express";
import { hashtagController, hashtagTimeline } from "../controllers/hashtag.controller.js";
export const hashtagRoute = Router();

hashtagRoute.get("/hashtag", hashtagController);
hashtagRoute.get("/hashtag/:hashtag", hashtagTimeline)


