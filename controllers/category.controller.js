import Category from "../models/category.model"
import User from "../models/user.model"
import ApiError from "../utils/ApiError"
const createCategory = async(req,res,next)=>{
    const {name,description} = req.params
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

export {createCategory}