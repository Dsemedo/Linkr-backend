import { connectionDb } from "../database/database.js"

export async function followController(req, res) {
  const userId = res.locals.userId
  const idUserFollowed = req.params.id
  const isNum = /^\d+$/.test(idUserFollowed)

  if (!isNum) {
    res.sendStatus(400)
    return
  }

  try {
    const checkIfUserFollowedExist = await connectionDb.query(
      `SELECT FROM users WHERE id=$1`,
      [idUserFollowed]
    )
    if (!checkIfUserFollowedExist.rows[0]) {
      res.sendStatus(404)
      return
    }

    const checkIfWasFollowedExist = await connectionDb.query(
      `SELECT FROM follows WHERE "usernameId"=$1 AND "followedUserId"=$2`,
      [userId, idUserFollowed]
    )
    if (checkIfWasFollowedExist.rows[0]) {
      return res.status(409).send("user already followed")
    }

    await connectionDb.query(
      `INSERT INTO follows ("usernameId", "followedUserId") VALUES ($1, $2)`,
      [userId, idUserFollowed]
    )

    return res.sendStatus(201)
  } catch (err) {
    console.log(err)
    return res.status(404).send(err.details)
  }
}

export async function deleteFollowController(req, res) {
  const userId = res.locals.userId
  const idUserFollowed = req.params.id
  const isNum = /^\d+$/.test(idUserFollowed)

  if (!isNum) {
    res.sendStatus(400)
    return
  }

  try {
    const checkIfUserFollowedExist = await connectionDb.query(
      `SELECT FROM users WHERE id=$1`,
      [idUserFollowed]
    )
    if (!checkIfUserFollowedExist.rows[0]) {
      res.sendStatus(404)
      return
    }

    const checkIfWasFollowedExist = await connectionDb.query(
      `SELECT FROM follows WHERE "usernameId"=$1 AND "followedUserId"=$2`,
      [userId, idUserFollowed]
    )
    if (!checkIfWasFollowedExist.rows[0]) {
      return res.status(409).send("unfollowed user")
    }

    await connectionDb.query(
      `DELETE FROM follows WHERE "usernameId"=$1 AND "followedUserId"=$2`,
      [userId, idUserFollowed]
    )

    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
    return res.status(404).send(err.details)
  }
}

export async function checkFollowController(req, res) {
  const userId = res.locals.userId
  const idUserFollowed = req.params.id

  try {
    const checkFollow = await connectionDb.query(`
    SELECT FROM follows WHERE "usernameId" = $1 AND "followedUserId" = $2`,
      [userId, idUserFollowed]
    )
    if(!checkFollow.rows[0]){
      return res.status(200).send({followThisUser: false})
    }

    return res.status(200).send({followThisUser: true})
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
