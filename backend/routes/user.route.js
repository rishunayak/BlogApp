import express from "express"
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";

const router =express.Router();

router.put('/update/:userId',auth,updateUser);
router.delete('/delete/:userId',auth,deleteUser)


export default router; 