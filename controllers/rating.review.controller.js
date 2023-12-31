import Course from "../models/course.model.js";
import RatingAndReview from "../models/rating.review.js";
import ApiError from "../utils/ApiError.js";

const createRatingReview = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const { rating, review, courseId } = req.body;
    const courseDetails = await Course.findOne(courseId, {
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    const alreadyReviewd = await RatingAndReview.findOne({ userId, courseId });
    if (!alreadyReviewd) {
      return next(new ApiError("Course is already reviewd by user", 400));
    }

    if (!courseDetails) {
      return next(new ApiError("Student not enrolled in course", 400));
    }
    const ratingAndReviews = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingAndReviews._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Rating and Review created successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getAverageRating = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: courseId,
        },
      },
      {
        $group: { _id: null, averageRating: { $avg: "$rating" } },
      },
    ]);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rating not given by user",
      averageRating: 0,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getAllRatingReview = async (req, res, next) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

      return res.status(200).json({
        success: true,
        message: "All rating and reviews fetched successfull",
        rating: allReviews
      })
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export { createRatingReview, getAverageRating, getAllRatingReview };
