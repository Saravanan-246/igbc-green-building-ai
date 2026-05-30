import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
      index: true,
    },
    assessorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assessor is required"],
      index: true,
    },
    assessmentType: {
      type: String,
      enum: ["Preliminary", "Final"],
      required: [true, "Assessment type is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "InReview", "Completed", "Rejected"],
      default: "Pending",
    },
    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
      default: 0,
    },
    maxScore: {
      type: Number,
      min: [0, "Max score cannot be negative"],
      default: 0,
    },
    rating: {
      type: String,
      enum: ["Platinum", "Gold", "Silver", "Certified", "NotEligible"],
      default: "NotEligible",
    },
    creditsEarned: {
      type: Number,
      min: [0, "Credits earned cannot be negative"],
      default: 0,
    },
    assessorComments: {
      type: String,
      trim: true,
      maxlength: [3000, "Assessor comments cannot exceed 3000 characters"],
      default: "",
    },
    aiScore: {
      type: Number,
      min: [0, "AI score cannot be negative"],
      default: 0,
    },
    aiRecommendation: {
      type: String,
      trim: true,
      maxlength: [3000, "AI recommendation cannot exceed 3000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

assessmentSchema.path("score").validate(function validateScore(score) {
  return this.maxScore === undefined || this.maxScore === 0 || score <= this.maxScore;
}, "Score cannot exceed max score");

assessmentSchema.index({ projectId: 1, assessmentType: 1 });
assessmentSchema.index({ assessorId: 1, status: 1 });

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
