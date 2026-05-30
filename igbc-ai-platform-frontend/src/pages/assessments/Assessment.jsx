import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const assessments = [
  {
    id: "ASM-001",
    projectName: "IGBC Green Axis Tower",
    assessmentType: "Final",
    assessor: "Aarav Mehta",
    score: 92,
    maxScore: 100,
    creditsEarned: 58,
    rating: "Platinum",
    status: "Completed",
    updatedAt: "2026-05-24",
  },
  {
    id: "ASM-002",
    projectName: "Eco Habitat One",
    assessmentType: "Preliminary",
    assessor: "Nisha Rao",
    score: 76,
    maxScore: 100,
    creditsEarned: 43,
    rating: "Gold",
    status: "In Review",
    updatedAt: "2026-05-23",
  },
  {
    id: "ASM-003",
    projectName: "Sattva Net Zero Park",
    assessmentType: "Preliminary",
    assessor: "Kabir Sharma",
    score: 64,
    maxScore: 100,
    creditsEarned: 35,
    rating: "Silver",
    status: "Pending",
    updatedAt: "2026-05-21",
  },
  {
    id: "ASM-004",
    projectName: "Blue River Logistics Hub",
    assessmentType: "Final",
    assessor: "Meera Iyer",
    score: 38,
    maxScore: 100,
    creditsEarned: 19,
    rating: "Not Eligible",
    status: "Rejected",
    updatedAt: "2026-05-18",
  },
  {
    id: "ASM-005",
    projectName: "Urban Leaf School",
    assessmentType: "Final",
    assessor: "Aarav Mehta",
    score: 48,
    maxScore: 100,
    creditsEarned: 28,
    rating: "Certified",
    status: "Completed",
    updatedAt: "2026-05-15",
  },
];

const projects = [
  "IGBC Green Axis Tower",
  "Eco Habitat One",
  "Sattva Net Zero Park",
  "Urban Leaf School",
];

const assessors = ["Aarav Mehta", "Nisha Rao", "Kabir Sharma", "Meera Iyer"];

const timeline = [
  {
    label: "Assessment Created",
    detail: "Project assigned for preliminary evidence review.",
    status: "Completed",
  },
  {
    label: "Document Validation",
    detail: "AI validation completed for uploaded evidence.",
    status: "Completed",
  },
  {
    label: "Assessor Review",
    detail: "Assessor is reviewing criteria and credit allocation.",
    status: "In Review",
  },
  {
    label: "Final Submission",
    detail: "Submit rating recommendation for certificate approval.",
    status: "Pending",
  },
];

const statusClasses = {
  Pending:
    "bg-slate-100 text-slate-700 ring-slate-200",
  "In Review":
    "bg-amber-50 text-amber-700 ring-amber-200",
  Completed:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected:
    "bg-red-50 text-red-700 ring-red-200",
};

const ratingClasses = {
  Platinum:
    "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Gold: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Silver:
    "bg-slate-100 text-slate-700 ring-slate-200",
  Certified:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Not Eligible":
    "bg-red-50 text-red-700 ring-red-200",
};

const progressWidthClasses = {
  92: "w-[92%]",
  76: "w-[76%]",
  64: "w-[64%]",
  48: "w-[48%]",
  38: "w-[38%]",
};

const iconPaths = {
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z",
  assessments:
    "M5 4h14v16H5V4Zm3 4h8V6.5H8V8Zm0 4h8v-1.5H8V12Zm0 4h5v-1.5H8V16Zm8.5-.25 1.7-1.7-1.05-1.05-.65.65-.65-.65-1.05 1.05 1.7 1.7Z",
  completed:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.8 7.6-5.6 5.6-3-3 1.4-1.4 1.6 1.6 4.2-4.2 1.4 1.4Z",
  pending: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5.2l3.5 2.1-1 1.7-4.5-2.7V7h2Z",
  credits:
    "M12 3 9.6 8.4 4 10.8l5.6 2.4L12 19l2.4-5.8 5.6-2.4-5.6-2.4L12 3Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z",
  view: "M12 5c5 0 8.5 4.5 9.6 6.3a1.3 1.3 0 0 1 0 1.4C20.5 14.5 17 19 12 19s-8.5-4.5-9.6-6.3a1.3 1.3 0 0 1 0-1.4C3.5 9.5 7 5 12 5Zm0 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

function Icon({ name, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 fill-current ${className}`}>
      <path d={iconPaths[name]} />
    </svg>
  );
}

function Badge({ children, className }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${className}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, caption, icon }) {
  return (
    <Card variant="glass" className="p-4" interactive>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          <Icon name={icon} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="text-xs text-slate-400">{caption}</p>
        </div>
      </div>
    </Card>
  );
}

function ProgressBar({ score }) {
  return (
    <div className="w-full min-w-0">
      <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
        <span>Score</span>
        <span>{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 ${progressWidthClasses[score] || "w-1/2"}`}
        />
      </div>
    </div>
  );
}

function AssessmentMobileCard({ assessment, isSelected, onSelect }) {
  return (
    <Card
      variant={isSelected ? "glass" : "normal"}
      className="p-4"
      interactive
      onClick={() => onSelect(assessment.id)}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-slate-950">
            {assessment.projectName}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {assessment.assessmentType} assessment
          </p>
        </div>
        <span className="shrink-0">
          <Badge className={statusClasses[assessment.status]}>{assessment.status}</Badge>
        </span>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 text-sm min-[380px]:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assessor</p>
          <p className="mt-1 truncate text-slate-700">{assessment.assessor}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rating</p>
          <p className="mt-1 truncate text-slate-700">{assessment.rating}</p>
        </div>
      </div>
      <div className="mt-4">
        <ProgressBar score={assessment.score} />
      </div>
    </Card>
  );
}

