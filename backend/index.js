import express from 'express';
import dotenv from "dotenv";
import connectToMongoDb from './db/connectToMongoDb.js';
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"

const __dirname=path.resolve();
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);

app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.get("*",(req,res)=>
{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})


app.listen(8080,()=>
{
    connectToMongoDb();
    console.log("server is runing on server 8080");
})