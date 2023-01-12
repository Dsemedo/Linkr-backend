import { connectionDb } from "../database/database.js"
import urlMetadata from "url-metadata"
export async function userController(req, res) {
  const { id } = req.params
  try {
    const posts = await connectionDb.query(
      `
      SELECT p.id, p.description, p.link, p."userId", u.username, u.picture, COUNT(l."idPost") as likes, json_agg(l.username) as "usersWhoLiked"
      FROM posts p
      JOIN users u
      ON p."userId" = u.id
      LEFT JOIN likes l
      ON l."idPost" = p.id
      WHERE "userId" = $1
      GROUP BY p.id, u.id
      ORDER BY id DESC LIMIT 20
        `,
      [id]
    )
    const newArray = await Promise.all(
      posts.rows.map(async (e) => {
        let newPosts = { ...e }

        const metadataLink = await urlMetadata(e.link).then(
          function (metadata) {
            // success handler

            newPosts.urlTitle = metadata.title
            newPosts.urlImage = metadata.image
            newPosts.urlDescription = metadata.description
          },
          function (error) {
            // failure handler
            console.log(error)
          }
        )
        return newPosts
      })
    )

    res.send(newArray)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

export async function searchUserController(req, res) {
  const { search } = req.body

  try {
    const { rows } = await connectionDb.query(
      `SELECT * FROM users WHERE username LIKE $1`,
      [`${search}%`]
    )

    res.send(rows)

  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}