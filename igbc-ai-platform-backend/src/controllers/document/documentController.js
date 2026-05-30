import fs from "fs/promises";
import mongoose from "mongoose";
import Document from "../../models/Document.js";
import Project from "../../models/Project.js";

const allowedCategories = [
  "Architectural",
  "Energy",
  "Water",
  "Waste",
  "IndoorEnvironment",
  "Materials",
  "Other",
];

const ensureValidObjectId = (id, resourceName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${resourceName} identifier`);
    error.statusCode = 400;
    throw error;
  }
};

const removeUploadedFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Failed to remove uploaded file: ${error.message}`);
    }
  }
};

const getAccessibleProject = async (projectId, user) => {
  ensureValidObjectId(projectId, "project");

  const filter = { _id: projectId };

  if (user.role !== "admin") {
    filter.createdBy = user._id;
  }

  const project = await Project.findOne(filter);

  if (!project) {
    const error = new Error("Project not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  return project;
};

const getAccessibleDocument = async (documentId, user) => {
  ensureValidObjectId(documentId, "document");

  const document = await Document.findById(documentId)
    .populate("projectId", "projectName companyName createdBy")
    .populate("uploadedBy", "name email role");

  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  const projectOwnerId = document.projectId?.createdBy?.toString();

  if (user.role !== "admin" && projectOwnerId !== user._id.toString()) {
    const error = new Error("You do not have permission to access this document");
    error.statusCode = 403;
    throw error;
  }

  return document;
};

const uploadDocument = async (req, res, next) => {
  try {
    const { projectId, category } = req.body;

    if (!req.file) {
      const error = new Error("Document file is required");
      error.statusCode = 400;
      throw error;
    }

    if (!category || !allowedCategories.includes(category)) {
      const error = new Error("Valid document category is required");
      error.statusCode = 400;
      throw error;
    }

    await getAccessibleProject(projectId, req.user);

    const document = await Document.create({
      projectId,
      uploadedBy: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: { document },
    });
  } catch (error) {
    await removeUploadedFile(req.file?.path);
    next(error);
  }
};

const getProjectDocuments = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    await getAccessibleProject(projectId, req.user);

    const documents = await Document.find({ projectId })
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: { documents },
    });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const document = await getAccessibleDocument(req.params.id, req.user);

    res.status(200).json({
      success: true,
      data: { document },
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await getAccessibleDocument(req.params.id, req.user);

    await Document.findByIdAndDelete(document._id);
    await removeUploadedFile(document.filePath);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  deleteDocument,
  getDocumentById,
  getProjectDocuments,
  uploadDocument,
};
