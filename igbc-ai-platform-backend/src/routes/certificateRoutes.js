import { Router } from "express";
import {
  generateCertificate,
  getCertificateById,
  verifyCertificate,
} from "../controllers/certificate/certificateController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.post("/generate/:projectId", generateCertificate);
router.get("/verify/:certificateNumber", verifyCertificate);
router.get("/:id", getCertificateById);

export default router;
