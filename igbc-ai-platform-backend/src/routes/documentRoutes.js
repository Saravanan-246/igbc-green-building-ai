import { Router } from "express";
import {
  deleteDocument,
  getDocumentById,
  getProjectDocuments,
  uploadDocument,
} from "../controllers/document/documentController.js";
import authenticate from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.use(authenticate);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/project/:projectId", getProjectDocuments);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);

export default router;
