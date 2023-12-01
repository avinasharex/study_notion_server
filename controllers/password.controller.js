import User from "../models/user.model.js";
import crypto from "crypto"
import mailSender from "../utils/mailSender.js"
import ApiError from "../utils/ApiError.js";
import clearCookie from "../utils/clearCookie.js";

const resetPasswordToken = async (req, res, next) => {
    const { email } = req.body;
  
    if (!email) {
      return next(new ApiError("Email is not registered", 404));
    }
  
    const user = await User.findOne({ email });
  
    if (user) {
      const resetToken = await user.generateResetToken();
  
    await user.save();
  
    const resetPasswordURL = `${process.env.FRONTED_URL}/forgot/change/password/${resetToken}`;
    const subject = "Reset password";
    const body = `
      <p>Dear User,</p>
      <p>You've requested to reset your password. Click the following link to reset your password:</p>
      <p><a href="${resetPasswordURL}" target="_blank">Reset Your Password</a></p>
      <p>If you haven't requested this, kindly ignore this email.</p>
      <p>Best regards,<br/>Your Company Name</p>
    `;
  
    try {
      await mailSender(email, subject, body);
  
      res.status(200).json({
        success: true,
        message: `Reset password token send to ${email} successfully`,
        reset : resetToken
      });
    } catch (e) {
      user.resetPassworExpiry = undefined;
      user.resetPasswordToken = undefined;
  
      await user.save();
      return next(new ApiError(e.message, 404));
    }
    }else{
      res.status(404).json({
          success: false,
          message: `Email is not registered`,
        });
    }
  };

  const resetPassword = async (req, res, next) => {
    const { resetToken } = req.params;
  
    const { newPassword, confirmPassword} = req.body;
    if(newPassword !== confirmPassword){
        return next(new ApiError("password does not match", 404));
    }
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPassworExpiry: { $gt: Date.now() },
    });
  
    if (!user) {
        return next(new ApiError("Token is invalid or expiry, please try again", 404));
    }
  
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPassworExpiry = undefined;
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  };

  const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { id } = req.user;
  
    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new ApiError("All field are required", 404));
    }
  
    const user = await User.findById(id).select("+password");
  
    if (!user) {
        return next(new ApiError("User does not exist", 404));
    }
  
    const isValidPassword = await user.isPasswordCorrect(oldPassword)
  
    if (!isValidPassword) {
        return next(new ApiError("Wrong old password", 404));
    }
  
    user.password = newPassword;
  
    await user.save();

    clearCookie(res)
  
    user.password = undefined;
  
    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  };  

  export {resetPasswordToken, resetPassword, changePassword}