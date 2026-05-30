import mongoose from "mongoose";
import Assessment from "../../models/Assessment.js";
import Document from "../../models/Document.js";
import Project from "../../models/Project.js";
import { analyzeDocument } from "../../services/ai/documentAnalyzer.js";
import { calculateScore } from "../../services/ai/creditScoring.js";
import { generateRecommendations } from "../../services/ai/recommendationEngine.js";

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

const ensureAssessorProjectAccess = async (projectId, user) => {
  if (user.role !== "assessor") {
    return;
  }

  const assignedAssessment = await Assessment.exists({
    projectId,
    assessorId: user._id,
  });

  if (!assignedAssessment) {
    throw createError("Assessors can access AI tools only for assigned projects", 403);
  }
};

const ensureProjectExists = async (projectId) => {
  const project = await Project.exists({ _id: projectId });

  if (!project) {
    throw createError("Project not found", 404);
  }
};

const analyzeUploadedDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    ensureValidObjectId(documentId, "document");

    const existingDocument = await Document.findById(documentId).select("projectId");

    if (!existingDocument) {
      throw createError("Document not found", 404);
    }

    await ensureAssessorProjectAccess(existingDocument.projectId, req.user);

    const result = await analyzeDocument(documentId);
    const document = await Document.findById(documentId).select(
      "projectId status aiSummary validationResult"
    );

    res.status(200).json({
      success: true,
      message: "Document analysis completed",
      data: {
        document,
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const scoreProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    ensureValidObjectId(projectId, "project");
    await ensureProjectExists(projectId);
    await ensureAssessorProjectAccess(projectId, req.user);

    const result = await calculateScore(projectId);

    const assessmentUpdateFilter =
      req.user.role === "assessor"
        ? { projectId, assessorId: req.user._id }
        : { projectId };

    await Assessment.updateMany(
      assessmentUpdateFilter,
      {
        aiScore: result.score,
        aiRecommendation: `Predicted IGBC rating: ${result.rating}`,
      },
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Project AI score generated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    ensureValidObjectId(projectId, "project");
    await ensureProjectExists(projectId);
    await ensureAssessorProjectAccess(projectId, req.user);

    const recommendations = await generateRecommendations(projectId);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: { recommendations },
    });
  } catch (error) {
    next(error);
  }
};

export { analyzeUploadedDocument, getRecommendations, scoreProject };
