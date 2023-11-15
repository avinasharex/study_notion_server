import {Router} from "express"
import { login, logout, signUp, verifyEmail } from "../controllers/user.controllers.js"
import { resetPasswordToken } from "../controllers/password.controller.js"

const router = Router()

router.post("/signup",signUp)
router.post("/verify-email",verifyEmail)
router.post("/login",login)
router.get("/logout",logout)
router.post("/reset-password",resetPasswordToken)

export default router