import Category from "../models/category.model.js"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
const createCategory = async(req,res,next)=>{
    const {name,description} = req.body
    const userId = req.user.id
    try {
        const userDetails = await User.findById(userId)
        if(!userDetails){
            return next(new ApiError("User not registered with us",400))
        }

        const category = await Category.create({
            name,description
        })

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        })
    } catch (error) {
        return next (new ApiError(error.message,500))
    }
}

const getAllCategory = async(req,res,next)=>{
    try {
        const category = await Category.find({})
        return res.status(201).json({
            success: true,
            message: "Category fetched successfully",
            category
        })
    } catch (error) {
        return next (new ApiError(error.message,500))
    }
}

export {createCategory, getAllCategory}