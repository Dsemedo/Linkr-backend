import express from "express";
import cors from "cors";
import { authRoute } from "./routes/auth.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoute)
app.use(timelineRoutes)

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on ${port}`));