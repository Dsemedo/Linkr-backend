import { Router } from "express"
import { followController, deleteFollowController } from "../controllers/follows.controller.js"
import { followMiddleware } from "../middlewares/follow.middlewares.js"

export const followRouter = Router()

followRouter.post("/follow/:id", followMiddleware, followController)

followRouter.delete("/follow/:id", followMiddleware, deleteFollowController)


