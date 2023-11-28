import Course from "../models/course.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";

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
      tag,
      studentsEnrolled,
    } = req.body;

    if (
      !courseName ||
      !courseDescription ||
      !Instructor ||
      !whatYouWillLearn ||
      !courseContent ||
      !price ||
      !thumbnail ||
      !studentsEnrolled
    ) {
      return next(new ApiError("All fields are required", 400));
    }
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath){
      return next(new ApiError("Thumbnail is required", 400));
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail){
      return next(new ApiError("Thumbnail is required", 400));
    }
    const course = await Course.create({
      courseName,
      courseDescription,
      Instructor: req.user._id,
      whatYouWillLearn,
      courseContent,
      ratingAndReviews,
      price,
      thumbnail: thumbnail.url,
      tag: tagDetails._id,
      studentsEnrolled,
    });

    if (!course) {
      return next(
        new ApiError("Course creation failed please try again later", 400)
      );
    }
      await course.save();

      //add new created course to instructor
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            courses: course._id,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Course created successfully",
      });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getAllCourses = async (req, res, next) => {
  const course = await User.find({}).select("courses");
  if (!course) {
   return next (new ApiError("Course does not exist", 400));
  }

  return res.status(200).json({
    success: true,
    message: "Course fetched successfully",
    fetchCourse: course,
  });
};

const getCourseDetails = async (req, res, next) => {
  const { courseId } = req.body;
  try {
    const courseDetails = await Course.find({ courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseConten",
        populate: {
          path: "subSection",
        },
      })
      .exec()

      if(!courseDetails){
        return next (new ApiError(`Could not found course with ID ${courseId}`, 400));
      }
      return res.status(200).json({
        success: true,
        message: "Course details fetched successfully",
        data: courseDetails
      });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

export { createCourse, getAllCourses, getCourseDetails };
