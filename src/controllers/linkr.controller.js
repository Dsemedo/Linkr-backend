import { connectionDb } from "../database/database.js"
import urlMetadata from "url-metadata"

export async function linkrController(req, res) {
  const { description, link } = req.body
  const userId = res.locals.userId

  try {
    const { rows } = await connectionDb.query(
      `INSERT INTO posts (description, link, "userId") VALUES ($1,$2, $3) RETURNING *`,
      [description, link, userId]
    )

    if (description) {
      const descriptionPost = rows[0].description

      const descriptionSplit = descriptionPost.split(" ")

      const hashtagsFilter = descriptionSplit.filter((e) => e[0] === "#")

      hashtagsFilter.forEach(
        async (hash) =>
          await connectionDb.query(
            `INSERT INTO hashtags (hashtag, "idPost") VALUES ($1,$2)`,
            [hash, rows[0].id]
          )
      )
    }
    return res.status(201).send(rows)
  } catch (err) {
    console.log(err)
    return res.status(404).send(err.details)
  }
}

export async function getPosts(req, res) {
  const userId = res.locals.userId

  try {
    const checkIfExist = await connectionDb.query(
      `SELECT * FROM follows WHERE "usernameId"=$1`,
      [userId]
    )
    if (!checkIfExist.rows[0]) {
      res
        .status(404)
        .send("You don't follow anyone yet. Search for new friends!")
      return
    }

    const postsFollowed = await connectionDb.query(
      `SELECT p.id, p.description, p.link, p."userId", u.username, u.picture, COUNT(l."idPost") as likes, json_agg(l.username) as "usersWhoLiked"
    FROM follows f
    JOIN posts p
    ON p."userId" = f."followedUserId" 
    JOIN users u
    ON u.id = p."userId"
    LEFT JOIN likes l
    ON l."idPost" = p.id
    WHERE f."usernameId" = $1
    GROUP BY p.id, u.id
    ORDER BY id DESC
    `,
      [userId]
    )
    const newArrayFollowed = await Promise.all(
      postsFollowed.rows.map(async (e) => {
        let newPosts = { ...e }
        await urlMetadata(e.link).then(
          function (metadata) {
            newPosts.urlTitle = metadata.title
            newPosts.urlImage = metadata.image
            newPosts.urlDescription = metadata.description
          },
          function (error) {
            console.log(error)
          }
        )
        return newPosts
      })
    )
    if (!postsFollowed.rows[0]) {
      res.status(200).send("No posts found from your friends")
      return
    }

    res.status(200).send(newArrayFollowed)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function linkrDeleteController(req, res) {
  const userId = res.locals.userId
  const id = req.params.id

  try {
    const checkIfExist = await connectionDb.query(
      `SELECT * FROM posts WHERE id=$1 AND "userId"=$2`,
      [id, userId]
    )
    if (!checkIfExist.rows[0]) {
      res.sendStatus(404)
      return
    }

    await connectionDb.query(`DELETE FROM hashtags WHERE "idPost"=$1`, [
      checkIfExist.rows[0].id,
    ])

    await connectionDb.query(`DELETE FROM posts WHERE id=$1 AND "userId"=$2`, [
      id,
      userId,
    ])

    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err.details)
  }
}

export async function linkrPatchController(req, res) {
  const userId = res.locals.userId
  const { description, link } = req.body
  const id = req.params.id
  const isNum = /^\d+$/.test(id)

  if (!isNum) {
    res.sendStatus(400)
    return
  }

  try {
    const checkIfExist = await connectionDb.query(
      `SELECT * FROM posts WHERE id=$1 AND "userId"=$2`,
      [id, userId]
    )
    if (!checkIfExist.rows[0]) {
      res.sendStatus(404)
      return
    }

    await connectionDb.query(`DELETE FROM hashtags WHERE "idPost"=$1`, [
      checkIfExist.rows[0].id,
    ])

    const { rows } = await connectionDb.query(
      `UPDATE posts SET description=$1, link=$2 WHERE id=$3 RETURNING *`,
      [description, link, id]
    )

    const descriptionPost = rows[0].description

    const descriptionSplit = descriptionPost.split(" ")

    const hashtagsFilter = descriptionSplit.filter((e) => e[0] === "#")

    hashtagsFilter.forEach(
      async (hash) =>
        await connectionDb.query(
          `INSERT INTO hashtags (hashtag, "idPost") VALUES ($1,$2)`,
          [hash, rows[0].id]
        )
    )

    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err.details)
  }
}
