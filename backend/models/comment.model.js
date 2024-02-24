import mongoose from "mongoose";
import User from "./user.model.js";

const commentSchema=new mongoose.Schema({
    
    userId:{type:mongoose.Schema.Types.ObjectId,
        ref:User,
        require:true},
    postId:{type:String,required:true,},
    content:{type:String,required:true},
    likes:{
        type:Array,
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    },
    
    
},{timestamps:true})

const Comment=new mongoose.model('comment',commentSchema);

export default Comment