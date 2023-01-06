import { connectionDb } from "../database/database.js";

export async function linkrController(req, res) {
  const { description, link } = req.body;
  const userId = res.locals.userId;

  try {
    const { rows } = await connectionDb.query(
      `INSERT INTO posts (description, link, "userId") VALUES ($1,$2, $3) RETURNING *`,
      [description, link, userId]
    );

    if(description){
      const descriptionPost = rows[0].description

      const descriptionSplit = descriptionPost.split(" ")
  
      const hashtagsFilter = descriptionSplit.filter((e) => e[0] === "#")

      hashtagsFilter.forEach( async (hash) => await connectionDb.query(
        `INSERT INTO hashtags (hashtag, "idPost") VALUES ($1,$2)`,
        [hash, rows[0].id]
      ))
    }
    return res.status(201).send(rows);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err.details);
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await connectionDb.query(
      `SELECT p.id, p.description, p.link, u.username, u.picture 
      FROM posts p
      JOIN users u
      ON p."userId" = u.id 
      ORDER BY id DESC LIMIT 20
      `);
    res.send(posts.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
