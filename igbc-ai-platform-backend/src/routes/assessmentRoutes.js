import { Router } from "express";
import {
  createAssessment,
  deleteAssessment,
  getAssessmentById,
  getAssessments,
  submitAssessment,
  updateAssessment,
} from "../controllers/assessment/assessmentController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.route("/").post(createAssessment).get(getAssessments);

router
  .route("/:id")
  .get(getAssessmentById)
  .put(updateAssessment)
  .delete(deleteAssessment);

router.post("/:id/submit", submitAssessment);

export default router;
