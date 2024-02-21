import express from 'express'
import dotenv from "dotenv"
import connectToMongoDb from './db/connectToMongoDb';


const app = express();

dotenv.config();


app.link(8080,()=>
{
    connectToMongoDb()
    console.log("server is runing on server 8080")
})