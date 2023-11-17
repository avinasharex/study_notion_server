import Course from "../models/course.model"
import Section from "../models/section"
import ApiError from "../utils/ApiError"

const createSection = async(req,res,next)=>{
   try {
    const {sectionName,CourseId} = req.body
    if(!sectionName || !CourseId){
        return next(new ApiError("All fields are required",400))
    }

    const section = await Section.create({
        sectionName
    })
    if(!section){
        return next(new ApiError("Section creation failed",400))
    }

    await Course.findByIdAndUpdate(CourseId,{
        $push: {
            courseContent: sectionName._id
        }
    },
    {new: true})

    await section.save()
    return res.status(201).json({
        success: true,
        message: "Section created successfully"
    })
   } catch (error) {
    return next(new ApiError(error.message,500))
   }
}

export {createSection}