import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"




export const signup=async(req,res)=>
{
    try {
        const {username,email,password}=req.body;

       if(!username || !email || !password || username==="" || email==="" || password==="")
       {
          return res.status(400).json({error:"All Fields are required"});
       }

       const user = await User.findOne({ $or: [{ username }, { email }] });

       if(user)
        {
            return res.status(400).json({error:"Username or Email already exists"})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=new User({
            
            username,
            email,
            password:hashedPassword,
        })
        await newUser.save();

        res.status(201).json({message:"Sign Up Successfull"})

        
    } catch (error) {
        console.log("Error in singup Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})     
    }
    

    

}


export const login=async(req,res)=>
{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        const isPasswordCorrect= await bcrypt.compare(password,user?.password || "");
          
          if(!user || !isPasswordCorrect)
          {
            return res.status(400).json({error:"Invalid email or password"})
          }
    
          generateTokenAndsetCookie(user._id,res);

          const { password: pass, ...rest } = user._doc;
          res.status(200).json(rest)
      
       } catch (error) {
          console.log("Error in login Controller",error.message)
          res.status(500).json({error:"Internal Server Error"})
       }
}

export const google=async(req,res)=>
{
    const {email,name,googlePhotoUrl}=req.body;

    try {
        const user=await User.findOne({email});
        if(user)
        {
            generateTokenAndsetCookie(user._id,res);
            const {password,...rest}=user._doc
            res.status(200).json(rest)
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8);
            const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(generatedPassword,salt)
        const newUser=new User({
            username:name.toLowerCase().split(" ").join("")+Math.random().toString(9).slice(-4),
            email,
            password:hashedPassword,
            profilePicture:googlePhotoUrl,
        })
          await newUser.save();
           generateTokenAndsetCookie(newUser._id,res);
            const {password,...rest}=newUser._doc
            
            res.status(200).json(rest)
        }

    } catch (error) {
         console.log("Error in login Controller",error.message)
          res.status(500).json({error:"Internal Server Error"})
    }

}


const generateTokenAndsetCookie=(userId,res)=>
{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"})
    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,  // save from XSS attacks crross site 
        sameSite:"strict", // CSRF attack cross site 
    })
}


