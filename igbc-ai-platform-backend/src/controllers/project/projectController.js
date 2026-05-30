import mongoose from "mongoose";
import Project from "../../models/Project.js";

const allowedStatusTransitions = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

const allowedAssessmentStages = ["Preliminary", "Final"];

const pickProjectFields = (body) => {
  const allowedFields = [
    "projectName",
    "companyName",
    "projectType",
    "location",
    "description",
    "status",
    "assessmentStage",
  ];

  return allowedFields.reduce((projectData, field) => {
    if (body[field] !== undefined) {
      projectData[field] = body[field];
    }

    return projectData;
  }, {});
};

const validateProjectPayload = (payload, { partial = false } = {}) => {
  const requiredFields = ["projectName", "companyName", "projectType", "location"];

  if (!partial) {
    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      const error = new Error(`Missing required fields: ${missingFields.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }
  }

  if (payload.status && !allowedStatusTransitions.includes(payload.status)) {
    const error = new Error("Invalid project status");
    error.statusCode = 400;
    throw error;
  }

  if (
    payload.assessmentStage &&
    !allowedAssessmentStages.includes(payload.assessmentStage)
  ) {
    const error = new Error("Invalid assessment stage");
    error.statusCode = 400;
    throw error;
  }
};

const ensureValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid project identifier");
    error.statusCode = 400;
    throw error;
  }
};

const buildProjectAccessFilter = (user, projectId) => {
  const filter = {};

  if (projectId) {
    filter._id = projectId;
  }

  if (user.role === "company") {
    filter.createdBy = user._id;
  }

  return filter;
};

const createProject = async (req, res, next) => {
  try {
    const projectData = pickProjectFields(req.body);
    validateProjectPayload(projectData);

    const project = await Project.create({
      ...projectData,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const filter = buildProjectAccessFilter(req.user);
    const projects = await Project.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id);

    const project = await Project.findOne(
      buildProjectAccessFilter(req.user, req.params.id)
    ).populate("createdBy", "name email role");

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id);

    const projectData = pickProjectFields(req.body);

    if (Object.keys(projectData).length === 0) {
      const error = new Error("At least one project field is required for update");
      error.statusCode = 400;
      throw error;
    }

    validateProjectPayload(projectData, { partial: true });

    const project = await Project.findOneAndUpdate(
      buildProjectAccessFilter(req.user, req.params.id),
      projectData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("createdBy", "name email role");

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id);

    const project = await Project.findOneAndDelete(
      buildProjectAccessFilter(req.user, req.params.id)
    );

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
};
