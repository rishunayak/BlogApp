import express from "express"
import { auth } from "../middleware/auth.js";
import { create, getPosts } from "../controllers/post.controller.js";

const router=express.Router();

router.post('/create',auth,create);
router.get('/getPost',getPosts);

export default router;