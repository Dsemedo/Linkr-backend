import { usersSchema } from "../models/users.model.js"

export async function searchUserMiddleware(req, res, next) {
  const search = req.body

  const validation = usersSchema.validate(search, { abortEarly: false })
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message)
    res.status(422).send(error)
    return
  }

  next()
}

