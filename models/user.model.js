import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { model, Schema } from "mongoose";
import crypto from "crypto"

const userSchema = new Schema(
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
    accountType: {
      type: String,
      enum: ["ADMIN", "STUDENT", "TEACHER"],
      required: true,
    },
    additionalDetails: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    image: {
      type: String,
      required: true,
    },
    courseProgress: [
      {
        type: Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
    active: {
      type: Boolean,
    },
    approve: {
      type: Boolean,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPassworExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  generateAccessToken: function () {
    return JWT.sign(
      {
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        lastName: this.lastName,
        accountType: this.accountType,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  },
  isPasswordCorrect: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  generateResetToken: function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPassworExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },
};

const User = model("User", userSchema);
export default User;
