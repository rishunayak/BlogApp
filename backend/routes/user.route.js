import express from "express"
import { updateUser } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";

const router =express.Router();

router.get("/test",)
router.put('/update/:userId',auth,updateUser);


export default router; 