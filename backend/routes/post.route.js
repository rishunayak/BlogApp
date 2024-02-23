import express from "express"
import { auth } from "../middleware/auth.js";
import { create } from "../controllers/post.controller.js";

const router=express.Router();

router.post('/create',auth,create)

export default router;