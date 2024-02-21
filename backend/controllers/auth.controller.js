import User from "../models/user.model";
import bcrypt from "bcryptjs"




export const signup=async(req,res)=>
{
    try {
        const {username,email,password}=req.body;

       if(!username || !email || !password || username==="" || email==="" || password==="")
       {
          return res.status(400).json({message:"All Fields are required"});
       }

       const user = await User.findOne({ $or: [{ username }, { email }] });

       if(user)
        {
            return res.status(400).json({message:"Username or Email already exists"})
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
        res.status(500).json({message:"Internal Server Error"})     
    }
    

    

}


export const login=async(req,res)=>
{

}