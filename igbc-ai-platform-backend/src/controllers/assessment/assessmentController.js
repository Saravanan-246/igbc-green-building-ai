import mongoose from "mongoose";
import Assessment from "../../models/Assessment.js";
import Project from "../../models/Project.js";
import User from "../../models/User.js";

const assessmentTypes = ["Preliminary", "Final"];
const assessmentStatuses = ["Pending", "InReview", "Completed", "Rejected"];
const ratings = ["Platinum", "Gold", "Silver", "Certified", "NotEligible"];

const assessmentFields = [
  "projectId",
  "assessorId",
  "assessmentType",
  "status",
  "score",
  "maxScore",
  "rating",
  "creditsEarned",
  "assessorComments",
  "aiScore",
  "aiRecommendation",
];

const submitFields = [
  "score",
  "maxScore",
  "rating",
  "creditsEarned",
  "assessorComments",
  "aiScore",
  "aiRecommendation",
];

const pickFields = (body, allowedFields = assessmentFields) =>
  allowedFields.reduce((data, field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }

    return data;
  }, {});

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

const validateEnum = (value, allowedValues, fieldName) => {
  if (value !== undefined && !allowedValues.includes(value)) {
    throw createError(`Invalid ${fieldName}`, 400);
  }
};

const validateNumbers = (data) => {
  ["score", "maxScore", "creditsEarned", "aiScore"].forEach((field) => {
    if (data[field] !== undefined && Number(data[field]) < 0) {
      throw createError(`${field} cannot be negative`, 400);
    }
  });

  if (
    data.score !== undefined &&
    data.maxScore !== undefined &&
    Number(data.score) > Number(data.maxScore)
  ) {
    throw createError("Score cannot exceed max score", 400);
  }
};

const validateScoreAgainstExistingAssessment = async (assessmentId, data) => {
  if (data.score === undefined && data.maxScore === undefined) {
    return;
  }

  const assessment = await Assessment.findById(assessmentId).select("score maxScore");

  if (!assessment) {
    return;
  }

  const nextScore = data.score !== undefined ? Number(data.score) : assessment.score;
  const nextMaxScore =
    data.maxScore !== undefined ? Number(data.maxScore) : assessment.maxScore;

  if (nextMaxScore > 0 && nextScore > nextMaxScore) {
    throw createError("Score cannot exceed max score", 400);
  }
};

const validateAssessmentPayload = (data, { partial = false } = {}) => {
  if (!partial) {
    const requiredFields = ["projectId", "assessorId", "assessmentType"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw createError(`Missing required fields: ${missingFields.join(", ")}`, 400);
    }
  }

  if (data.projectId) {
    ensureValidObjectId(data.projectId, "project");
  }

  if (data.assessorId) {
    ensureValidObjectId(data.assessorId, "assessor");
  }

  validateEnum(data.assessmentType, assessmentTypes, "assessment type");
  validateEnum(data.status, assessmentStatuses, "assessment status");
  validateEnum(data.rating, ratings, "rating");
  validateNumbers(data);
};

const getCompanyProjectIds = async (userId) => {
  const projects = await Project.find({ createdBy: userId }).select("_id");
  return projects.map((project) => project._id);
};

const buildAssessmentFilter = async (user, assessmentId) => {
  const filter = {};

  if (assessmentId) {
    filter._id = assessmentId;
  }

  if (user.role === "assessor") {
    filter.assessorId = user._id;
  }

  if (user.role === "company") {
    filter.projectId = { $in: await getCompanyProjectIds(user._id) };
  }

  return filter;
};

const populateAssessment = (query) =>
  query
    .populate("projectId", "projectName companyName status assessmentStage createdBy")
    .populate("assessorId", "name email role");

const ensureProjectExists = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw createError("Project not found", 404);
  }

  return project;
};

