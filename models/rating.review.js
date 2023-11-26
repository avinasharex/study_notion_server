import {Schema,model} from "mongoose";

const ratingAndReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        index: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true})

const RatingAndReview = model("RatingAndReview",ratingAndReviewSchema)
export default RatingAndReview