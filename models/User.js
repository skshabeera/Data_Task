const mongoose = require("mongoose")
const UserSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=User=mongoose.model("user",UserSchema)