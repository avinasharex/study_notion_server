import OTP from "../models/otp.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import otpGenerator from "otp-generator";

const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false,
};

const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password, accountType } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return next(new ApiError("All field are required", 400));
    }
  
    const CheckUser = await User.findOne({ email });
    if (CheckUser) {
      return next(new ApiError("User already exist", 400));
    }
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: null,
      about: null
    })
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      accountType,
      additionalDetails: profile,
      image: "https://github.com/avinasharex/auth/blob/main/model/userSchema.js"
    });
  
    await user.save()
    user.password = undefined
  
    const otp = otpGenerator.generate(6,{
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    })
  
    const checkOTP = await OTP.findOne({otp})
    if(checkOTP){
      return next(new ApiError("Non unique otp found", 400));
    }
  
    const createdOtp = await OTP.create({
      email,
      otp
    })
  
    await createdOtp.save()
  
    res.status(201).json({
      success: true,
      message: "User registerd successfully",
      createdOtp,
      user,
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
}

const verifyEmail = async(req,res,next)=>{
  const {otp} = req.body

  try {
    if(!otp){
      return next(new ApiError("OTP is required", 400));
    }
    const createdOtp = await OTP.findOne({otp})
    if(otp !== createdOtp.otp){
      return next(new ApiError("OTP does not match", 400));
    }
    res.status(201).json({
      success: true,
      message: "User registerd successfully",
      createdOtp
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
}

export { signUp, verifyEmail};
