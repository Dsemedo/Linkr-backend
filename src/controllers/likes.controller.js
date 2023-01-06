import { connectionDb } from "../database/database.js";

export async function addLike (req, res) {
    const {idPost} = req.body
    const userId = res.locals.userId;
    const checkPost = await connectionDb.query(`SELECT FROM posts WHERE id = $1`,[idPost]);
    if(checkPost.rows.length === 0){
        return res.status(401).send("POST NAO EXISTENTE")
    }

    try {
        await connectionDb.query(`
        INSERT INTO likes ("idPost", "idUser") VALUES ($1, $2)
        `, [idPost, userId]);
        return res.status(201).send("Adicionado com Sucesso");
    }catch(err){
        console.log(err);
        return res.status(500).send(err)
    }
}
