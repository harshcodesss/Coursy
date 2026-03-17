import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { getQuizByModule } from "../controllers/quiz.controllers.js";

const router = Router();

router.route("/:moduleId").get(verifyJWT, getQuizByModule);

export default router;