import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String,require:true,unique:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    profilePicture:{type:String,default:'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'},
    isAdmin:{type:Boolean,default:false},
},{timestamps:true})


const User=mongoose.model("user",userSchema);

export default User;