import Post from "../models/post.model.js";

export const create=async(req,res)=>
{
    if(!req.user.isAdmin)
    {
      return res.status(403).json({error:'Your are not allowed to creare a post'})
    }
    if(!req.body.title || !req.body.content)
    {
        return res.status(400).json({error:'Please provide all required fields'})
    }

    const slug=req.body.title.split(' ').join("-").toLowerCase().replace(/[^a-zA-Z0-9]/g,'')
    const newPost=new Post({
        ...req.body,slug,userId:req.user._id
    });
    try {
        const savePost=await newPost.save();
        res.status(201).json(savePost)
    } catch (error) {
        console.log("Error in singup Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}