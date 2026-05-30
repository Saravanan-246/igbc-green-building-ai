import mongoose from "mongoose";
import Assessment from "../../models/Assessment.js";
import Document from "../../models/Document.js";
import Project from "../../models/Project.js";

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

const predictRating = (score) => {
  if (score >= 90) return "Platinum";
  if (score >= 75) return "Gold";
  if (score >= 60) return "Silver";
  if (score >= 40) return "Certified";
  return "NotEligible";
};

const calculateScore = async (projectId) => {
  ensureValidObjectId(projectId, "project");

  const project = await Project.findById(projectId);

  if (!project) {
    throw createError("Project not found", 404);
  }

  const documents = await Document.find({ projectId });
  const assessments = await Assessment.find({ projectId });
  const validatedDocuments = documents.filter(
    (document) => document.status === "Validated"
  );
  const rejectedDocuments = documents.filter(
    (document) => document.status === "Rejected"
  );

  const documentCoverageScore = Math.min(documents.length * 8, 40);
  const validationScore = Math.min(validatedDocuments.length * 10, 40);
  const assessmentScore =
    assessments.length > 0
      ? Math.round(
          assessments.reduce((total, assessment) => total + assessment.score, 0) /
            assessments.length
        )
      : 0;
  const penalty = rejectedDocuments.length * 5;
  const score = Math.max(
    0,
    Math.min(100, documentCoverageScore + validationScore + assessmentScore * 0.2 - penalty)
  );
  const roundedScore = Math.round(score);
  const rating = predictRating(roundedScore);
  const creditsEarned = Math.round(roundedScore / 2);

  return {
    score: roundedScore,
    rating,
    creditsEarned,
  };
};

export { calculateScore, predictRating };
