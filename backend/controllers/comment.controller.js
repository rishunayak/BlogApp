import Comment from "../models/comment.model.js";


export const createComment=async(req,res)=>
{
    try {
        const {content,postId,userId}=req.body;

        if(userId!==req.user._id)
        {
            return  res.status(403).json({error:'You are not allowed to comment'});
        }

        const newComment=new Comment({
            content,postId,userId
        });

        await newComment.save();
        res.status(200).json(newComment);

    } catch (error) {
        console.log("Error in Comment Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}