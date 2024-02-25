import express from "express"
import { auth } from "../middleware/auth.js";
import { create, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";

const router=express.Router();

router.post('/create',auth,create);
router.get('/getPost',getPosts);
router.delete('/delete/:postId/:userId',auth,deletePost)
router.put('/update/:postId/:userId',auth,updatePost)

export default router;