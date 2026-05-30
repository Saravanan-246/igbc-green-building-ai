import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const projects = [
  {
    id: "PRJ-1001",
    projectName: "IGBC Green Axis Tower",
    companyName: "Axis Sustainable Developers",
    projectType: "Commercial Office",
    location: "Bengaluru, Karnataka",
    assessmentStage: "Final",
    status: "Approved",
    createdDate: "2026-05-12",
  },
  {
    id: "PRJ-1002",
    projectName: "Eco Habitat One",
    companyName: "Habitat Urban Infra",
    projectType: "Residential Campus",
    location: "Pune, Maharashtra",
    assessmentStage: "Preliminary",
    status: "Under Review",
    createdDate: "2026-05-18",
  },
  {
    id: "PRJ-1003",
    projectName: "Sattva Net Zero Park",
    companyName: "Sattva Build Systems",
    projectType: "IT Park",
    location: "Hyderabad, Telangana",
    assessmentStage: "Preliminary",
    status: "Submitted",
    createdDate: "2026-05-21",
  },
  {
    id: "PRJ-1004",
    projectName: "Aaranya Wellness Resort",
    companyName: "Aaranya Hospitality",
    projectType: "Hospitality",
    location: "Coorg, Karnataka",
    assessmentStage: "Preliminary",
    status: "Draft",
    createdDate: "2026-05-23",
  },
  {
    id: "PRJ-1005",
    projectName: "Blue River Logistics Hub",
    companyName: "Blue River Warehousing",
    projectType: "Industrial",
    location: "Chennai, Tamil Nadu",
    assessmentStage: "Final",
    status: "Rejected",
    createdDate: "2026-04-29",
  },
  {
    id: "PRJ-1006",
    projectName: "Urban Leaf School",
    companyName: "Urban Leaf Foundation",
    projectType: "Institutional",
    location: "Ahmedabad, Gujarat",
    assessmentStage: "Final",
    status: "Approved",
    createdDate: "2026-04-16",
  },
];

const statusOptions = ["All", "Draft", "Submitted", "Under Review", "Approved", "Rejected"];

const statusClasses = {
  Draft:
    "bg-slate-100 text-slate-700 ring-slate-200",
  Submitted:
    "bg-cyan-50 text-cyan-700 ring-cyan-200",
  "Under Review":
    "bg-amber-50 text-amber-700 ring-amber-200",
  Approved:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected:
    "bg-red-50 text-red-700 ring-red-200",
};

