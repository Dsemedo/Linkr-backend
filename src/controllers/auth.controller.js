import bcrypt from "bcrypt"
import { connectionDb } from "../database/database.js"
import jwt from "jsonwebtoken"

export async function signUpAuthController(req, res) {}

export async function signInAuthController(req, res) {
  const { email, password } = req.body

  try {
    const userFounded = await connectionDb.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    )

    if (!userFounded.rows[0]) {
      return res.sendStatus(404)
    }

    const passwordCompared = bcrypt.compareSync(
      password,
      userFounded.rows[0].password
    )

    if (!passwordCompared) {
      return res.sendStatus(401).send({ message: "Email or Password not found" })
    }
   
    const generateToken = (id) =>
    jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 });

    const token = generateToken(userFounded.rows[0].id);

    res.send(token)
  } catch (err) {
    res.send(err).status(400)
  }
}
