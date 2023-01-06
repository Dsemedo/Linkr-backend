import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { authRoute } from "./routes/auth.routes.js";
import { linkrRoute } from "./routes/linkr.routes.js";
import { hashtagRoute } from "./routes/hashtag.routes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRoute);
app.use(linkrRoute);
app.use(hashtagRoute)


const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on ${port}`));
