import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import Certificate from "../models/Certificate.js";
import Document from "../models/Document.js";
import Project from "../models/Project.js";
import Report from "../models/Report.js";
import User from "../models/User.js";
import generateQRCode from "../services/certificate/qrGenerator.js";

dotenv.config();

const ids = {
  adminUser: new mongoose.Types.ObjectId("665000000000000000000001"),
  assessorUser: new mongoose.Types.ObjectId("665000000000000000000002"),
  companyUser: new mongoose.Types.ObjectId("665000000000000000000003"),
  project: new mongoose.Types.ObjectId("665000000000000000000102"),
  document: new mongoose.Types.ObjectId("665000000000000000000201"),
  assessment: new mongoose.Types.ObjectId("665000000000000000000301"),
  report: new mongoose.Types.ObjectId("665000000000000000000401"),
  certificate: new mongoose.Types.ObjectId("665000000000000000000501")
};

const now = new Date();
const expiryDate = new Date(now);
expiryDate.setFullYear(expiryDate.getFullYear() + 3);

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to run seed data");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const [adminPassword, assessorPassword, companyPassword] = await Promise.all([
    bcrypt.hash("Admin123!", 12),
    bcrypt.hash("Assessor123!", 12),
    bcrypt.hash("Company123!", 12)
  ]);

  await User.bulkWrite([
    {
      updateOne: {
        filter: { _id: ids.adminUser },
        update: {
          $set: {
            name: "IGBC Test Admin",
            email: "admin.tester@igbc.local",
            password: adminPassword,
            role: "admin"
          }
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { _id: ids.assessorUser },
        update: {
          $set: {
            name: "IGBC Test Assessor",
            email: "assessor.tester@igbc.local",
            password: assessorPassword,
            role: "assessor"
          }
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { _id: ids.companyUser },
        update: {
          $set: {
            name: "IGBC Test Company User",
            email: "company.tester@igbc.local",
            password: companyPassword,
            role: "company"
          }
        },
        upsert: true
      }
    }
  ]);

  await Project.updateOne(
    { _id: ids.project },
    {
      $set: {
        projectName: "IGBC Seed Test Tower",
        companyName: "IGBC Demo Developers Pvt Ltd",
        projectType: "Commercial Office",
        location: "Bengaluru, Karnataka",
        description: "Seeded project for end-to-end IGBC API testing.",
        status: "Submitted",
        assessmentStage: "Preliminary",
        createdBy: ids.companyUser
      }
    },
    { upsert: true }
  );

  await Document.updateOne(
    { _id: ids.document },
    {
      $set: {
        projectId: ids.project,
        uploadedBy: ids.companyUser,
        fileName: "energy-performance-report.pdf",
        originalName: "Energy Performance Report.pdf",
        fileType: "application/pdf",
        fileSize: 524288,
        filePath: "uploads/documents/energy-performance-report.pdf",
        category: "Energy",
        status: "Validated",
        aiSummary: "Seeded document summary for integration testing.",
        validationResult: {
          confidenceScore: 88,
          anomalies: [],
          recommendations: ["Proceed with assessor validation for this document."]
        }
      }
    },
    { upsert: true }
  );

  await Assessment.updateOne(
    { _id: ids.assessment },
    {
      $set: {
        projectId: ids.project,
        assessorId: ids.assessorUser,
        assessmentType: "Preliminary",
        status: "Completed",
        score: 82,
        maxScore: 100,
        rating: "Gold",
        creditsEarned: 41,
        assessorComments: "Seeded assessment for complete workflow testing.",
        aiScore: 80,
        aiRecommendation: "Predicted IGBC rating: Gold"
      }
    },
    { upsert: true }
  );

  await Report.updateOne(
    { _id: ids.report },
    {
      $set: {
        projectId: ids.project,
        assessmentId: ids.assessment,
        generatedBy: ids.adminUser,
        reportType: "Preliminary",
        summary: "Seeded preliminary report for IGBC Seed Test Tower.",
        score: 82,
        rating: "Gold",
        recommendations: [
          "Maintain documented energy performance evidence.",
          "Prepare final-stage supporting documents."
        ],
        reportPath: "uploads/reports/preliminary-seed-report.json"
      }
    },
    { upsert: true }
  );

  const certificateNumber = "IGBC-2026-SEED0001";
  const qrCode = await generateQRCode({
    certificateNumber,
    projectId: ids.project,
    assessmentId: ids.assessment,
    rating: "Gold",
    issueDate: now,
    expiryDate
  });

  await Certificate.updateOne(
    { _id: ids.certificate },
    {
      $set: {
        projectId: ids.project,
        assessmentId: ids.assessment,
        certificateNumber,
        rating: "Gold",
        issueDate: now,
        expiryDate,
        qrCode,
        status: "Active"
      }
    },
    { upsert: true }
  );

  await mongoose.disconnect();

  console.log("IGBC seed data inserted successfully");
  console.table({
    admin: "admin.tester@igbc.local / Admin123!",
    assessor: "assessor.tester@igbc.local / Assessor123!",
    company: "company.tester@igbc.local / Company123!",
    projectId: ids.project.toString(),
    documentId: ids.document.toString(),
    assessmentId: ids.assessment.toString(),
    reportId: ids.report.toString(),
    certificateId: ids.certificate.toString(),
    certificateNumber
  });
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
