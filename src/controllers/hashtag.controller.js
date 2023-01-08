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
  const hashtag = `#${req.params.hashtag}`

  try {
    const posts = await connectionDb.query(
      `
      SELECT
        posts.id,
        posts.description,
        posts.link,
        users.username,
        users.picture,
        COUNT(likes."idPost") as likes
      FROM
          hashtags
      INNER JOIN
          posts ON posts.id = hashtags."idPost"
      INNER JOIN
          users ON users.id = posts."userId"
      LEFT JOIN
          likes ON likes."idPost" = posts.id
      WHERE
          hashtag = $1
      GROUP BY
          posts.id, users.id
      `, [hashtag]);
    return res.send(posts.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
