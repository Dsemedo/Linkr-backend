import { connectionDb } from "../database/database.js";

export async function linkrController(req, res) {
  const { description, link } = req.body;
  const userId = res.locals.userId;

  try {
    const { rows } = await connectionDb.query(
      `INSERT INTO posts (description, link, "userId") VALUES ($1,$2, $3) RETURNING *;`,
      [description, link, userId]
    );
    return res.status(200).send(rows);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err.details);
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await connectionDb.query("SELECT * FROM posts;");
    res.send(posts.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
