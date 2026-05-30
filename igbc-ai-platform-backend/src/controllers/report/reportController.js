import mongoose from "mongoose";
import Assessment from "../../models/Assessment.js";
import Project from "../../models/Project.js";
import Report from "../../models/Report.js";
import {
  generateFinalReport,
  generatePreliminaryReport,
} from "../../services/report/reportGenerator.js";

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

const ensureProjectAccess = async (projectId, user, { write = false } = {}) => {
  ensureValidObjectId(projectId, "project");

  if (write && !["admin", "assessor"].includes(user.role)) {
    throw createError("You do not have permission to generate reports", 403);
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw createError("Project not found", 404);
  }

  if (user.role === "company" && project.createdBy.toString() !== user._id.toString()) {
    throw createError("You do not have permission to access this project", 403);
  }

  return project;
};

const ensureAssessorAssignment = async (projectId, user) => {
  if (user.role !== "assessor") {
    return;
  }

  const assessment = await Assessment.findOne({
    projectId,
    assessorId: user._id,
  });

  if (!assessment) {
    throw createError("Assessors can generate reports only for assigned projects", 403);
  }
};

const populateReport = (query) =>
  query
    .populate("projectId", "projectName companyName createdBy")
    .populate("assessmentId", "assessmentType status score rating")
    .populate("generatedBy", "name email role");

const generateReport = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const reportType = req.body.reportType || "Preliminary";

    if (!["Preliminary", "Final"].includes(reportType)) {
      throw createError("Invalid report type", 400);
    }

    await ensureProjectAccess(projectId, req.user, { write: true });
    await ensureAssessorAssignment(projectId, req.user);

    const payload =
      reportType === "Final"
        ? await generateFinalReport(projectId, {
            assessmentId: req.body.assessmentId,
            generatedBy: req.user._id,
          })
        : await generatePreliminaryReport(projectId, {
            assessmentId: req.body.assessmentId,
            generatedBy: req.user._id,
          });

    const report = await Report.create({
      projectId: payload.projectId,
      assessmentId: payload.assessmentId,
      generatedBy: req.user._id,
      reportType: payload.reportType,
      summary: payload.summary,
      score: payload.score,
      rating: payload.rating,
      recommendations: payload.recommendations,
      reportPath: payload.reportPath,
    });

    res.status(201).json({
      success: true,
      message: "Report generated successfully",
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id, "report");

    const report = await populateReport(Report.findById(req.params.id));

    if (!report) {
      throw createError("Report not found", 404);
    }

    await ensureProjectAccess(report.projectId._id, req.user);

    if (req.user.role === "assessor") {
      await ensureAssessorAssignment(report.projectId._id, req.user);
    }

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectReports = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    await ensureProjectAccess(projectId, req.user);

    if (req.user.role === "assessor") {
      await ensureAssessorAssignment(projectId, req.user);
    }

    const reports = await populateReport(
      Report.find({ projectId }).sort({ createdAt: -1 })
    );

    res.status(200).json({
      success: true,
      count: reports.length,
      data: { reports },
    });
  } catch (error) {
    next(error);
  }
};

export { generateReport, getProjectReports, getReportById };
