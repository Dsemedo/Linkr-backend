import { linkrSchema } from "../models/linkr.models.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export async function linkrMiddleware(req, res, next) {
  const linkr = req.body
  const { authorization } = req.headers

  try {
    const { error } = linkrSchema.validate(linkr, { abortEarly: false })
    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return res.status(409).send(errors)
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

      return next()
    })
  } catch (err) {
    res.status(401).send(err.message)
  }
}

export async function deleteMiddleware(req, res, next) {
  const { authorization } = req.headers
  const id = req.params.id
  const isNum = /^\d+$/.test(id)
  
  if (!isNum) {
    res.sendStatus(400)
    return
  }

  try {

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

      next()
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function tokenMiddleware(req, res, next) {
  const { authorization } = req.headers

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