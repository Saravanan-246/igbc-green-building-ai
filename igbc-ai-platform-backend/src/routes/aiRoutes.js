import { Router } from "express";
import {
  analyzeUploadedDocument,
  getRecommendations,
  scoreProject,
} from "../controllers/ai/aiController.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = Router();

router.use(authenticate);
router.use(authorizeRoles("admin", "assessor"));

router.post("/analyze/:documentId", analyzeUploadedDocument);
router.post("/score/:projectId", scoreProject);
router.get("/recommendations/:projectId", getRecommendations);

export default router;
