import fs from "fs/promises";
import path from "path";
import Assessment from "../../models/Assessment.js";
import Document from "../../models/Document.js";
import Project from "../../models/Project.js";
import { generateRecommendations } from "../ai/recommendationEngine.js";

const reportsDirectory = path.resolve("uploads", "reports");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const writeReportArtifact = async (reportType, payload) => {
  await fs.mkdir(reportsDirectory, { recursive: true });

  const fileName = `${reportType.toLowerCase()}-${payload.projectId}-${Date.now()}.json`;
  const reportPath = path.join(reportsDirectory, fileName);

  await fs.writeFile(reportPath, JSON.stringify(payload, null, 2), "utf8");

  return reportPath;
};

const getAssessmentForReport = async (projectId, assessmentId, reportType) => {
  const filter = { projectId, assessmentType: reportType };

  if (assessmentId) {
    filter._id = assessmentId;
  }

  const assessment = await Assessment.findOne(filter).sort({ updatedAt: -1 });

  if (!assessment) {
    throw createError(`${reportType} assessment not found for this project`, 404);
  }

  return assessment;
};

const buildReportPayload = async ({ projectId, assessmentId, generatedBy, reportType }) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw createError("Project not found", 404);
  }

  const assessment = await getAssessmentForReport(projectId, assessmentId, reportType);
  const documents = await Document.find({ projectId }).select(
    "category status originalName validationResult"
  );
  const recommendations = await generateRecommendations(projectId);
  const summary = `${reportType} report for ${project.projectName}. Current assessment status is ${assessment.status} with rating ${assessment.rating}.`;
  const payload = {
    projectId: project._id,
    assessmentId: assessment._id,
    generatedBy,
    reportType,
    summary,
    score: assessment.score,
    rating: assessment.rating,
    recommendations: recommendations.map((recommendation) => recommendation.message),
    projectSnapshot: {
      projectName: project.projectName,
      companyName: project.companyName,
      projectType: project.projectType,
      location: project.location,
      status: project.status,
      assessmentStage: project.assessmentStage,
    },
    assessmentSnapshot: {
      status: assessment.status,
      score: assessment.score,
      maxScore: assessment.maxScore,
      creditsEarned: assessment.creditsEarned,
      assessorComments: assessment.assessorComments,
      aiScore: assessment.aiScore,
      aiRecommendation: assessment.aiRecommendation,
    },
    documentSummary: documents.map((document) => ({
      category: document.category,
      status: document.status,
      originalName: document.originalName,
      confidenceScore: document.validationResult?.confidenceScore || null,
    })),
    generatedAt: new Date().toISOString(),
  };

  const reportPath = await writeReportArtifact(reportType, payload);

  return {
    ...payload,
    reportPath,
  };
};

const generatePreliminaryReport = (projectId, options = {}) =>
  buildReportPayload({
    projectId,
    assessmentId: options.assessmentId,
    generatedBy: options.generatedBy,
    reportType: "Preliminary",
  });

const generateFinalReport = (projectId, options = {}) =>
  buildReportPayload({
    projectId,
    assessmentId: options.assessmentId,
    generatedBy: options.generatedBy,
    reportType: "Final",
  });

export { generateFinalReport, generatePreliminaryReport };
