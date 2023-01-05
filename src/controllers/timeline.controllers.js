import { connectionDb } from "../database/database";

export async function getPosts(req, res) {
  try {
    const posts = await connectionDb.query(
      `
      SELECT posts.*, users.username, users.picture, users.id AS "userId"
      FROM posts 
      JOIN users ON users.id = posts."userId" 
      ORDER BY id DESC LIMIT 20
      `
    );
    res.send(posts.rows);
  } catch (error) {
    console.log(error);
  }
}