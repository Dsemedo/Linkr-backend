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
