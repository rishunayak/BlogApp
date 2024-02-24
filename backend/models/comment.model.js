import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    
    userId:{type:String,required:true},
    postId:{type:String,required:true,},
    content:{type:String,required:true},
    likes:{
        type:Array,
        default:[]
    },
    numberOfLinkes:{
        type:Number,
        default:0
    },
    
    
},{timestamps:true})

const Comment=new mongoose.model('comment',commentSchema);

export default Comment