import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const certificates = [
  {
    id: "CERT-001",
    certificateNumber: "IGBC-PLT-2026-0001",
    projectName: "IGBC Green Axis Tower",
    rating: "Platinum",
    issueDate: "2026-05-25",
    expiryDate: "2029-05-24",
    status: "Active",
    score: 92,
    holder: "Axis Sustainable Developers",
  },
  {
    id: "CERT-002",
    certificateNumber: "IGBC-GLD-2026-0002",
    projectName: "Eco Habitat One",
    rating: "Gold",
    issueDate: "2026-05-21",
    expiryDate: "2029-05-20",
    status: "Active",
    score: 76,
    holder: "Habitat Urban Infra",
  },
  {
    id: "CERT-003",
    certificateNumber: "IGBC-SLV-2026-0003",
    projectName: "Sattva Net Zero Park",
    rating: "Silver",
    issueDate: "2026-05-18",
    expiryDate: "2029-05-17",
    status: "Active",
    score: 64,
    holder: "Sattva Build Systems",
  },
  {
    id: "CERT-004",
    certificateNumber: "IGBC-CER-2024-0148",
    projectName: "Urban Leaf School",
    rating: "Certified",
    issueDate: "2024-02-14",
    expiryDate: "2027-02-13",
    status: "Expired",
    score: 48,
    holder: "Urban Leaf Foundation",
  },
  {
    id: "CERT-005",
    certificateNumber: "IGBC-GLD-2025-0094",
    projectName: "Blue River Logistics Hub",
    rating: "Gold",
    issueDate: "2025-08-05",
    expiryDate: "2028-08-04",
    status: "Revoked",
    score: 78,
    holder: "Blue River Warehousing",
  },
];

const statusOptions = ["All", "Active", "Expired", "Revoked"];

const statusClasses = {
  Active:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Expired:
    "bg-amber-50 text-amber-700 ring-amber-200",
  Revoked:
    "bg-red-50 text-red-700 ring-red-200",
};

const ratingClasses = {
  Platinum:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Gold:
    "bg-amber-50 text-amber-700 ring-amber-200",
  Silver:
    "bg-slate-100 text-slate-700 ring-slate-200",
  Certified:
    "bg-teal-50 text-teal-700 ring-teal-200",
};

