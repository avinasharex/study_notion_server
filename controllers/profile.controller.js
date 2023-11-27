import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import ApiError from "../utils/ApiError.js"

const updateProfile = async(req,res,next)=>{
    try {
        const {dateOfBirth="",about="",contactNumber,gender} = req.body
        if(!contactNumber || !gender){
            return next(new ApiError("All fields are required",400))
        }
        const userId = req.user.userId
        const userDetails = await User.findById(userId)
        const profileId = userDetails.additionalDetails
        const profileDetails = await  Profile.findById(profileId)

        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.gender = gender
        profileDetails.contactNumber = contactNumber

        await profileDetails.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails
        })
    } catch (error) {
       return next(new ApiError(error.message,500)) 
    }
}

const deleteAccount = async(req,res,next)=>{
    try {
        const userId = req.user.id
        const userDetails = await User.findById(userId)
        if(!userDetails){
            return next(new ApiError("User not found",400)) 
        }
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails})
        await User.findByIdAndDelete(id)
        
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        })
    } catch (error) {
        return next(new ApiError(error.message,500))
    }
}

export {updateProfile, deleteAccount}