import {Router} from "express"

import { changePassword, resetPassword, resetPasswordToken } from "../controllers/password.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { login, logout, signUp, verifyEmail } from "../controllers/user.controller.js"

const router = Router()

router.post("/signup",signUp)
router.post("/verify-email",verifyEmail)
router.post("/login",login)
router.get("/logout",logout)
router.post("/change-password",isLoggedIn,changePassword)
router.post("/reset-password",resetPassword)
router.post("/reset-password-token",resetPasswordToken)

export default router