const ensureAssessorExists = async (assessorId) => {
  const assessor = await User.findById(assessorId);

  if (!assessor || assessor.role !== "assessor") {
    throw createError("Assigned assessor not found", 404);
  }

  return assessor;
};

const ensureWriteAccess = (user, data = {}) => {
  if (user.role === "company") {
    throw createError("Company users cannot manage assessments", 403);
  }

  if (user.role === "assessor" && (data.projectId || data.assessorId)) {
    throw createError("Assessors cannot reassign assessment ownership", 403);
  }

  if (
    user.role === "assessor" &&
    data.assessorId &&
    data.assessorId.toString() !== user._id.toString()
  ) {
    throw createError("Assessors can only manage assigned assessments", 403);
  }
};

const createAssessment = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw createError("Only admins can create assessments", 403);
    }

    const assessmentData = pickFields(req.body);
    validateAssessmentPayload(assessmentData);
    ensureWriteAccess(req.user, assessmentData);

    await ensureProjectExists(assessmentData.projectId);
    await ensureAssessorExists(assessmentData.assessorId);

    const assessment = await Assessment.create(assessmentData);

    res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      data: { assessment },
    });
  } catch (error) {
    next(error);
  }
};

const getAssessments = async (req, res, next) => {
  try {
    const filter = await buildAssessmentFilter(req.user);
    const assessments = await populateAssessment(
      Assessment.find(filter).sort({ createdAt: -1 })
    );

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: { assessments },
    });
  } catch (error) {
    next(error);
  }
};

const getAssessmentById = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id, "assessment");

    const filter = await buildAssessmentFilter(req.user, req.params.id);
    const assessment = await populateAssessment(Assessment.findOne(filter));

    if (!assessment) {
      throw createError("Assessment not found", 404);
    }

    res.status(200).json({
      success: true,
      data: { assessment },
    });
  } catch (error) {
    next(error);
  }
};

const updateAssessment = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id, "assessment");
    ensureWriteAccess(req.user);

    const assessmentData = pickFields(req.body);

    if (Object.keys(assessmentData).length === 0) {
      throw createError("At least one assessment field is required for update", 400);
    }

    validateAssessmentPayload(assessmentData, { partial: true });
    await validateScoreAgainstExistingAssessment(req.params.id, assessmentData);

    if (assessmentData.projectId) {
      await ensureProjectExists(assessmentData.projectId);
    }

    if (assessmentData.assessorId) {
      await ensureAssessorExists(assessmentData.assessorId);
      ensureWriteAccess(req.user, assessmentData);
    }

    const filter = await buildAssessmentFilter(req.user, req.params.id);
    const assessment = await populateAssessment(
      Assessment.findOneAndUpdate(filter, assessmentData, {
        new: true,
        runValidators: true,
      })
    );

    if (!assessment) {
      throw createError("Assessment not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Assessment updated successfully",
      data: { assessment },
    });
  } catch (error) {
    next(error);
  }
};

const submitAssessment = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id, "assessment");
    ensureWriteAccess(req.user);

    const submitData = pickFields(req.body, submitFields);
    validateAssessmentPayload(submitData, { partial: true });
    await validateScoreAgainstExistingAssessment(req.params.id, submitData);

    const filter = await buildAssessmentFilter(req.user, req.params.id);
    const assessment = await populateAssessment(
      Assessment.findOneAndUpdate(
        filter,
        { ...submitData, status: "Completed" },
        {
          new: true,
          runValidators: true,
        }
      )
    );

    if (!assessment) {
      throw createError("Assessment not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Assessment submitted successfully",
      data: { assessment },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAssessment = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id, "assessment");
    ensureWriteAccess(req.user);

    const filter = await buildAssessmentFilter(req.user, req.params.id);
    const assessment = await Assessment.findOneAndDelete(filter);

    if (!assessment) {
      throw createError("Assessment not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createAssessment,
  deleteAssessment,
  getAssessmentById,
  getAssessments,
  submitAssessment,
  updateAssessment,
};
