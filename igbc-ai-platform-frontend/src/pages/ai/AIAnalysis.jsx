import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const projects = [
  {
    id: "project-001",
    name: "IGBC Green Axis Tower",
    company: "Axis Sustainable Developers",
  },
  {
    id: "project-002",
    name: "Eco Habitat One",
    company: "Habitat Urban Infra",
  },
  {
    id: "project-003",
    name: "Sattva Net Zero Park",
    company: "Sattva Build Systems",
  },
];

const documents = [
  {
    id: "doc-001",
    projectId: "project-001",
    name: "Energy Performance Report.pdf",
    category: "Energy",
    type: "PDF",
    size: "2.8 MB",
    status: "Ready",
  },
  {
    id: "doc-002",
    projectId: "project-001",
    name: "Water Metering Schedule.xlsx",
    category: "Water",
    type: "Excel",
    size: "824 KB",
    status: "Ready",
  },
  {
    id: "doc-003",
    projectId: "project-002",
    name: "Indoor Air Quality Evidence.pdf",
    category: "Indoor Environment",
    type: "PDF",
    size: "1.4 MB",
    status: "Ready",
  },
  {
    id: "doc-004",
    projectId: "project-003",
    name: "Material Reuse Photographs.jpg",
    category: "Materials",
    type: "Image",
    size: "640 KB",
    status: "Ready",
  },
];

const analysisResult = {
  summary:
    "The uploaded evidence aligns with IGBC sustainability criteria for energy efficiency and operational monitoring. The document includes measurable performance data, baseline comparison, and implementation notes. A few supporting references should be expanded before final certification review.",
  confidenceScore: 88,
  status: "Validated",
  anomalies: [
    {
      title: "Missing baseline reference",
      severity: "Medium",
      detail: "Energy savings are stated, but the baseline model reference is not attached.",
    },
    {
      title: "Incomplete meter schedule",
      severity: "Low",
      detail: "Two sub-meter entries do not include calibration dates.",
    },
    {
      title: "Suspicious value variance",
      severity: "Medium",
      detail: "Peak demand reduction exceeds typical range and should be verified by assessor.",
    },
  ],
  recommendations: [
    "Attach baseline energy model summary with revision number.",
    "Add calibration dates for all energy sub-meters.",
    "Include assessor notes explaining peak demand reduction assumptions.",
    "Proceed to final review after supporting evidence is updated.",
  ],
};

const progressSteps = [
  { label: "Document loaded", value: 100 },
  { label: "Metadata extracted", value: 100 },
  { label: "Criteria checked", value: 92 },
  { label: "Recommendation generated", value: 88 },
];

const severityClasses = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium:
    "bg-amber-50 text-amber-700 ring-amber-200",
  High: "bg-red-50 text-red-700 ring-red-200",
};

const iconPaths = {
  ai: "M12 3 9.6 8.4 4 10.8l5.6 2.4L12 19l2.4-5.8 5.6-2.4-5.6-2.4L12 3Zm-6 12-1 2.3L2.7 18.3 5 19.3 6 22l1-2.7 2.3-1L7 17.3 6 15Z",
  document:
    "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 1.5V9h4.5L13 4.5ZM8 13h8v1.5H8V13Zm0 3h8v1.5H8V16Z",
  score:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 4v6h4v2h-6V6h2Z",
  anomaly:
    "M12 3 2 20h20L12 3Zm1 13h-2v-2h2v2Zm0-4h-2V8h2v4Z",
  recommendation:
    "M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Zm-3 17h6v2H9v-2Z",
  play: "M8 5v14l11-7L8 5Z",
  check:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.8 7.6-5.6 5.6-3-3 1.4-1.4 1.6 1.6 4.2-4.2 1.4 1.4Z",
};

function Icon({ name, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 fill-current ${className}`}>
      <path d={iconPaths[name]} />
    </svg>
  );
}

function StatusBadge({ children, tone = "emerald" }) {
  const classes =
    tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${classes}`}>
      {children}
    </span>
  );
}

function ScoreCard({ title, value, caption, icon }) {
  return (
    <Card variant="glass" className="p-4" interactive>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          <Icon name={icon} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="truncate text-2xl font-bold text-slate-950">{value}</p>
          <p className="text-xs text-slate-400">{caption}</p>
        </div>
      </div>
    </Card>
  );
}

