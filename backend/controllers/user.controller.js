import bcrypt from "bcryptjs"
import User from "../models/user.model.js";

export const updateUser=async(req,res)=>
{
    if(req.user._id !== req.params.userId)
    {
        return res.status(403).json({error:'You are not allowed to updare this user'});
    }
    if(req.body.password)
    {
        if(req.body.password.length<6)
        {
            return res.status(400).json({error:'Password must be atleast 6 characters'});
        }
        if(req.body.username.trim().length <6 ||req.body.username.trim().length >15 )
        {
            return res.status(400).json({error:'Username must be 6 to 15 characters'});
        }
        if(req.body.username.includes(' '))
        {
            return res.status(400).json({error:'Username cannot contain spaces'});
        }

        if(!req.body.username.match(/^[a-zA-Z0-9]+$/))
        {
            return res.status(400).json({error:'Username can only contain letters and numbers'});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
        
        try {

            const updatedUser=await User.findByIdAndUpdate(req.params.userId,{$set:
                {
                    username:req.body.username,
                    profilePicture:req.body.profilePicture,
                    password:hashedPassword
                }},{new:true})

                const {password,...rest}=updateUser._doc;
                res.status(200).json(rest);
            
        } catch (error) {
            console.log("Error in singup Controller",error.message)
            res.status(500).json({error:"Internal Server Error"})
        }

    }
}