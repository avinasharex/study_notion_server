import razorpayInstance from "../utils/Razorpay.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto"

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

const verifyPayment = async(req,res,next)=>{
    const webHookSecret = "1323134"
    const singature = req.headers("x-razorpay-signature")
    const secret = crypto.createHmac("sha256",webHookSecret).update(JSON.stringify(req.body)).digest("hex")
    if(singature !== secret){
        return next(new ApiError("Payment not verified", 400));
    }
    const {userId,courseId} = req.payload.payment.entity.notes
    try {
        const enrolledCourse = await Course.findByIdAndUpdate(courseId,{
            $push: {studentsEnrolled: userId}
        }, {new: true})
        if(!enrolledCourse){
            return next(new ApiError("Course not found", 400));
        }
        const enrolledStudent = await User.findOneAndUpdate(userId,{
            $push:{courses: courseId}
        },{new:true})

        // TODO: send mail to student on successful course purchased

        return res.status(200).json({
            success: true,
            message: "Course purchased successfully"
        })
    } catch (error) {
        return next(new ApiError(error.message, 500));  
    }
}

export {createPayment, verifyPayment}