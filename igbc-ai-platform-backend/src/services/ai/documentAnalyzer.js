import mongoose from "mongoose";
import Document from "../../models/Document.js";
import { extractExcelData } from "../../utils/excelParser.js";
import { extractPDFText } from "../../utils/pdfParser.js";
import detectDocumentAnomalies from "./anomalyDetector.js";

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

const extractMetadata = (document) => ({
  documentId: document._id,
  projectId: document.projectId,
  category: document.category,
  fileName: document.fileName,
  originalName: document.originalName,
  fileType: document.fileType,
  fileSize: document.fileSize,
  uploadedAt: document.createdAt,
});

const generateSummary = (document) =>
  `Mock analysis completed for ${document.originalName}. The document is categorized under ${document.category} and is ready for assessor review.`;

const detectAnomalies = (document) => detectDocumentAnomalies(document);

const extractDocumentContent = async (document) => {
  try {
    if (document.fileType === "application/pdf") {
      const pdfResult = await extractPDFText(document.filePath);

      return {
        parser: "pdf",
        textPreview: pdfResult.text.slice(0, 2000),
        pages: pdfResult.pages,
        metadata: pdfResult.metadata,
      };
    }

    if (
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(document.fileType)
    ) {
      const excelResult = await extractExcelData(document.filePath);

      return {
        parser: "excel",
        sheetCount: excelResult.sheetCount,
        sheetNames: excelResult.sheetNames,
        rowCount: excelResult.sheets.reduce(
          (total, sheet) => total + sheet.rows.length,
          0
        ),
      };
    }

    return {
      parser: "metadata-only",
      message: "Binary image analysis is not enabled for mock validation.",
    };
  } catch (error) {
    return {
      parser: "failed",
      message: error.message,
    };
  }
};

const buildRecommendations = (document, anomalies) => {
  const recommendations = [];

  if (anomalies.length > 0) {
    recommendations.push("Review highlighted anomalies before final assessment.");
  }

  if (document.category === "Other") {
    recommendations.push("Reclassify the document into a specific IGBC category where possible.");
  }

  if (document.fileSize < 1024 * 50) {
    recommendations.push("Verify the uploaded file contains complete supporting evidence.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Proceed with assessor validation for this document.");
  }

  return recommendations;
};

const analyzeDocument = async (documentId) => {
  ensureValidObjectId(documentId, "document");

  const document = await Document.findById(documentId);

  if (!document) {
    throw createError("Document not found", 404);
  }

  document.status = "Processing";
  await document.save();

  const metadata = extractMetadata(document);
  const content = await extractDocumentContent(document);
  const summary = generateSummary(document);
  const anomalies = detectAnomalies(document);

  if (content.parser === "failed") {
    anomalies.push({
      type: "processing_error",
      field: "filePath",
      message: content.message,
      severity: "high",
    });
  }

  const confidenceScore = Math.max(50, 95 - anomalies.length * 10);
  const recommendations = buildRecommendations(document, anomalies);
  const validationResult = {
    metadata,
    content,
    anomalies,
    confidenceScore,
    recommendations,
  };

  document.aiSummary = summary;
  document.validationResult = validationResult;
  document.status = anomalies.some((anomaly) => anomaly.severity === "high")
    ? "Rejected"
    : "Validated";
  await document.save();

  return {
    summary,
    anomalies,
    confidenceScore,
    recommendations,
  };
};

export {
  analyzeDocument,
  detectAnomalies,
  extractMetadata,
  generateSummary,
};
