import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    
    userId:{type:String,required:true},
    title:{type:String,required:true,unique},
    content:{type:String,required:true},
    image:{
        type:String,
        default:"https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
        
    },
    category:{
        type:String,
        default:'uncategorized'
    },
    slug:{
        type:String,required:true,unique
    }
    
},{timestamps:true})

const Post=new mongoose.model('post',postSchema);

export default Post