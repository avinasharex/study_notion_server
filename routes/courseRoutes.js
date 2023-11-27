import {Router} from "express"
import { createCourse, getAllCourses, getCourseDetails } from "../controllers/course.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { authorizedRoles } from "../middlewares/auth.middleware.js"
import { createTag, getAllTag } from "../controllers/tag.controller.js"
import { createSection, deleteSection } from "../controllers/section.controller.js"
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/subsection.controller.js"

const router = Router()

/*-----------------Course---------------------------- */
router.get("/course",isLoggedIn,authorizedRoles("TEACHER"),getAllCourses)
router.post("/create-course",isLoggedIn,authorizedRoles("TEACHER"),createCourse)
router.get("/details-course",isLoggedIn,authorizedRoles("TEACHER"),getCourseDetails)

/*-----------------Section---------------------------- */
router.post("/create-section",isLoggedIn,authorizedRoles("TEACHER"),createSection)
router.patch("/update-section",isLoggedIn,authorizedRoles("TEACHER"),createSection)
router.delete("/delete-section",isLoggedIn,authorizedRoles("TEACHER"),deleteSection)

/*-----------------Sub section---------------------------- */
router.post("/create-subsection",isLoggedIn,authorizedRoles("TEACHER"),createSubSection)
router.patch("/update-subsection",isLoggedIn,authorizedRoles("TEACHER"),updateSubSection)
router.delete("/delete-subsection",isLoggedIn,authorizedRoles("TEACHER"),deleteSubSection)

/*-----------------Tag---------------------------- */
router.post("/create-tag",isLoggedIn,authorizedRoles("TEACHER"),createTag)
router.get("/tag",isLoggedIn,authorizedRoles("TEACHER"),getAllTag)

export default router