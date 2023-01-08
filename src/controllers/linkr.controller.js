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
  try {
    const posts = await connectionDb.query(
      `SELECT p.id, p.description, p.link, u.username, u.picture, COUNT(l."idPost") as likes 
      FROM posts p
      JOIN users u
      ON p."userId" = u.id
      LEFT JOIN likes l
      ON l."idPost" = p.id
      GROUP BY p.id, u.id
      ORDER BY id DESC LIMIT 20
      `
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
