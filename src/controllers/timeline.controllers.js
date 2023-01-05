import { connectionDb } from "../database/database";

export async function getPosts(req, res) {
  try {
    const posts = await connectionDb.query(
      "SELECT * FROM posts ORDER BY id DESC LIMIT 20"
    );
    res.send(posts.rows);
  } catch (error) {
    console.log(error);
  }
}