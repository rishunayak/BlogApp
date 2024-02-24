import express from "express"
import { auth } from "../middleware/auth.js";
import { createComment, getPostComments, likeComment } from "../controllers/comment.controller.js";


const router=express.Router();

router.post('/create',auth,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId',auth,likeComment)


export default router;