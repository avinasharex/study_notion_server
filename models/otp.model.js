import {Schema,model} from "mongoose";
import mailSender from "../utils/mailSender.js";

const otpSchema = new Schema({
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

async function sendVerificationEmail(email,otp){
    try {
        const mailResponse = await mailSender(email,"Verification email from Study Notion",`Your verification code is: ${otp}. This code is valid for 5 minutes.`)
    } catch (error) {
        console.log("Error occured while sending mail",error);
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp)
    next()
})

const OTP = model("OTP",otpSchema)
export default OTP