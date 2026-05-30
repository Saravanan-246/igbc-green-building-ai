import Assessment from "../models/Assessment.js";
import Certificate from "../models/Certificate.js";
import Document from "../models/Document.js";
import Project from "../models/Project.js";
import Report from "../models/Report.js";

const getCompanyProjectIds = async (userId) => {
  const projects = await Project.find({ createdBy: userId }).select("_id");
  return projects.map((project) => project._id);
};

const getAssessorProjectIds = async (userId) => {
  const assessments = await Assessment.find({ assessorId: userId }).select("projectId");
  return [...new Set(assessments.map((assessment) => assessment.projectId.toString()))];
};

const buildProjectScope = async (user) => {
  if (user.role === "admin") {
    return {};
  }

  if (user.role === "company") {
    return { _id: { $in: await getCompanyProjectIds(user._id) } };
  }

  return { _id: { $in: await getAssessorProjectIds(user._id) } };
};

const getDashboardStats = async (req, res, next) => {
  try {
    const projectScope = await buildProjectScope(req.user);
    const projects = await Project.find(projectScope).select("_id");
    const projectIds = projects.map((project) => project._id);
    const scopedProjectFilter =
      req.user.role === "admin" ? {} : { projectId: { $in: projectIds } };

    const [
      totalProjects,
      totalAssessments,
      totalDocuments,
      totalReports,
      totalCertificates,
      aiProcessedDocuments,
    ] = await Promise.all([
      Project.countDocuments(projectScope),
      Assessment.countDocuments(scopedProjectFilter),
      Document.countDocuments(scopedProjectFilter),
      Report.countDocuments(scopedProjectFilter),
      Certificate.countDocuments(scopedProjectFilter),
      Document.countDocuments({
        ...scopedProjectFilter,
        status: { $in: ["Validated", "Rejected"] },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalAssessments,
        totalDocuments,
        totalReports,
        totalCertificates,
        aiProcessedDocuments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardStats };
