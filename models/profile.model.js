import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    gender:{
        type: String
    },
    dateOfBirth: {
        type: String
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