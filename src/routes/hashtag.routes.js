import { Router } from "express"
import {
  hashtagController,
  hashtagTimeline,
} from "../controllers/hashtag.controller.js"
export const hashtagRoute = Router()

hashtagRoute.get("/hashtags", hashtagController)

hashtagRoute.get("/hashtags/:hashtag", hashtagTimeline)
