import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Section from "../models/section.js";
import ApiError from "../utils/ApiError.js";

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

    const course = await Course.findByIdAndUpdate(
      CourseId,
      {
        $push: {
          courseContent: section._id,
        },
      },
      { new: true }
    );

    await section.save();
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      newCourse: course,
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

    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );
    await section.save();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const deleteSection = async (req, res, next) => {
  try {
    const { CourseId, sectionId } = req.body;
    if (!sectionId) {
      return next(new ApiError("Section ID is invalid", 400));
    }

    await Section.findByIdAndDelete(sectionId);

    await Course.findByIdAndUpdate(
      CourseId,
      {
        $pull: {
          courseContent: sectionId,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export { createSection, updateSection, deleteSection };
