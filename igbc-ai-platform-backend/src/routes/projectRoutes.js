import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/project/projectController.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/role.js";

const router = Router();

router.use(authenticate);

router
  .route("/")
  .post(authorizeRoles("admin", "company"), createProject)
  .get(getProjects);

router
  .route("/:id")
  .get(getProjectById)
  .put(authorizeRoles("admin", "company"), updateProject)
  .delete(authorizeRoles("admin", "company"), deleteProject);

export default router;
