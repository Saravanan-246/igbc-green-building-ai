import crypto from "crypto";
import mongoose from "mongoose";
import Assessment from "../../models/Assessment.js";
import Certificate from "../../models/Certificate.js";
import Project from "../../models/Project.js";
import generateQRCode from "../../services/certificate/qrGenerator.js";

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

  if (write && user.role !== "admin") {
    throw createError("Only admins can generate certificates", 403);
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw createError("Project not found", 404);
  }

  if (user.role === "company" && project.createdBy.toString() !== user._id.toString()) {
    throw createError("You do not have permission to access this certificate", 403);
  }

  return project;
};

const createCertificateNumber = () =>
  `IGBC-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

const createUniqueCertificateNumber = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const certificateNumber = createCertificateNumber();
    const existingCertificate = await Certificate.exists({ certificateNumber });

    if (!existingCertificate) {
      return certificateNumber;
    }
  }

  throw createError("Unable to generate unique certificate number", 500);
};

const getExpiryDate = (issueDate) => {
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 3);
  return expiryDate;
};

const populateCertificate = (query) =>
  query
    .populate("projectId", "projectName companyName createdBy")
    .populate("assessmentId", "assessmentType status score rating");

const generateCertificate = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    await ensureProjectAccess(projectId, req.user, { write: true });

    const assessment = await Assessment.findOne({
      projectId,
      status: "Completed",
      rating: { $ne: "NotEligible" },
    }).sort({ updatedAt: -1 });

    if (!assessment) {
      throw createError("Completed eligible assessment not found", 404);
    }

    const issueDate = new Date();
    const expiryDate = getExpiryDate(issueDate);
    const certificateNumber = await createUniqueCertificateNumber();
    const qrCode = await generateQRCode({
      certificateNumber,
      projectId,
      assessmentId: assessment._id,
      rating: assessment.rating,
      issueDate,
      expiryDate,
    });

    const certificate = await Certificate.create({
      projectId,
      assessmentId: assessment._id,
      certificateNumber,
      rating: assessment.rating,
      issueDate,
      expiryDate,
      qrCode,
      status: "Active",
    });

    res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};

const getCertificateById = async (req, res, next) => {
  try {
    ensureValidObjectId(req.params.id, "certificate");

    const certificate = await populateCertificate(
      Certificate.findById(req.params.id)
    );

    if (!certificate) {
      throw createError("Certificate not found", 404);
    }

    await ensureProjectAccess(certificate.projectId._id, req.user);

    res.status(200).json({
      success: true,
      data: { certificate },
    });
  } catch (error) {
    next(error);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateNumber } = req.params;

    const certificate = await populateCertificate(
      Certificate.findOne({ certificateNumber })
    );

    if (!certificate) {
      throw createError("Certificate not found", 404);
    }

    const now = new Date();
    const effectiveStatus =
      certificate.status === "Active" && certificate.expiryDate < now
        ? "Expired"
        : certificate.status;

    res.status(200).json({
      success: true,
      data: {
        valid: effectiveStatus === "Active",
        status: effectiveStatus,
        certificate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { generateCertificate, getCertificateById, verifyCertificate };