const iconPaths = {
  certificate:
    "M8 4h8a2 2 0 0 1 2 2v6.5a6 6 0 0 1-12 0V6a2 2 0 0 1 2-2Zm1 4h6M9 11h6M10 20.5l2-1.2 2 1.2",
  plus: "M12 5v14M5 12h14",
  download:
    "M12 3v11m0 0 4-4m-4 4-4-4M5 17v2.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V17",
  view:
    "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  search:
    "m21 21-4.35-4.35M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z",
  filter:
    "M4 6h16M7 12h10M10 18h4",
  calendar:
    "M7 3v3M17 3v3M4.5 9h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V6.5A1.5 1.5 0 0 1 6 5Z",
  shield:
    "M12 3.5 19 6v5.5c0 4.1-2.8 7.9-7 9-4.2-1.1-7-4.9-7-9V6l7-2.5Z",
  qr: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm11 1h2v2h-2v-2Zm4 0h1v5h-5v-1h3v-2h1v-2Zm-5 4h2v1h-2v-1Z",
  empty:
    "M8 4h8a2 2 0 0 1 2 2v6.5a6 6 0 0 1-12 0V6a2 2 0 0 1 2-2Zm1 4h6M9 11h6M10 20.5l2-1.2 2 1.2",
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

function QRPreview({ certificateNumber }) {
  const blocks = useMemo(
    () =>
      Array.from({ length: 49 }, (_, index) => {
        const code = certificateNumber.charCodeAt(index % certificateNumber.length);
        const isMarker =
          [0, 1, 2, 7, 14, 15, 16, 33, 40, 41, 42].includes(index) ||
          (index > 2 && index < 7 && index % 2 === 0);

        return isMarker || (code + index * 3) % 5 < 2;
      }),
    [certificateNumber],
  );

  return (
    <div className="shrink-0 rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm">
      <div className="grid h-20 w-20 grid-cols-7 gap-1 min-[380px]:h-24 min-[380px]:w-24">
        {blocks.map((active, index) => (
          <span
            className={cn("rounded-[3px]", active ? "bg-slate-700" : "bg-emerald-50")}
            key={`${certificateNumber}-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, helper, icon }) {
  return (
    <Card interactive>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 truncate text-sm text-emerald-600">{helper}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-emerald-50 p-3 text-emerald-600">
          <Icon name={icon} />
        </div>
      </div>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} className="animate-pulse">
          <div className="flex flex-col gap-5 min-[380px]:flex-row">
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-slate-200 min-[380px]:h-24 min-[380px]:w-24" />
            <div className="flex-1">
              <div className="h-4 w-32 rounded-full bg-slate-200" />
              <div className="mt-5 h-6 w-3/4 rounded-full bg-slate-200" />
              <div className="mt-4 h-4 w-1/2 rounded-full bg-slate-200" />
            </div>
          </div>
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
      <h3 className="mt-5 text-lg font-bold text-slate-950">No certificates found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Adjust the search or status filter to find issued IGBC certificates.
      </p>
    </Card>
  );
}

function CertificateCard({ certificate }) {
  return (
    <Card interactive className="overflow-hidden">
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row">
        <div className="flex shrink-0 items-start justify-between gap-4 sm:block">
          <QRPreview certificateNumber={certificate.certificateNumber} />
          <div className="sm:hidden">
            <Badge className={statusClasses[certificate.status]}>{certificate.status}</Badge>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={ratingClasses[certificate.rating]}>{certificate.rating}</Badge>
            <Badge className={cn(statusClasses[certificate.status], "hidden sm:inline-flex")}>{certificate.status}</Badge>
          </div>

          <h3 className="mt-4 truncate text-lg font-bold text-slate-950">{certificate.projectName}</h3>
          <p className="mt-1 break-all text-sm font-semibold text-emerald-700">
            {certificate.certificateNumber}
          </p>
          <p className="mt-2 truncate text-sm text-slate-500">{certificate.holder}</p>

          <div className="mt-6 grid gap-3 text-sm min-[380px]:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Issue Date</p>
              <p className="mt-1 font-semibold text-slate-800">{certificate.issueDate}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Expiry Date</p>
              <p className="mt-1 font-semibold text-slate-800">{certificate.expiryDate}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Score</p>
              <p className="mt-1 font-semibold text-slate-800">{certificate.score}/100</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
        <Button variant="ghost" className="w-full sm:w-auto">
          <Icon name="view" className="h-4 w-4" />
          View Certificate
        </Button>
        <Button variant="primary" className="w-full sm:w-auto">
          <Icon name="download" className="h-4 w-4" />
          Download
        </Button>
      </div>
    </Card>
  );
}

function Certificates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("All");
  const [isLoading] = useState(false);

  const filteredCertificates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return certificates.filter((certificate) => {
      const matchesStatus = status === "All" || certificate.status === status;
      const matchesSearch =
        certificate.certificateNumber.toLowerCase().includes(normalizedSearch) ||
        certificate.projectName.toLowerCase().includes(normalizedSearch) ||
        certificate.rating.toLowerCase().includes(normalizedSearch) ||
        certificate.holder.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, status]);

  const stats = useMemo(
    () => ({
      total: certificates.length,
      active: certificates.filter((certificate) => certificate.status === "Active").length,
      expired: certificates.filter((certificate) => certificate.status === "Expired").length,
      revoked: certificates.filter((certificate) => certificate.status === "Revoked").length,
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <Card variant="gradient" className="overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 ring-1 ring-emerald-100">
              <Icon name="certificate" className="h-4 w-4" />
              Certificates
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">IGBC Certification Registry</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage issued certificates, QR verification previews, ratings, and certificate lifecycle status.
            </p>
          </div>
          <Button variant="ghost" size="lg" className="w-full bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto">
            <Icon name="plus" />
            Generate Certificate
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Certificates" value={stats.total} helper="+12% this quarter" icon="certificate" />
        <StatCard label="Active" value={stats.active} helper="Valid for verification" icon="shield" />
        <StatCard label="Expired" value={stats.expired} helper="Renewal review needed" icon="calendar" />
        <StatCard label="Revoked" value={stats.revoked} helper="Removed from active registry" icon="qr" />
      </div>

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Certificate List</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredCertificates.length} certificate{filteredCertificates.length === 1 ? "" : "s"} matching current filters
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Icon name="search" className="h-4 w-4" />
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-80"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search certificates"
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
                onChange={(event) => setStatus(event.target.value)}
                value={status}
              >
                {statusOptions.map((option) => (
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
        ) : filteredCertificates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Certificates;
