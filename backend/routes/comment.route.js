import express from "express"
import { auth } from "../middleware/auth.js";
import { createComment, deleteComment, editComment, getPostComments, likeComment } from "../controllers/comment.controller.js";


const router=express.Router();

router.post('/create',auth,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId',auth,likeComment);
router.put('/editComment/:commentId',auth,editComment);
router.put('/deleteComment/:commentId',auth,deleteComment)


export default router;