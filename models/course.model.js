import {Schema, model} from "mongoose";

const courseSchema = new Schema({
    courseName: {
        type: String,
        trim: true
    },
    courseDescription: {
        type: String,
        trim: true
    },
    Instructor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [
        {
            type: Schema.Types.ObjectId,
            ref: "Section"
        }
    ],
    ratingAndReviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    tag: {
        type: String,
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    status:{
        type: String,
        enum: ["DRAFT","PUBLISHED"]
    },
    studentsEnrolled: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }]
},{timestamps: true})

const Course = model("Course",courseSchema)
export default Course