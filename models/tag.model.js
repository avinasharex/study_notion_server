import {Schema, model} from "mongoose";

const tagSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    }
},{timestamps: true})

const Tag = model("Tag",tagSchema)
export default Tag
