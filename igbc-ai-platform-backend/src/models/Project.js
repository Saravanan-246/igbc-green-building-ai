import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [150, "Project name cannot exceed 150 characters"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },
    projectType: {
      type: String,
      required: [true, "Project type is required"],
      trim: true,
      maxlength: [100, "Project type cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Under Review", "Approved", "Rejected"],
      default: "Draft",
    },
    assessmentStage: {
      type: String,
      enum: ["Preliminary", "Final"],
      default: "Preliminary",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project creator is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ projectName: 1, createdBy: 1 });
projectSchema.index({ status: 1, assessmentStage: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
