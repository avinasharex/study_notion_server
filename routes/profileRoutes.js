import {Router} from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { deleteAccount, updateProfile } from "../controllers/profile.controller.js"

const router = Router()

router.patch("/update",isLoggedIn,updateProfile)
router.delete("/delete",isLoggedIn,deleteAccount)

export default router