import Comment from "../models/comment.model.js";


export const createComment=async(req,res)=>
{
    try {
        const {content,postId,userId}=req.body;

        if(userId!==req.user._id.toString())
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

export const getPostComments=async(req,res)=>
{
    try {
        const comments=await Comment.find({postId:req.params.postId}).sort({createdAt:-1}).populate({
            path: 'userId',
            select: '-password',});
        res.status(200).json(comments);
    } catch (error) {
        console.log("Error in Comment Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}