import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
      index: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: [true, "Assessment is required"],
      index: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Report generator is required"],
    },
    reportType: {
      type: String,
      enum: ["Preliminary", "Final"],
      required: [true, "Report type is required"],
    },
    summary: {
      type: String,
      required: [true, "Report summary is required"],
      trim: true,
    },
    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
      required: [true, "Score is required"],
    },
    rating: {
      type: String,
      enum: ["Platinum", "Gold", "Silver", "Certified", "NotEligible"],
      required: [true, "Rating is required"],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    reportPath: {
      type: String,
      required: [true, "Report path is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ projectId: 1, reportType: 1 });
reportSchema.index({ assessmentId: 1, createdAt: -1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
