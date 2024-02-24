import express from "express"
import { auth } from "../middleware/auth.js";
import { createComment, getPostComments } from "../controllers/comment.controller.js";


const router=express.Router();

router.post('/create',auth,createComment);
router.get('/getPostComments/:postId',getPostComments);


export default router;