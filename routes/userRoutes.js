import {Router} from "express"
import { login, signUp, verifyEmail } from "../controllers/user.controllers.js"

const router = Router()

router.post("/signup",signUp)
router.post("/verify-email",verifyEmail)

export default router