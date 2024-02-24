import express from "express"
import { auth } from "../middleware/auth.js";
import { createComment } from "../controllers/comment.controller.js";


const router=express.Router();

router.post('/create',auth,createComment);


export default router;