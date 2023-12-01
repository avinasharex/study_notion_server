import OTP from "../models/otp.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import otpGenerator from "otp-generator";
import mailSender from "../utils/mailSender.js";
import clearCookie from "../utils/clearCookie.js";

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
      approve: false,
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

const login = async(req,res,next)=>{
  const {email,password} = req.body

  try {
    if(!email || !password){
      return next(new ApiError("All field are required", 400))
    }
  
    const user = await User.findOne({email}).select("+password")
    if(!user || !(await user.isPasswordCorrect(password))){
      return next(new ApiError("Email or password does not match", 400))
    }
    if(!user.approve){
      return next(new ApiError("Please verify email", 400))
    }
      const token = await user.generateAccessToken();
      user.password = undefined;
  
      res.cookie("token", token, cookieOption);
      res.status(201).json({
        success: true,
        message: "User login successfully",
        user,
      });
  } catch (error) {
    return next(new ApiError(error.message, 400))
  }
  
}

const logout = async(req,res,next)=>{
  try {
    clearCookie(res)

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 400))
  }
}

const verifyEmail = async(req,res,next)=>{
  const {otp} = req.body

  try {
    if(!otp){
      return next(new ApiError("OTP is required", 400));
    }
    const dbOtp = await OTP.findOne({otp})
    if(!dbOtp){
      return next(new ApiError("OTP does not match", 400));
    }
    // Update user's 'approve' field to true
    const userEmail = dbOtp.email;
    const user = await User.findOneAndUpdate({email: userEmail},
      { $set: { approve: true } },
      { new: true }
    );

    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    res.status(201).json({
      success: true,
      message: "User registerd successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
}



export { signUp, verifyEmail, login, logout};
