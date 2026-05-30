import mongoose from "mongoose";
import Document from "../../models/Document.js";
import Project from "../../models/Project.js";
import { calculateScore } from "./creditScoring.js";

const requiredCategories = [
  "Architectural",
  "Energy",
  "Water",
  "Waste",
  "IndoorEnvironment",
  "Materials",
];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureValidObjectId = (id, resourceName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(`Invalid ${resourceName} identifier`, 400);
  }
};

const generateRecommendations = async (projectId) => {
  ensureValidObjectId(projectId, "project");

  const project = await Project.findById(projectId);

  if (!project) {
    throw createError("Project not found", 404);
  }

  const documents = await Document.find({ projectId });
  const scoreResult = await calculateScore(projectId);
  const submittedCategories = new Set(
    documents.map((document) => document.category)
  );
  const missingCategories = requiredCategories.filter(
    (category) => !submittedCategories.has(category)
  );
  const rejectedDocuments = documents.filter(
    (document) => document.status === "Rejected"
  );
  const recommendations = [];

  missingCategories.forEach((category) => {
    recommendations.push({
      type: "missing_document",
      priority: "high",
      message: `Upload supporting documents for ${category}.`,
    });
  });

  if (scoreResult.score < 60) {
    recommendations.push({
      type: "low_score",
      priority: "high",
      message: "Improve documentation quality and address core IGBC credit gaps.",
    });
  }

  rejectedDocuments.forEach((document) => {
    recommendations.push({
      type: "failed_validation",
      priority: "medium",
      message: `Review and replace rejected document: ${document.originalName}.`,
    });
  });

  if (recommendations.length === 0) {
    recommendations.push({
      type: "ready_for_review",
      priority: "low",
      message: "Project documentation is ready for assessor review.",
    });
  }

  return recommendations;
};

export default generateRecommendations;
export { generateRecommendations };
