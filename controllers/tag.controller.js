import Tag from "../models/tag.model.js";
import ApiError from "../utils/ApiError.js";

const createTag = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return next(new ApiError("All fields are required", 400));
    }
    const tag = await Tag.create({
      name,
      description,
    });

    await tag.save();

    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const getAllTag = async (req, res, next) => {
  try {
    const tag = await Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "Tag fetched successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

export { createTag, getAllTag };
