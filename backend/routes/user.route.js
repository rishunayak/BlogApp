import express from "express"
import { deleteUser, deleteUserByAdmin, getUsers, signout, updateUser } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";

const router =express.Router();

router.put('/update/:userId',auth,updateUser);
router.delete('/delete/:userId',auth,deleteUser);
router.post('/signout',signout);
router.get('/getusers',auth,getUsers)
router.delete('/delete-user-by-admin/:userId',auth,deleteUserByAdmin)



export default router; 