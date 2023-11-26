import Course from "../models/course.model";
import RatingAndReview from "../models/rating.review";
import ApiError from "../utils/ApiError";

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

    await Course.findByIdAndUpdate(courseId,{
        $push: {
            ratingAndReviews: ratingAndReviews._id
        }
    },{new: true})

    return res.status(201).json({
        success: true,
        message: "Rating and Review created successfully"
    })
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export {createRatingReview}