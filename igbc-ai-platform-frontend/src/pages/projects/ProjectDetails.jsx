import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const projects = {
  "PRJ-1001": {
    projectName: "IGBC Green Axis Tower",
    companyName: "Axis Sustainable Developers",
    projectType: "Commercial Office",
    location: "Bengaluru, Karnataka",
    assessmentStage: "Final",
    status: "Approved",
    score: 92,
    rating: "Platinum",
    createdDate: "2026-05-12",
    description: "High-performance commercial development with energy efficient systems and water-positive operations.",
  },
  "PRJ-1002": {
    projectName: "Eco Habitat One",
    companyName: "Habitat Urban Infra",
    projectType: "Residential Campus",
    location: "Pune, Maharashtra",
    assessmentStage: "Preliminary",
    status: "Under Review",
    score: 76,
    rating: "Gold",
    createdDate: "2026-05-18",
    description: "Residential campus pursuing IGBC rating through passive design and efficient resource management.",
  },
};

const iconPaths = {
  arrow: "M19 12H5m5-5-5 5 5 5",
  building:
    "M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M8 7h4M8 11h4M8 15h4M2 21h20M16 9h2a2 2 0 0 1 2 2v10",
  location:
    "M12 21s7-4.8 7-11a7 7 0 1 0-14 0c0 6.2 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  chart: "M5 19V9m7 10V5m7 14v-7M3 21h18",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Icon({ name, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function DetailCard({ label, value, icon }) {
  return (
    <Card interactive>
      <div className="flex min-w-0 items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-emerald-50 p-3 text-emerald-600">
          <Icon name={icon} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 break-words text-lg font-bold text-slate-950">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const project = projects[id] || projects["PRJ-1001"];

  return (
    <div className="space-y-6">
      <Button as={Link} to="/projects" variant="ghost" className="w-full sm:w-auto">
        <Icon name="arrow" className="h-4 w-4" />
        Back to Projects
      </Button>

      <Card variant="gradient" className="overflow-hidden">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">{id || "Project"}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{project.projectName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{project.description}</p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard label="Company" value={project.companyName} icon="building" />
        <DetailCard label="Location" value={project.location} icon="location" />
        <DetailCard label="Rating" value={project.rating} icon="chart" />
        <DetailCard label="Score" value={`${project.score}/100`} icon="chart" />
      </div>

      <Card>
        <h2 className="text-xl font-bold text-slate-950">Project Summary</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Project Type", project.projectType],
            ["Assessment Stage", project.assessmentStage],
            ["Status", project.status],
            ["Created Date", project.createdDate],
          ].map(([label, value]) => (
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4" key={label}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
              <p className="mt-2 break-words text-sm font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ProjectDetails;
