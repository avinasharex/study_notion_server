import razorpayInstance from "../utils/Razorpay";
import Course from "../models/course.model";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";

const createPayment = async (req, res, next) => {
  const courseId = req.params;
  const userId = req.user.userId;
  if (!courseId) {
    return next(new ApiError("Please provide valid course ID", 400));
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ApiError("Could not find course", 400));
    }
    const str = toString(course.studentsEnrolled);
    if (courseId === str) {
      return next(new ApiError("Student is already enrolled", 400));
    }
    const options = {
      amount: course.price * 100,
      currency: "INR",
      notes: {
        courseId,
        userId
      }
    };
      const paymentResponse = await razorpayInstance.orders.create(options)
  
      return res.status(200).json({
          success: true,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          thumbnail: course.thumbnail,
          orderId: paymentResponse.id,
          amount: paymentResponse.amount,
          message: "Order created successfully"
      })
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export {createPayment}