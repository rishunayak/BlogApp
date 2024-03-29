import bcrypt from "bcryptjs"
import User from "../models/user.model.js";

export const updateUser=async(req,res)=>
{
 
    if(req.user._id.toString() !== req.params.userId)
    {
        return res.status(403).json({error:'You are not allowed to updare this user'});
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return res.status(400).json({error:'Password must be atleast 6 characters'});
        }
        const salt=await bcrypt.genSalt(10);
        req.body.password =await bcrypt.hash(req.body.password,salt)
      }



      if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return res.status(400).json({error:'Username must be 6 to 15 characters'}
          );
        }
        if (req.body.username.includes(' ')) {
            return res.status(400).json({error:'Username cannot contain spaces'});
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return res.status(400).json({error:'Username can only contain letters and numbers'}
          );
        }
      }
     
        try {

            const updatedUser=await User.findByIdAndUpdate(req.params.userId,{$set:
                {
                    username:req.body.username,
                    profilePicture:req.body.profilePicture,
                    password:req.body.password
                }},{new:true})

                const {password,...rest}=updatedUser._doc;
                res.status(200).json(rest);
            
        } catch (error) {
            console.log("Error in user Controller",error.message)
            res.status(500).json({error:"Internal Server Error"})
        }

    
}

export const deleteUser=async(req,res)=>
{
  if(req.user._id.toString() !== req.params.userId)
  {
      return res.status(403).json({error:'You are not allowed to updare this user'});
  }

  try {
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json({message:'User has been deleted'})
  } catch (error) {
    console.log("Error in singup Controller",error.message)
    res.status(500).json({error:"Internal Server Error"})
  }
}

export const signout=async(req,res)=>
{
 try {
  res.clearCookie('jwt').status(200).json({message:'User has been signed out'})
 } catch (error) {
    console.log("Error in singup Controller",error.message)
    res.status(500).json({error:"Internal Server Error"})
 }
}

export const getUsers=async(req,res)=>
{
  if(!req.user.isAdmin)
  {
      return res.status(403).json({error:'You are not allowed to see all user'});
  }

  try {
     const startIndex=+(req.query.startIndex) || 0;
     const limit=+(req.query.startIndex) || 5;
     const sortDirection=req.query.order==='asc'?1:-1;

     const users=await User.find().select('-password')
     .sort({updatedAt:sortDirection}).skip(startIndex).limit(limit);
    
     const totalUsers=await User.countDocuments();
     const now =new Date();
     const oneMonthAgo=new Date(now.getFullYear(),
     now.getMonth()-1,
     now.getDate())

     const lastMonthUsers=await User.countDocuments({
        createdAt:{$gte:oneMonthAgo},
     })
     res.status(200).json({users,totalUsers,lastMonthUsers})
  } catch (error) {
    console.log("Error in singup Controller",error.message)
    res.status(500).json({error:"Internal Server Error"})
  }



}

export const deleteUserByAdmin=async(req,res)=>
{
  
  const {userId}=req.params
  if(!req.user.isAdmin)
  {
    return res.status(403).json({error:'You are not allowed to see all user'});
  }
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({message:'User deleted successfully'});
  } catch (error) {
    console.log("Error in singup Controller",error.message)
    res.status(500).json({error:"Internal Server Error"})
  }
}