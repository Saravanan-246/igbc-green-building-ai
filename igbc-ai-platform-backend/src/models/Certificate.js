import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
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
    certificateNumber: {
      type: String,
      required: [true, "Certificate number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    rating: {
      type: String,
      enum: ["Platinum", "Gold", "Silver", "Certified", "NotEligible"],
      required: [true, "Rating is required"],
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    qrCode: {
      type: String,
      required: [true, "QR code is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Revoked"],
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ projectId: 1, status: 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
