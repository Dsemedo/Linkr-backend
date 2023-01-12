import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

export async function likesMiddleware(req, res, next) {
  const idPost = req.params.id
  const { authorization } = req.headers
  const isNum = /^\d+$/.test(idPost)

  if (!isNum) {
    res.sendStatus(400)
    return
  }

  if (!authorization) {
    return res.sendStatus(401)
  }
  const parts = authorization.split(" ")

  const [schema, token] = parts

  if (schema !== "Bearer") {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Token invalid!!" })
    } else {
      res.locals.userId = decoded.id
    }
  })

  next()
}
