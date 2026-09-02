import express from "express"
import cookieParser from "cookie-parser";
import reelRouter from "./routes/reels.routes.js";
import storyRouter from "./routes/story.routes.js";
import cors from "cors";
import appRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js";
const app=express()
app.use(cookieParser());
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use('/api/auth',appRouter)
app.use('/api/post',postRouter)
app.use("/api/reel", reelRouter);
app.use("/api/story", storyRouter);
export default app