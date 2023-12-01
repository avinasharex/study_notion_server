import Course from "../models/course.model.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const createCourse = async (req, res, next) => {
  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    price,
    tag,
    category,
  } = req.body;
  const userId = req.user.id
  try {
    if (
      !courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !category
    ) {
      return next(new ApiError("All fields are required", 400));
    }

    const userDetails = await User.findById(userId)
    const thumbnailLocalPath = req.file.path
    console.log(thumbnailLocalPath);
    if (!thumbnailLocalPath) {
      return next(new ApiError("-...>>Thumbnail is required", 400));
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
 
    if (!thumbnail) {
      return next(new ApiError("Thumbnail is required", 400));
    }
 
    const course = await Course.create({
      courseName,
      courseDescription,
      Instructor: userDetails._id,
      whatYouWillLearn,
      price,
      category: new mongoose.Types.ObjectId(category),
      thumbnail: thumbnail.url,
      tag
    });

    if (!course) {
      return next(
        new ApiError("Course creation failed please try again later", 400)
      );
    }
    await course.save();

    //add new created course to instructor
    await User.findByIdAndUpdate(
      { _id: req.user.id },
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
      course,
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getAllCourses = async (req, res, next) => {
  const course = await Course.find({});
  if (!course) {
    return next(new ApiError("Course does not exist", 400));
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
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return next(
        new ApiError(`Could not found course with ID ${courseId}`, 400)
      );
    }
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

export { createCourse, getAllCourses, getCourseDetails };