const iconPaths = {
  search:
    "m20.3 18.9-4.2-4.2a7 7 0 1 0-1.4 1.4l4.2 4.2 1.4-1.4ZM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z",
  projects:
    "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm3 1.25v2.5h10v-2.5H7Zm0 5v3.5h4v-3.5H7Zm6 0v3.5h4v-3.5h-4Z",
  active: "M12 2 4 5.5v6.2C4 16.8 7.4 21 12 22c4.6-1 8-5.2 8-10.3V5.5L12 2Z",
  approved: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.8 7.6-5.6 5.6-3-3 1.4-1.4 1.6 1.6 4.2-4.2 1.4 1.4Z",
  pending: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5.2l3.5 2.1-1 1.7-4.5-2.7V7h2Z",
  view: "M12 5c5 0 8.5 4.5 9.6 6.3a1.3 1.3 0 0 1 0 1.4C20.5 14.5 17 19 12 19s-8.5-4.5-9.6-6.3a1.3 1.3 0 0 1 0-1.4C3.5 9.5 7 5 12 5Zm0 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
  edit: "M5 17.2V20h2.8L18.9 8.9l-2.8-2.8L5 17.2ZM20.7 7.1a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.3 1.3 3.8 3.8 1.3-1.3Z",
  delete:
    "M8 4h8l1 2h4v2H3V6h4l1-2Zm1 6h2v8H9v-8Zm4 0h2v8h-2v-8Zm-6 0h10l-.7 10H7.7L7 10Z",
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

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

function StatCard({ label, value, icon, caption }) {
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

function ActionButton({ icon, label, tone = "slate", to }) {
  const toneClass =
    tone === "danger"
      ? "text-red-600 hover:bg-red-50"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950";
  const Component = to ? Link : "button";

  return (
    <Component
      to={to}
      type={to ? undefined : "button"}
      className={`grid h-9 w-9 place-items-center rounded-xl transition ${toneClass}`}
      aria-label={label}
      title={label}
    >
      <Icon name={icon} className="h-4 w-4" />
    </Component>
  );
}

function ProjectMobileCard({ project }) {
  return (
    <Card variant="normal" className="p-4" interactive>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-slate-950">
            {project.projectName}
          </h3>
          <p className="mt-1 truncate text-sm text-slate-500">
            {project.companyName}
          </p>
        </div>
        <span className="shrink-0">
          <StatusBadge status={project.status} />
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm min-[380px]:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Type</p>
          <p className="mt-1 truncate text-slate-700">{project.projectType}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stage</p>
          <p className="mt-1 truncate text-slate-700">{project.assessmentStage}</p>
        </div>
        <div className="min-w-0 min-[380px]:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
          <p className="mt-1 truncate text-slate-700">{project.location}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
        <p className="truncate text-xs font-medium text-slate-500">
          Created {formatDate(project.createdDate)}
        </p>
        <div className="flex shrink-0 items-center justify-end gap-1">
          <ActionButton icon="view" label="View project" to={`/projects/${project.id}`} />
          <ActionButton icon="edit" label="Edit project" />
          <ActionButton icon="delete" label="Delete project" tone="danger" />
        </div>
      </div>
    </Card>
  );
}

function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          project.projectName,
          project.companyName,
          project.projectType,
          project.location,
          project.assessmentStage,
          project.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const approved = projects.filter((project) => project.status === "Approved").length;
    const pending = projects.filter((project) =>
      ["Submitted", "Under Review"].includes(project.status),
    ).length;
    const active = projects.filter((project) => project.status !== "Rejected").length;

    return [
      { label: "Total Projects", value: projects.length, icon: "projects", caption: "All projects" },
      { label: "Active Projects", value: active, icon: "active", caption: "In workflow" },
      { label: "Approved Projects", value: approved, icon: "approved", caption: "Certified-ready" },
      { label: "Pending Reviews", value: pending, icon: "pending", caption: "Needs attention" },
    ];
  }, []);

  return (
    <div className="space-y-6">
      <Card variant="gradient" className="overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Project Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Projects
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track IGBC project submissions, review stages, and certification readiness across the portfolio.
            </p>
          </div>
          <Button variant="ghost" className="w-full border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto">
            <Icon name="plus" className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <Card variant="glass" className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Search projects</span>
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search projects, companies, locations"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="statusFilter">
              Filter by status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 sm:w-auto"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
            <Button variant="primary" className="w-full sm:w-auto">
              <Icon name="plus" className="h-4 w-4" />
              Create Project
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card variant="normal" className="p-5">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card variant="normal" className="p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <Icon name="projects" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-950">
            No projects found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Adjust your search or status filter to find projects in the current portfolio.
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4 lg:hidden">
            {filteredProjects.map((project) => (
              <ProjectMobileCard key={project.id} project={project} />
            ))}
          </div>

          <Card variant="normal" padding="none" className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Project</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Stage</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="group bg-white transition hover:bg-emerald-50/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950">{project.projectName}</p>
                        <p className="mt-1 text-sm text-slate-500">{project.companyName}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {project.projectType}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {project.location}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {project.assessmentStage}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(project.createdDate)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton icon="view" label="View project" to={`/projects/${project.id}`} />
                          <ActionButton icon="edit" label="Edit project" />
                          <ActionButton icon="delete" label="Delete project" tone="danger" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default Projects;
