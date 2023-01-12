import { Router } from "express"
import { likesMiddleware } from "../middlewares/likes.middlewares.js"
import { addLike, deleteLike } from "../controllers/likes.controller.js"

export const likeRouter = Router()

likeRouter.post("/likes/:id", likesMiddleware, addLike)

likeRouter.delete("/likes/:id", likesMiddleware, deleteLike)
