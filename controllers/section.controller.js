import Course from "../models/course.model";
import Section from "../models/section";
import ApiError from "../utils/ApiError";

const createSection = async (req, res, next) => {
  try {
    const { sectionName, CourseId } = req.body;
    if (!sectionName || !CourseId) {
      return next(new ApiError("All fields are required", 400));
    }

    const section = await Section.create({
      sectionName,
    });
    if (!section) {
      return next(new ApiError("Section creation failed", 400));
    }

    await Course.findByIdAndUpdate(
      CourseId,
      {
        $push: {
          courseContent: sectionName._id,
        },
      },
      { new: true }
    );

    await section.save();
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const updateSection = async (req, res, next) => {
  try {
    const { sectionName, sectionId } = req.body;
    if (!sectionName || !sectionId) {
      return next(new ApiError("All fields are required", 400));
    }

    const section = await Section.findByIdAndUpdate(sectionId,{
        sectionName
    }, {new: true})
    await section.save()

    return res.status(200).json({
        success: true,
        message: "Section updated successfully",
      });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const deleteSection = async(req,res,next)=>{
    try {
        const {sectionId} = req.params
        if(!sectionId){
            return next(new ApiError("Section ID is invalid", 400));
        }
        const section = await Section.findByIdAndDelete(sectionId)
        await section.save()

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
          });
    } catch (error) {
        return next(new ApiError(error.message, 500));  
    }
}

export { createSection, updateSection, deleteSection };
