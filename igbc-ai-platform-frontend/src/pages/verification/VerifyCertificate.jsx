import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const certificateRegistry = [
  {
    certificateNumber: "IGBC-PLT-2026-0001",
    projectName: "IGBC Green Axis Tower",
    rating: "Platinum",
    issueDate: "2026-05-25",
    expiryDate: "2029-05-24",
    status: "Active",
    holder: "Axis Sustainable Developers",
    location: "Bengaluru, Karnataka",
  },
  {
    certificateNumber: "IGBC-GLD-2026-0002",
    projectName: "Eco Habitat One",
    rating: "Gold",
    issueDate: "2026-05-21",
    expiryDate: "2029-05-20",
    status: "Active",
    holder: "Habitat Urban Infra",
    location: "Pune, Maharashtra",
  },
  {
    certificateNumber: "IGBC-SLV-2026-0003",
    projectName: "Sattva Net Zero Park",
    rating: "Silver",
    issueDate: "2026-05-18",
    expiryDate: "2029-05-17",
    status: "Active",
    holder: "Sattva Build Systems",
    location: "Hyderabad, Telangana",
  },
];

const ratingClasses = {
  Platinum:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Gold:
    "bg-amber-50 text-amber-700 ring-amber-200",
  Silver:
    "bg-slate-100 text-slate-700 ring-slate-200",
};

const statusClasses = {
  Active:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Expired:
    "bg-amber-50 text-amber-700 ring-amber-200",
  Revoked:
    "bg-red-50 text-red-700 ring-red-200",
};

const iconPaths = {
  shield:
    "M12 3.5 19 6v5.5c0 4.1-2.8 7.9-7 9-4.2-1.1-7-4.9-7-9V6l7-2.5Z",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  search:
    "m21 21-4.35-4.35M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z",
  certificate:
    "M8 4h8a2 2 0 0 1 2 2v6.5a6 6 0 0 1-12 0V6a2 2 0 0 1 2-2Zm1 4h6M9 11h6M10 20.5l2-1.2 2 1.2",
  calendar:
    "M7 3v3M17 3v3M4.5 9h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V6.5A1.5 1.5 0 0 1 6 5Z",
  location:
    "M12 21s7-4.8 7-11a7 7 0 1 0-14 0c0 6.2 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
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

function DetailItem({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <Icon name={icon} className="h-4 w-4" />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-3 break-words text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function VerifiedState({ certificate }) {
  return (
    <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-white to-emerald-50/80">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-200">
            <Icon name="check" className="h-4 w-4" />
            Verified
          </div>
          <h2 className="mt-5 break-words text-2xl font-bold tracking-tight text-slate-950">{certificate.projectName}</h2>
          <p className="mt-2 break-all text-sm font-semibold text-emerald-700">
            {certificate.certificateNumber}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{certificate.holder}</p>
        </div>

        <div className="shrink-0 rounded-3xl border border-emerald-100 bg-white p-5 text-emerald-700 shadow-sm">
          <Icon name="shield" className="h-10 w-10" />
          <p className="mt-4 text-3xl font-bold">{certificate.rating}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">IGBC Rating</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge className={ratingClasses[certificate.rating]}>{certificate.rating}</Badge>
        <Badge className={statusClasses[certificate.status]}>{certificate.status}</Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem icon="certificate" label="Project Name" value={certificate.projectName} />
        <DetailItem icon="calendar" label="Issue Date" value={certificate.issueDate} />
        <DetailItem icon="calendar" label="Expiry Date" value={certificate.expiryDate} />
        <DetailItem icon="location" label="Location" value={certificate.location} />
      </div>
    </Card>
  );
}

function InvalidState({ query }) {
  return (
    <Card className="border-red-200 bg-gradient-to-br from-white to-red-50/80 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600 ring-1 ring-red-200">
        <Icon name="x" className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Certificate Not Valid</h2>
      <p className="mx-auto mt-3 max-w-xl break-words text-sm leading-6 text-slate-600">
        No active IGBC certificate was found for {query}. Check the certificate number and try again.
      </p>
    </Card>
  );
}

function InitialState() {
  return (
    <Card className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        <Icon name="shield" className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Certificate Verification</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Enter an IGBC certificate number to validate rating, project, issue date, expiry date, and registry status.
      </p>
    </Card>
  );
}

function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [result, setResult] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const examples = useMemo(() => certificateRegistry.map((certificate) => certificate.certificateNumber), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedNumber = certificateNumber.trim().toUpperCase();
    const certificate = certificateRegistry.find((item) => item.certificateNumber === normalizedNumber);

    setLastQuery(normalizedNumber || "the submitted certificate number");
    setResult(certificate || false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card variant="gradient" className="overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 ring-1 ring-emerald-100">
              <Icon name="shield" className="h-4 w-4" />
              Verify Certificate
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Validate IGBC Credentials</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Confirm certificate authenticity, project details, rating level, validity period, and current registry status.
            </p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <form className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end" onSubmit={handleSubmit}>
          <label className="block min-w-0 flex-1">
            <span className="text-sm font-semibold text-slate-700">Certificate Number</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Icon name="search" className="h-4 w-4" />
              </span>
              <input
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold uppercase tracking-wide text-slate-900 outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                onChange={(event) => setCertificateNumber(event.target.value)}
                placeholder="IGBC-PLT-2026-0001"
                value={certificateNumber}
              />
            </div>
          </label>

          <Button className="h-12 w-full lg:w-auto" size="lg" type="submit">
            <Icon name="check" />
            Verify
          </Button>
        </form>

        <div className="mt-5 flex min-w-0 flex-wrap gap-2">
          {examples.map((example) => (
            <button
              className="max-w-full truncate rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
              key={example}
              onClick={() => setCertificateNumber(example)}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>
      </Card>

      {result === null ? <InitialState /> : result ? <VerifiedState certificate={result} /> : <InvalidState query={lastQuery} />}
    </div>
  );
}

export default VerifyCertificate;
