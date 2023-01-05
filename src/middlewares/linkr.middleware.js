import { linkrSchema } from "../models/linkr.models.js";

export async function linkrMiddleware(req, res, next) {
  const linkr = req.body;

  try {
    const { error } = linkrSchema.validate(linkr, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.status(422).send(errors);
    }
  } catch (err) {
    res.status(401).send(err.message);
  }

  next();
}
