import { authSignInSchema, authSignUpSchema } from "../models/auth.models.js"

export async function signUpAuthMiddleware(req, res, next) {
  const auth = req.body

  const validation = authSignUpSchema.validate(auth, { abortEarly: false })
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message)
    res.status(422).send(error)
    return
  }

  next()
}

export async function signInAuthMiddleware(req, res, next) {
  const auth = req.body

  const validation = authSignInSchema.validate(auth, { abortEarly: false })
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message)
    res.status(422).send(error)
    return
  }

  next()
}