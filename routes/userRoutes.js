import {Router} from "express"

import { changePassword, resetPassword, resetPasswordToken } from "../controllers/password.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { login, logout, signUp, verifyEmail } from "../controllers/user.controller.js"
import { createRatingReview } from "../controllers/rating.review.controller.js"
import { authorizedRoles } from "../middlewares/auth.middleware.js"

const router = Router()

/*-----------------User---------------------------- */
router.post("/signup",signUp)
router.post("/verify-email",verifyEmail)
router.post("/login",login)
router.get("/logout",logout)
router.post("/change-password",isLoggedIn,changePassword)
router.post("/reset-password/:resetToken",resetPassword)
router.post("/reset-password-token",resetPasswordToken)

/*-----------------Rating and Review---------------------- */

router.post("/create-rating",isLoggedIn,authorizedRoles("STUDENT"),createRatingReview)

export default router