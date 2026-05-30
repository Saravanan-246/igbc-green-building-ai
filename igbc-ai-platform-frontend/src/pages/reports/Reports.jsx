import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const reports = [
  {
    id: "RPT-2026-001",
    projectName: "IGBC Green Axis Tower",
    reportType: "Final",
    rating: "Platinum",
    generatedDate: "2026-05-24",
    generatedBy: "Aarav Mehta",
    score: 92,
    fileSize: "3.8 MB",
    status: "Ready",
  },
  {
    id: "RPT-2026-002",
    projectName: "Eco Habitat One",
    reportType: "Preliminary",
    rating: "Gold",
    generatedDate: "2026-05-22",
    generatedBy: "Nisha Rao",
    score: 76,
    fileSize: "2.6 MB",
    status: "Ready",
  },
  {
    id: "RPT-2026-003",
    projectName: "Sattva Net Zero Park",
    reportType: "Preliminary",
    rating: "Silver",
    generatedDate: "2026-05-20",
    generatedBy: "Kabir Sharma",
    score: 64,
    fileSize: "2.4 MB",
    status: "Ready",
  },
  {
    id: "RPT-2026-004",
    projectName: "Urban Leaf School",
    reportType: "Final",
    rating: "Certified",
    generatedDate: "2026-05-16",
    generatedBy: "Aarav Mehta",
    score: 48,
    fileSize: "3.1 MB",
    status: "Ready",
  },
  {
    id: "RPT-2026-005",
    projectName: "Blue River Logistics Hub",
    reportType: "Final",
    rating: "Not Eligible",
    generatedDate: "2026-05-12",
    generatedBy: "Meera Iyer",
    score: 38,
    fileSize: "2.9 MB",
    status: "Archived",
  },
];

const reportTypeOptions = ["All", "Preliminary", "Final"];

const ratingClasses = {
  Platinum:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Gold:
    "bg-amber-50 text-amber-700 ring-amber-200",
  Silver:
    "bg-slate-100 text-slate-700 ring-slate-200",
  Certified:
    "bg-teal-50 text-teal-700 ring-teal-200",
  "Not Eligible":
    "bg-red-50 text-red-700 ring-red-200",
};

const typeClasses = {
  Preliminary:
    "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Final:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const iconPaths = {
  report:
    "M8 3.5h5.5L18 8v12.5A1.5 1.5 0 0 1 16.5 22h-9A1.5 1.5 0 0 1 6 20.5V5a1.5 1.5 0 0 1 1.5-1.5H8Zm5 0V8h5M9 12h6M9 15h6M9 18h4",
  search:
    "m21 21-4.35-4.35M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z",
  filter:
    "M4 6h16M7 12h10M10 18h4",
  plus: "M12 5v14M5 12h14",
  download:
    "M12 3v11m0 0 4-4m-4 4-4-4M5 17v2.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V17",
  view:
    "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  calendar:
    "M7 3v3M17 3v3M4.5 9h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V6.5A1.5 1.5 0 0 1 6 5Z",
  chart:
    "M5 19V9m7 10V5m7 14v-7M3 21h18",
  empty:
    "M8 4h5.5L18 8.5V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5.5A1.5 1.5 0 0 1 7.5 4H8Zm5.5 0v4.5H18M9 13h6M9 16h4",
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

function Badge({ children, className }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", className)}>
      {children}
    </span>
  );
}

function StatCard({ label, value, helper, icon }) {
  return (
    <Card interactive className="group overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 truncate text-sm text-emerald-600">{helper}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-emerald-50 p-3 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} className="animate-pulse">
          <div className="h-4 w-28 rounded-full bg-slate-200" />
          <div className="mt-5 h-6 w-3/4 rounded-full bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 rounded-full bg-slate-200" />
          <div className="mt-6 h-10 rounded-xl bg-slate-200" />
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="flex min-h-72 flex-col items-center justify-center text-center">
      <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-600">
        <Icon name="empty" className="h-10 w-10" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">No reports found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Adjust the search or report type filter to find generated IGBC reports.
      </p>
    </Card>
  );
}

function ReportCard({ report }) {
  return (
    <Card interactive className="overflow-hidden">
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={typeClasses[report.reportType]}>{report.reportType}</Badge>
            <Badge className={ratingClasses[report.rating]}>{report.rating}</Badge>
          </div>
          <h3 className="mt-4 truncate text-lg font-bold text-slate-950">{report.projectName}</h3>
          <p className="mt-1 truncate text-sm text-slate-500">{report.id}</p>
        </div>

        <div className="shrink-0 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-3 text-left sm:text-right">
          <p className="text-2xl font-bold text-slate-950">{report.score}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Score</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-slate-600 min-[380px]:grid-cols-2 lg:grid-cols-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Generated</p>
          <p className="mt-1 truncate font-semibold text-slate-800">{report.generatedDate}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Owner</p>
          <p className="mt-1 truncate font-semibold text-slate-800">{report.generatedBy}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">File</p>
          <p className="mt-1 font-semibold text-slate-800">{report.fileSize}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
        <Button variant="ghost" className="w-full sm:w-auto">
          <Icon name="view" className="h-4 w-4" />
          View Report
        </Button>
        <Button variant="primary" className="w-full sm:w-auto">
          <Icon name="download" className="h-4 w-4" />
          Download
        </Button>
      </div>
    </Card>
  );
}

function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState("All");
  const [isLoading] = useState(false);

  const filteredReports = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesType = reportType === "All" || report.reportType === reportType;
      const matchesSearch =
        report.projectName.toLowerCase().includes(normalizedSearch) ||
        report.id.toLowerCase().includes(normalizedSearch) ||
        report.rating.toLowerCase().includes(normalizedSearch);

      return matchesType && matchesSearch;
    });
  }, [reportType, searchTerm]);

  const stats = useMemo(
    () => ({
      total: reports.length,
      preliminary: reports.filter((report) => report.reportType === "Preliminary").length,
      final: reports.filter((report) => report.reportType === "Final").length,
      ready: reports.filter((report) => report.status === "Ready").length,
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <Card variant="gradient" className="overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 ring-1 ring-emerald-100">
              <Icon name="report" className="h-4 w-4" />
              Reports
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Generated IGBC Reports</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review preliminary and final certification reports with ratings, scores, and generated file details.
            </p>
          </div>
          <Button variant="ghost" size="lg" className="w-full bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto">
            <Icon name="plus" />
            Generate Report
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Reports" value={stats.total} helper="+18% this month" icon="report" />
        <StatCard label="Preliminary" value={stats.preliminary} helper="Evidence-stage reports" icon="calendar" />
        <StatCard label="Final" value={stats.final} helper="Certification-ready reports" icon="chart" />
        <StatCard label="Ready Files" value={stats.ready} helper="Available to download" icon="download" />
      </div>

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Report List</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredReports.length} report{filteredReports.length === 1 ? "" : "s"} matching current filters
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Icon name="search" className="h-4 w-4" />
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-72"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search reports"
                type="search"
                value={searchTerm}
              />
            </label>

            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Icon name="filter" className="h-4 w-4" />
              </span>
              <select
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-44"
                onChange={(event) => setReportType(event.target.value)}
                value={reportType}
              >
                {reportTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : filteredReports.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Reports;
