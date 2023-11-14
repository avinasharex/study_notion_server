import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    courseID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    completedVideos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subSection"
    }
},{timestamps: true})

export const CourseProgress = model("CourseProgress",courseProgressSchema)
