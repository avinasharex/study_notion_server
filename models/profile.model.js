import {Schema,model} from "mongoose";

const profileSchema = new Schema({
    gender:{
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    about:{
        type: String,
        trim: true
    },
    contactNumber:{
        type: Number,
        trim: true
    }
},{timestamps: true})

const Profile = model("Profile",profileSchema)
export default  Profile