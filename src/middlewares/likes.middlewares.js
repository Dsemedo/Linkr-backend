import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()
import { likeSchema } from "../models/like.model.js"

export async function likesMiddleware(req, res, next) {
  const idUser = req.body
  const { authorization } = req.headers
  if (!authorization) {
    return res.sendStatus(401)
  }
  const parts = authorization.split(" ")

  const [schema, token] = parts

  if (schema !== "Bearer") {
    return res.send(401)
  }

  jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Token invalid!!" })
    } else {
      res.locals.userId = decoded.id
    }
  })
  const validation = likeSchema.validate(idUser, { abortEarly: false })
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message)
    return res.status(422).send(error)
  }

  next()
}
