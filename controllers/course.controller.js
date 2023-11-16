import Course from "../models/course.model";
import ApiError from "../utils/ApiError";
import { uploadOnCloudinar } from "../utils/cloudinary";
import Tag from "../models/tag.model";
import User from "../models/user.model";

const createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      courseDescription,
      Instructor,
      whatYouWillLearn,
      courseContent,
      ratingAndReviews,
      price,
      thumbnail,
      tag,
      studentsEnrolled,
    } = req.body;

    if (
      !courseName ||
      !courseDescription ||
      !Instructor ||
      !whatYouWillLearn ||
      !courseContent ||
      !ratingAndReviews ||
      !price ||
      !thumbnail ||
      !tag ||
      !studentsEnrolled
    ) {
      return next(new ApiError("All fields are required", 400));
    }

    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return next(new ApiError("Tag not found", 400));
    }

    const course = await Course.create({
      courseName,
      courseDescription,
      Instructor: req.user._id,
      whatYouWillLearn,
      courseContent,
      ratingAndReviews,
      price,
      thumbnail: {
        secure_url:
          "https://github.com/avinasharex/auth/blob/main/model/userSchema.js",
      },
      tag: tagDetails._id,
      studentsEnrolled,
    });

    if (!course) {
      return next(
        new ApiError("Course creation failed please try again later", 400)
      );
    }
    if (req.file) {
      try {
        const file = await uploadOnCloudinar(req.file.path, { folder: "temp" });
        if (file) {
          course.thumbnail.secure_url = file.secure_url;
        }
      } catch (error) {
        return next(new ApiError(error.message, 400));
      }
      await course.save();

    //add new created course to instructor
      await User.findByIdAndUpdate(
        {_id: req.user._id},
        {
            $push: {
                courses: course._id
            }
        },
        {new: true})
      return res.status(200).json({
        success: true,
        message: "Course created successfully",
      });
    }
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getAllCourses = async(req,res,next)=>{
    const course = await User.find({}).select("courses")
    if(!course){
        new ApiError("Course does not exist", 400)   
    }

    return res.status(200).json({
        success: true,
        message: "Course fetched successfully",
        fetchCourse: course
      });
}

export { createCourse, getAllCourses };
