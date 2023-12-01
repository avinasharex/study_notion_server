import {Router} from "express"
import { createCourse, getAllCourses, getCourseDetails } from "../controllers/course.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { authorizedRoles } from "../middlewares/auth.middleware.js"
import { createTag, getAllTag } from "../controllers/tag.controller.js"
import { createSection, deleteSection, updateSection } from "../controllers/section.controller.js"
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/subsection.controller.js"
import { createCategory, getAllCategory } from "../controllers/category.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

/*-----------------Course---------------------------- */
router.get("/",isLoggedIn,authorizedRoles("INSTRUCTOR"),getAllCourses)
router.post("/create-course",isLoggedIn,authorizedRoles("INSTRUCTOR"),upload.single("thumbnail"),createCourse)
router.get("/details-course",isLoggedIn,authorizedRoles("INSTRUCTOR"),getCourseDetails)

/*-----------------Section---------------------------- */
router.post("/create-section",isLoggedIn,authorizedRoles("INSTRUCTOR"),createSection)
router.patch("/update-section",isLoggedIn,authorizedRoles("INSTRUCTOR"),updateSection)
router.delete("/delete-section",isLoggedIn,authorizedRoles("INSTRUCTOR"),deleteSection)

/*-----------------Sub section---------------------------- */
router.post("/create-subsection",isLoggedIn,authorizedRoles("INSTRUCTOR"),upload.single("videoUrl"),createSubSection)
router.patch("/update-subsection",isLoggedIn,authorizedRoles("INSTRUCTOR"),updateSubSection)
router.delete("/delete-subsection",isLoggedIn,authorizedRoles("INSTRUCTOR"),deleteSubSection)

/*-----------------Tag---------------------------- */
router.post("/create-tag",isLoggedIn,authorizedRoles("INSTRUCTOR"),createTag)
router.get("/tag",isLoggedIn,authorizedRoles("INSTRUCTOR"),getAllTag)

/*-----------------Category---------------------------- */
router.post("/create-category",isLoggedIn,authorizedRoles("ADMIN"),createCategory)
router.get("/get-category",isLoggedIn,authorizedRoles("ADMIN"),getAllCategory)

export default router