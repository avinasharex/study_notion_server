import {Router} from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { createPayment, verifyPayment } from "../controllers/payment.controller.js"

const router = Router()

router.get("/create",isLoggedIn,createPayment)
router.get("/verify",isLoggedIn,verifyPayment)

export default router