import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    acoountType: {
      type: String,
      enum: ["ADMIN", "STUDENT", "TEACHER"],
      required: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    image: {
      type: String,
      required: true,
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
    active: {
      type: Boolean,
    },
    approve: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return  await bcrypt.compare(password,this.password)
   }
   userSchema.methods.generateAccessToken = function(){
    return JWT.sign(
         {
             _id: this._id,
             email: this.email,
             fullName: this.fullName,
             lastName: this.lastName,
             accountType: this.accountType
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
         }
     )
 }   

export const User = model("User", userSchema);
