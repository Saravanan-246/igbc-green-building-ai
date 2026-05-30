import { Router } from "express";
import {
  generateReport,
  getProjectReports,
  getReportById,
} from "../controllers/report/reportController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.post("/generate/:projectId", generateReport);
router.get("/project/:projectId", getProjectReports);
router.get("/:id", getReportById);

export default router;
