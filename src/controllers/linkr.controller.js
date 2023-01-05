import { connectionDb } from "../database/database.js";

export async function linkrController(req, res) {
  const { description, link } = req.body;
  try {
    await connectionDb.query(
      `INSERT INTO posts (description, link) VALUES ($1,$2);`,
      [description, link]
    );
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err.detail);
  }
}
