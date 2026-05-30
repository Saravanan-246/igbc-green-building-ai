const requiredDocumentFields = [
  "projectId",
  "uploadedBy",
  "fileName",
  "originalName",
  "fileType",
  "fileSize",
  "filePath",
  "category",
];

const allowedCategories = [
  "Architectural",
  "Energy",
  "Water",
  "Waste",
  "IndoorEnvironment",
  "Materials",
  "Other",
];

const allowedStatuses = ["Uploaded", "Processing", "Validated", "Rejected"];

const createAnomaly = (type, field, message, severity = "medium") => ({
  type,
  field,
  message,
  severity,
});

const detectAnomalies = (document) => {
  const anomalies = [];

  requiredDocumentFields.forEach((field) => {
    if (!document?.[field]) {
      anomalies.push(
        createAnomaly("missing_field", field, `${field} is missing`, "high")
      );
    }
  });

  if (document?.category && !allowedCategories.includes(document.category)) {
    anomalies.push(
      createAnomaly("invalid_value", "category", "Document category is invalid")
    );
  }

  if (document?.status && !allowedStatuses.includes(document.status)) {
    anomalies.push(
      createAnomaly("invalid_value", "status", "Document status is invalid")
    );
  }

  if (document?.fileSize !== undefined) {
    if (document.fileSize <= 0) {
      anomalies.push(
        createAnomaly("invalid_value", "fileSize", "File size must be positive")
      );
    }

    if (document.fileSize < 1024) {
      anomalies.push(
        createAnomaly(
          "suspicious_value",
          "fileSize",
          "File size is unusually small",
          "low"
        )
      );
    }
  }

  if (!document?.aiSummary && document?.status === "Validated") {
    anomalies.push(
      createAnomaly(
        "incomplete_submission",
        "aiSummary",
        "Validated document does not have an AI summary"
      )
    );
  }

  return anomalies;
};

export default detectAnomalies;
export { detectAnomalies };
