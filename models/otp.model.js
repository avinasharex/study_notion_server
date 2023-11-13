import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
},{timestamps: true})

const OTP = model("OTP",otpSchema)
export default  OTP