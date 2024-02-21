import express from 'express'
import dotenv from "dotenv"
import connectToMongoDb from './db/connectToMongoDb';
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"


const app = express();

dotenv.config();

app.use(express.json());

app.use("/ap/user",userRoutes);
app.use("/api/auth",authRoutes);


app.link(8080,()=>
{
    connectToMongoDb()
    console.log("server is runing on server 8080")
})