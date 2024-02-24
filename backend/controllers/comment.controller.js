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


export const likeComment=async(req,res)=>
{
    try {
        const comment=await Comment.findById(req.params.commentId);
        if(!comment)
        {
            return res.status(404).json({error:"Comment not found"})
        }
        const userIndex=comment.likes.indexOf(req.user._id.toString());

        if(userIndex===-1)
        {
            comment.numberOfLikes+=1
            comment.likes.push(req.user._id.toString());
        }else
        {
            comment.numberOfLikes-=1
            comment.likes.splice(userIndex,1);     
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.log("Error in Comment Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const editComment=async(req,res)=>
{
    try {
        const comment=await Comment.findById(req.params.commentId);

        if(!comment)
        {
            return res.status(404).json({error:'Comment not found'});
        }
        if(comment.userId!==req.user._id.toString() && !req.user.isAdmin)
        {
            return res.status(403).json({error:'User not allowed to edit'})
        }
        const editedCommnet=await Comment.findByIdAndUpdate(req.params.commentId,{content:req.body.content},{new:true})
        res.status(200).json(editedCommnet);
    } catch (error) {
        console.log("Error in Comment Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const deleteComment=async(req,res)=>
{
    try {
        const comment=await Comment.findById(req.params.commentId);

        if(!comment)
        {
            return res.status(404).json({error:'Comment not found'});
        }
        if(comment.userId!==req.user._id.toString() && !req.user.isAdmin)
        {
            return res.status(403).json({error:'User not allowed to edit'})
        }
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json({message:'Comment is deleted Successfully'});
    } catch (error) {
        console.log("Error in Comment Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const getComments=async(req,res)=>
{
    try {
        if(!req.user.isAdmin)
        {
            return res.status(403).json({error:'User not allowed'})
        }

        const startIndex=+(req.query.startIndex) || 0;
        const limit=+(req.query.limit) || 9;
        const sortDirection=req.query.order==='asc'? 1:-1;
        const comments=await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit).populate({
            path: 'userId',
            select: '-password',})
        
        const totalComments=await Comment.countDocuments();
        const now =new Date();
        const oneMonthAgo=new Date(now.getFullYear(),
         now.getMonth()-1,
         now.getDate())

       const lastMonthComment=await Comment.countDocuments({
        createdAt:{$gte:oneMonthAgo},
     })
     res.status(200).json({comments,totalComments,lastMonthComment})
    } catch (error) {
        console.log("Error in Comment Controller",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}