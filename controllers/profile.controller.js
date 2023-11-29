import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ApiError from "../utils/ApiError.js";
import clearCookie from "../utils/clearCookie.js";

const updateProfile = async (req, res, next) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    if (!contactNumber || !gender) {
      return next(new ApiError("All fields are required", 400));
    }
    const userId = req.user.id;
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;

    const updatedData = {
      gender: gender,
      dateOfBirth: dateOfBirth,
      contactNumber: contactNumber,
      about: about,
    };
    const profileDetails = await Profile.findOneAndUpdate(
      { _id: profileId },
      { $set: updatedData },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId);
    if (!userDetails) {
        return next(new ApiError("User not found", 400));
    }
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    await User.findByIdAndDelete(userId);

    clearCookie()

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export { updateProfile, deleteAccount };