function Assessment() {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(assessments[0].id);
  const [project, setProject] = useState(projects[0]);
  const [assessor, setAssessor] = useState(assessors[0]);
  const [assessmentType, setAssessmentType] = useState("Preliminary");

  const selectedAssessment = assessments.find(
    (assessment) => assessment.id === selectedAssessmentId,
  );

  const stats = useMemo(() => {
    const completed = assessments.filter((item) => item.status === "Completed").length;
    const pending = assessments.filter((item) => item.status === "Pending").length;
    const totalCredits = assessments.reduce((total, item) => total + item.creditsEarned, 0);

    return [
      {
        label: "Total Assessments",
        value: assessments.length,
        caption: "Across portfolio",
        icon: "assessments",
      },
      {
        label: "Completed",
        value: completed,
        caption: "Ready for reporting",
        icon: "completed",
      },
      {
        label: "Pending",
        value: pending,
        caption: "Awaiting review",
        icon: "pending",
      },
      {
        label: "Credits Earned",
        value: totalCredits,
        caption: "Mock total",
        icon: "credits",
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      <Card variant="gradient" className="overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Certification Review
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Assessments
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create assessments, assign assessors, track scores, and monitor credit progress across IGBC projects.
            </p>
          </div>
          <Button variant="ghost" className="w-full border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto">
            <Icon name="plus" className="h-4 w-4" />
            Create Assessment
          </Button>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="space-y-6">
          <Card variant="glass" className="p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Create Assessment</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mock setup for assigning project reviews.
                </p>
              </div>
              <Badge className={statusClasses.Pending}>Draft Setup</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Project
                </span>
                <select
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {projects.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Assign Assessor
                </span>
                <select
                  value={assessor}
                  onChange={(event) => setAssessor(event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {assessors.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Assessment Type
                </span>
                <select
                  value={assessmentType}
                  onChange={(event) => setAssessmentType(event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="Preliminary">Preliminary</option>
                  <option value="Final">Final</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 text-sm text-slate-500">
                Selected: {project} assigned to {assessor}
              </p>
              <Button variant="primary" className="w-full sm:w-auto">
                <Icon name="plus" className="h-4 w-4" />
                Create Assessment
              </Button>
            </div>
          </Card>

          <div className="space-y-4 lg:hidden">
            {assessments.map((assessment) => (
              <AssessmentMobileCard
                key={assessment.id}
                assessment={assessment}
                isSelected={assessment.id === selectedAssessmentId}
                onSelect={setSelectedAssessmentId}
              />
            ))}
          </div>

          <Card variant="normal" padding="none" className="hidden overflow-hidden lg:block">
            <div className="border-b border-slate-100 p-5">
              <h2 className="text-xl font-bold text-slate-950">Assessment List</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review project assessment status and scoring.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Project</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Assessor</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Credits</th>
                    <th className="px-5 py-4">Rating</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.map((assessment) => (
                    <tr
                      key={assessment.id}
                      className={`transition hover:bg-emerald-50/50 ${
                        assessment.id === selectedAssessmentId
                          ? "bg-emerald-50/70"
                          : "bg-white"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950">{assessment.projectName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Updated {formatDate(assessment.updatedAt)}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {assessment.assessmentType}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {assessment.assessor}
                      </td>
                      <td className="px-5 py-4">
                        <ProgressBar score={assessment.score} />
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {assessment.creditsEarned}
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={ratingClasses[assessment.rating]}>{assessment.rating}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={statusClasses[assessment.status]}>{assessment.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedAssessmentId(assessment.id)}
                            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                            aria-label={`View ${assessment.projectName}`}
                          >
                            <Icon name="view" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card variant="glass" className="p-5">
            <div className="flex min-w-0 flex-col gap-4 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Assessment Details
                </p>
                <h2 className="mt-2 break-words text-xl font-bold text-slate-950">
                  {selectedAssessment.projectName}
                </h2>
              </div>
              <span className="shrink-0">
                <Badge className={statusClasses[selectedAssessment.status]}>
                  {selectedAssessment.status}
                </Badge>
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Assessor</p>
                <p className="mt-1 flex min-w-0 items-center gap-2 font-bold text-slate-950">
                  <Icon name="user" className="h-4 w-4 text-emerald-600" />
                  <span className="truncate">{selectedAssessment.assessor}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Score</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {selectedAssessment.score}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Credits</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {selectedAssessment.creditsEarned}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-col gap-2 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
                  <p className="text-sm font-semibold text-slate-700">
                    Progress Indicator
                  </p>
                  <Badge className={ratingClasses[selectedAssessment.rating]}>
                    {selectedAssessment.rating}
                  </Badge>
                </div>
                <ProgressBar score={selectedAssessment.score} />
              </div>
            </div>
          </Card>

          <Card variant="normal" className="p-5">
            <h2 className="text-xl font-bold text-slate-950">
              Assessment Timeline
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Current review lifecycle
            </p>

            <div className="mt-6 space-y-5">
              {timeline.map((item, index) => (
                <div key={item.label} className="relative flex gap-3">
                  {index !== timeline.length - 1 && (
                    <span className="absolute left-5 top-10 h-[calc(100%+0.25rem)] w-px bg-slate-200" />
                  )}
                  <div
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ${
                      item.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : item.status === "In Review"
                          ? "bg-amber-50 text-amber-700 ring-amber-200"
                          : "bg-slate-100 text-slate-500 ring-slate-200"
                    }`}
                  >
                    <Icon name={item.status === "Completed" ? "completed" : "pending"} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-950">{item.label}</p>
                      <Badge className={statusClasses[item.status]}>{item.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export default Assessment;
