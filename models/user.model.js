import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    acoountType:{
        type: String,
        enum: ["ADMIN","STUDENT","TEACHER"],
        required: true
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile"
        }
    ],
    image: {
        type: String,
        required: true
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ],
    active:{
        type: Boolean
    },
    approve:{
        type: Boolean
    }
},{timestamps: true})

const User = model("User",userSchema)
export default  User