import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
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
export default  RatingAndReview