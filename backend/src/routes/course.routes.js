import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { generateCourse, getCourseDetails } from "../controllers/course.controllers.js";


const router = Router();
router.route('/generate').post(verifyJWT, generateCourse);
router.route('/:courseId').get(verifyJWT, getCourseDetails);

export default router;