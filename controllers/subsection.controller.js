import Section from "../models/section.js";
import SubSection from "../models/sub.section.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createSubSection = async (req, res, next) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body

    if (!sectionId || !title || !timeDuration || !description) {
      return next(new ApiError("All fields are required", 400));
    }
 
    const videoLocalPath = req.file.path
    const video = await uploadOnCloudinary(videoLocalPath);
    if (!video) {
      return next(new ApiError("Video fields is required", 400));
    }
    const subSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: video.url,
    });

    const updatedSection = await Section.findByIdAndUpdate(sectionId,
      {
        $push: { subSection: subSection._id },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const updateSubSection = async (req, res, next) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;

    if (!subSectionId || !title || !timeDuration || !description) {
      return next(new ApiError("All fields are required", 400));
    }
    const updatedSubSectionData = {
      title,
      description,
      timeDuration
    };
    if(req.file){
      const videoLocalPath = req.file.path
      const video = await uploadOnCloudinary(videoLocalPath);
      if (!video) {
        return next(new ApiError("Video fields is required", 400));
      }
      updatedSubSectionData.videoUrl = video.url;
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, updatedSubSectionData,{new: true});
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const deleteSubSection = async(req,res,next)=>{
  try {
    const {subSectionId} = req.params
    if(!subSectionId){
      return next(new ApiError("subSectionId is required", 400));
    }
    const subSection = await SubSection.findByIdAndDelete(subSectionId)
    if(!subSection){
      return next(new ApiError("subSection deletion failed, please try again", 500));
    }
    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
}

export { createSubSection, updateSubSection, deleteSubSection };
