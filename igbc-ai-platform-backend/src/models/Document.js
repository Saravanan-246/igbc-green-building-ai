import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required"],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      trim: true,
      lowercase: true,
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      min: [1, "File size must be greater than zero"],
    },
    filePath: {
      type: String,
      required: [true, "File path is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Architectural",
        "Energy",
        "Water",
        "Waste",
        "IndoorEnvironment",
        "Materials",
        "Other",
      ],
      required: [true, "Document category is required"],
    },
    status: {
      type: String,
      enum: ["Uploaded", "Processing", "Validated", "Rejected"],
      default: "Uploaded",
    },
    aiSummary: {
      type: String,
      trim: true,
      default: "",
    },
    validationResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ projectId: 1, category: 1 });
documentSchema.index({ projectId: 1, status: 1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;
