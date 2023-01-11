import { connectionDb } from "../database/database.js";

export async function addLike (req, res) {
    const {idPost} = req.body
    const userId = res.locals.userId;
    const checkPost = await connectionDb.query(`SELECT FROM posts WHERE id = $1`,[idPost]);
    if(checkPost.rows.length === 0){
        return res.status(404).send("POST NAO EXISTENTE")
    }

    const checkUser = await connectionDb.query(`SELECT * FROM users WHERE id = $1`,[userId]);
    if(checkUser.rows.length === 0){
        return res.status(404).send("USER NAO EXISTENTE")
    }

    const checkLike = await connectionDb.query(`SELECT FROM likes WHERE "idPost" = $1 AND "idUser" = $2`, [idPost, userId])

    if(checkLike.rows.length !== 0){
        return res.status(409).send("usuario já curtiu")
    }
    try {
        await connectionDb.query(`
        INSERT INTO likes ("idPost", "idUser", username) VALUES ($1, $2, $3)
        `, [idPost, userId, checkUser.rows[0].username]);
        return res.status(201).send("Adicionado com Sucesso");
    }catch(err){
        console.log(err);
        return res.status(500).send(err)
    }
}

export async function deleteLike (req, res) {
    const {idPost} = req.body
    const userId = res.locals.userId;
    const checkPost = await connectionDb.query(`SELECT FROM posts WHERE id = $1`,[idPost]);
    if(checkPost.rows.length === 0){
        return res.status(401).send("POST NAO EXISTENTE")
    }
    const checkLike = await connectionDb.query(`SELECT FROM likes WHERE "idPost" = $1 AND "idUser" = $2`, [idPost, userId])
    console.log(checkLike.rows.length)
    if(checkLike.rows.length === 0){
        return res.status(409).send("publicacao nao curtida")
    }
    try {
        await connectionDb.query(`DELETE FROM likes WHERE "idPost" = $1 AND "idUser" = $2`, [idPost, userId]);
        return res.status(201).send("DELETADO com Sucesso");
    }catch(err){
        console.log(err);
        return res.status(500).send(err)
    }
}