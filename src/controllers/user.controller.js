import { connectionDb } from "../database/database.js";
import urlMetadata from "url-metadata";
export async function userController (req,res){
    const {id} = req.params;
    try{
        const posts = await connectionDb.query(`
        SELECT p."userId", p.id, p.description, p.link, u.username, u.picture, COUNT(l."idPost") as likes 
      FROM posts p
      JOIN users u
      ON p."userId" = u.id
      LEFT JOIN likes l
      ON l."idPost" = p.id
      WHERE "userId" = $1
      GROUP BY p.id, u.id
      ORDER BY id DESC LIMIT 20
        `,[id])
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

    }catch(err){
        console.log(err);
        return res.status(500).send(err)
    }

}