function AIAnalysis() {
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const [selectedDocument, setSelectedDocument] = useState("doc-001");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasRunAnalysis, setHasRunAnalysis] = useState(true);

  const projectDocuments = useMemo(
    () => documents.filter((document) => document.projectId === selectedProject),
    [selectedProject],
  );

  const selectedProjectData = projects.find((project) => project.id === selectedProject);
  const selectedDocumentData = documents.find((document) => document.id === selectedDocument);

  const handleProjectChange = (event) => {
    const nextProject = event.target.value;
    const nextDocuments = documents.filter((document) => document.projectId === nextProject);

    setSelectedProject(nextProject);
    setSelectedDocument(nextDocuments[0]?.id || "");
    setHasRunAnalysis(false);
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setHasRunAnalysis(false);

    window.setTimeout(() => {
      setIsAnalyzing(false);
      setHasRunAnalysis(true);
    }, 1100);
  };

  return (
    <div className="space-y-6">
      <Card variant="gradient" className="overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              AI Validation
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AI Analysis
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Select a project document, run mock AI validation, and review summary, anomalies, confidence score, and recommendations.
            </p>
          </div>
          <Button
            variant="ghost"
            className="w-full border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto"
            onClick={handleRunAnalysis}
            disabled={!selectedDocument || isAnalyzing}
          >
            <Icon name="play" className="h-4 w-4" />
            {isAnalyzing ? "Analyzing" : "Run AI Analysis"}
          </Button>
        </div>
      </Card>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card variant="glass" className="p-5">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-950">Analysis Setup</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the project workspace and uploaded document.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Select Project
              </span>
              <select
                value={selectedProject}
                onChange={handleProjectChange}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Select Uploaded Document
              </span>
              <select
                value={selectedDocument}
                onChange={(event) => {
                  setSelectedDocument(event.target.value);
                  setHasRunAnalysis(false);
                }}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
              >
                {projectDocuments.map((document) => (
                  <option key={document.id} value={document.id}>
                    {document.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <Icon name="document" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-950">
                    {selectedDocumentData?.name || "No document selected"}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {selectedDocumentData?.category} - {selectedDocumentData?.type} - {selectedDocumentData?.size}
                  </p>
                  <p className="mt-2 truncate text-xs font-medium text-slate-400">
                    Project: {selectedProjectData?.company}
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleRunAnalysis}
              disabled={!selectedDocument || isAnalyzing}
            >
              <Icon name="ai" />
              {isAnalyzing ? "Running Analysis" : "Run AI Analysis"}
            </Button>
          </div>
        </Card>

        <Card variant="normal" className="p-5">
          <div className="mb-5 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Progress Indicators</h2>
              <p className="mt-1 text-sm text-slate-500">
                Mock pipeline execution status
              </p>
            </div>
            <StatusBadge tone={isAnalyzing ? "amber" : "emerald"}>
              {isAnalyzing ? "Processing" : "Ready"}
            </StatusBadge>
          </div>

          <div className="space-y-5">
            {progressSteps.map((step, index) => {
              const value = isAnalyzing ? Math.min(step.value, 35 + index * 18) : step.value;

              return (
                <div key={step.label}>
                  <div className="mb-2 flex min-w-0 items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold text-slate-700">
                      {step.label}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {value}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={[
                        "h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-700",
                        value >= 100 ? "w-full" : value >= 90 ? "w-[92%]" : value >= 80 ? "w-[88%]" : "w-[64%]",
                      ].join(" ")}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard
          title="Confidence Score"
          value={`${hasRunAnalysis ? analysisResult.confidenceScore : 0}%`}
          caption="Model certainty"
          icon="score"
        />
        <ScoreCard
          title="Detected Anomalies"
          value={hasRunAnalysis ? analysisResult.anomalies.length : 0}
          caption="Needs assessor review"
          icon="anomaly"
        />
        <ScoreCard
          title="Recommendations"
          value={hasRunAnalysis ? analysisResult.recommendations.length : 0}
          caption="AI generated actions"
          icon="recommendation"
        />
        <ScoreCard
          title="Validation Status"
          value={hasRunAnalysis ? analysisResult.status : "Pending"}
          caption="Current AI result"
          icon="check"
        />
      </section>

      {hasRunAnalysis ? (
        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <Card variant="normal" className="p-5">
            <div className="mb-5 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">AI Summary</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Generated from selected project evidence
                </p>
              </div>
              <StatusBadge>{analysisResult.status}</StatusBadge>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              {analysisResult.summary}
            </p>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-slate-900 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Confidence Score</p>
                  <p className="mt-1 text-4xl font-bold">{analysisResult.confidenceScore}%</p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-emerald-100 sm:max-w-xs">
                  <div className="h-full w-[88%] rounded-full bg-emerald-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card variant="glass" className="p-5">
            <h2 className="text-xl font-bold text-slate-950">Detected Anomalies</h2>
            <p className="mt-1 text-sm text-slate-500">
              Issues found during validation
            </p>
            <div className="mt-5 space-y-3">
              {analysisResult.anomalies.map((anomaly) => (
                <div
                  key={anomaly.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                >
                  <div className="flex min-w-0 flex-col gap-2 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between">
                    <p className="break-words font-bold text-slate-950">{anomaly.title}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${severityClasses[anomaly.severity]}`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {anomaly.detail}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      ) : (
        <Card variant="normal" className="p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <Icon name="ai" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-950">
            Run analysis to view results
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Select a project document and start AI validation to generate summary, anomalies, and recommendations.
          </p>
        </Card>
      )}

      {hasRunAnalysis && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-950">Recommendations</h2>
            <p className="mt-1 text-sm text-slate-500">
              Recommended next actions for assessor and project team
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {analysisResult.recommendations.map((recommendation, index) => (
              <Card key={recommendation} variant="glass" interactive className="p-5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <span className="text-sm font-black">{index + 1}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {recommendation}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default AIAnalysis;
