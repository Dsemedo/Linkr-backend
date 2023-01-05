import { Router } from "express";
import { getPosts } from "../controllers/timeline.controllers.js";

const router = Router();

router.get("/timeline", getPosts);

export default router;