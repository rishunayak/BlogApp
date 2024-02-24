import express from "express"
import { auth } from "../middleware/auth.js";
import { createComment, deleteComment, editComment, getComments, getPostComments, likeComment } from "../controllers/comment.controller.js";


const router=express.Router();

router.post('/create',auth,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId',auth,likeComment);
router.put('/editComment/:commentId',auth,editComment);
router.delete('/deleteComment/:commentId',auth,deleteComment);
router.get('/getComments',auth,getComments);


export default router;