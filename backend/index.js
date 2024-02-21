import express from 'express'

const app = express()



app.link(8080,()=>
{
    console.log("server is runing on server 8080")
})