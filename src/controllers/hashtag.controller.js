import { connectionDb } from "../database/database.js"

export async function hashtagController(req, res) {
  try {
    const hashtags = await connectionDb.query(
      `SELECT hashtag, COUNT(hashtag) as "totalAmount" 
      FROM hashtags 
      GROUP BY hashtag 
      ORDER BY "totalAmount" 
      DESC LIMIT 10`
    )
    res.send(hashtags.rows)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function hashtagTimeline (req, res){
  const {hashtag} = req.params;
  try {
    const posts = await connectionDb.query(
      `SELECT p.id, p.description, p.link, u.username, u.picture, COUNT(l."idPost") as likes 
      FROM posts p
      JOIN users u
      ON p."userId" = u.id
      LEFT JOIN likes l
      ON l."idPost" = p.id
      WHERE p.description LIKE '%' || $1 || '%'
      GROUP BY p.id, u.id 
      ORDER BY id DESC LIMIT 20
      `, [hashtag]);
    return res.send(posts.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
