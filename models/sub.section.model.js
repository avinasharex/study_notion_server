import {Schema,model} from "mongoose";

const subSectionSchema = new Schema({
    title: {
        type: String
    },
    timeDuration: {
        type: String
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String
    }
},{timestamps: true})

const SubSection = model("SubSection",subSectionSchema)
export default SubSection