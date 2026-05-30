import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const stats = [
  {
    label: "Projects",
    value: "128",
    change: "+12.4%",
    tone: "emerald",
    icon: "projects",
  },
  {
    label: "Documents",
    value: "2,846",
    change: "+18.7%",
    tone: "teal",
    icon: "documents",
  },
  {
    label: "Assessments",
    value: "394",
    change: "+9.2%",
    tone: "green",
    icon: "assessments",
  },
  {
    label: "Certificates",
    value: "76",
    change: "+6.8%",
    tone: "cyan",
    icon: "certificates",
  },
];

const projectStatusData = [
  { name: "Draft", value: 34, color: "#94A3B8", dotClass: "bg-slate-400" },
  { name: "Under Review", value: 42, color: "#14B8A6", dotClass: "bg-teal-500" },
  { name: "Approved", value: 38, color: "#16A34A", dotClass: "bg-emerald-600" },
  { name: "Rejected", value: 14, color: "#EF4444", dotClass: "bg-red-500" },
];

const assessmentProgressData = [
  { stage: "Prelim", completed: 68, pending: 24 },
  { stage: "Energy", completed: 54, pending: 18 },
  { stage: "Water", completed: 47, pending: 23 },
  { stage: "Waste", completed: 39, pending: 19 },
  { stage: "Final", completed: 31, pending: 12 },
];

const monthlyActivityData = [
  { month: "Jan", projects: 18, documents: 92, certificates: 5 },
  { month: "Feb", projects: 24, documents: 116, certificates: 8 },
  { month: "Mar", projects: 21, documents: 132, certificates: 7 },
  { month: "Apr", projects: 30, documents: 168, certificates: 10 },
  { month: "May", projects: 36, documents: 204, certificates: 14 },
  { month: "Jun", projects: 42, documents: 238, certificates: 18 },
];

const recentActivity = [
  {
    title: "Document Uploaded",
    detail: "Energy Performance Report.pdf added to IGBC Tower",
    time: "12 min ago",
    icon: "documents",
  },
  {
    title: "Assessment Created",
    detail: "Preliminary review assigned to senior assessor",
    time: "48 min ago",
    icon: "assessments",
  },
  {
    title: "Report Generated",
    detail: "Gold readiness report generated for Green Axis Park",
    time: "2 hrs ago",
    icon: "reports",
  },
  {
    title: "Certificate Issued",
    detail: "Platinum certificate issued for Eco Habitat One",
    time: "Today",
    icon: "certificates",
  },
];

const quickActions = [
  {
    title: "Create Project",
    description: "Start a new IGBC certification workspace.",
    action: "Create",
    icon: "projects",
  },
  {
    title: "Upload Document",
    description: "Attach drawings, reports, and compliance files.",
    action: "Upload",
    icon: "documents",
  },
  {
    title: "Run AI Analysis",
    description: "Analyze evidence and detect submission gaps.",
    action: "Analyze",
    icon: "ai",
  },
  {
    title: "Generate Report",
    description: "Create preliminary or final certification reports.",
    action: "Generate",
    icon: "reports",
  },
];

const iconPaths = {
  projects:
    "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm3 1.25v2.5h10v-2.5H7Zm0 5v3.5h4v-3.5H7Zm6 0v3.5h4v-3.5h-4Z",
  documents:
    "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 1.5V9h4.5L13 4.5ZM8 13h8v1.5H8V13Zm0 3h8v1.5H8V16Z",
  assessments:
    "M5 4h14v16H5V4Zm3 4h8V6.5H8V8Zm0 4h8v-1.5H8V12Zm0 4h5v-1.5H8V16Zm8.5-.25 1.7-1.7-1.05-1.05-.65.65-.65-.65-1.05 1.05 1.7 1.7Z",
  certificates:
    "M12 2a6 6 0 0 1 3.3 11L16 22l-4-2-4 2 .7-9A6 6 0 0 1 12 2Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  reports:
    "M6 3h12v18H6V3Zm3 4h6V5.5H9V7Zm0 4h6V9.5H9V11Zm0 4h4v-1.5H9V15Zm0 3h6v-1.5H9V18Z",
  ai: "M12 3 9.6 8.4 4 10.8l5.6 2.4L12 19l2.4-5.8 5.6-2.4-5.6-2.4L12 3Zm-6 12-1 2.3L2.7 18.3 5 19.3 6 22l1-2.7 2.3-1L7 17.3 6 15Z",
};

const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
  green: "bg-green-50 text-green-700 ring-green-200",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

const currentDate = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
}).format(new Date());

function Icon({ name, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 fill-current ${className}`}>
      <path d={iconPaths[name]} />
    </svg>
  );
}

function StatCard({ item }) {
  return (
    <Card
      variant="normal"
      className="group overflow-hidden p-5 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${toneClasses[item.tone]}`}>
          <Icon name={item.icon} />
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
          {item.change}
        </span>
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">{item.label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500 group-hover:w-5/6" />
      </div>
    </Card>
  );
}

function ChartHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="min-h-[140px] overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 shadow-lg shadow-emerald-500/20 md:min-h-[160px] md:p-8 lg:min-h-[180px]">
        <div className="flex h-full min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50 sm:text-sm">
              {currentDate}
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              IGBC Green Building Intelligence Platform
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
              Manage projects, validate evidence, generate reports, and automate certification workflows.
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap gap-3 lg:justify-end">
            <Button variant="ghost" className="w-full border border-white/30 bg-white text-emerald-700 shadow-sm hover:bg-emerald-50 sm:w-auto">
              <Icon name="projects" />
              New Project
            </Button>
            <Button variant="ghost" className="w-full border border-white/30 bg-emerald-700/20 text-white shadow-sm hover:bg-emerald-700/30 sm:w-auto">
              <Icon name="ai" />
              Run Analysis
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-3">
        <Card variant="normal" className="p-4 sm:p-5 xl:col-span-1">
          <ChartHeader
            title="Project Status Overview"
            description="Portfolio distribution by certification state"
          />
          <div className="h-64 min-w-0 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={98}
                  paddingAngle={4}
                >
                  {projectStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
            {projectStatusData.map((item) => (
              <div key={item.name} className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="normal" className="p-4 sm:p-5 xl:col-span-2">
          <ChartHeader
            title="Assessment Progress"
            description="Completed and pending checkpoints by IGBC review stage"
          />
          <div className="h-72 min-w-0 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentProgressData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="#16A34A" radius={[10, 10, 0, 0]} />
                <Bar dataKey="pending" fill="#99F6E4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-3">
        <Card variant="normal" className="p-4 sm:p-5 xl:col-span-2">
          <ChartHeader
            title="Monthly Activity"
            description="Projects, documents, and certificates over time"
          />
          <div className="h-72 min-w-0 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="projects" stroke="#16A34A" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="documents" stroke="#14B8A6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="certificates" stroke="#0F766E" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="normal" className="p-4 sm:p-5">
          <ChartHeader
            title="Recent Activity"
            description="Latest workflow events"
          />
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.title} className="flex min-w-0 gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 transition hover:border-emerald-200 hover:bg-emerald-50/70">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <Icon name={item.icon} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 truncate text-sm text-slate-500">{item.detail}</p>
                  <p className="mt-2 text-xs font-medium text-emerald-700">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Quick Action Cards</h2>
            <p className="mt-1 text-sm text-slate-500">
              Common certification tasks for faster operations
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => (
            <Card key={item.title} variant="normal" interactive className="p-5">
              <div className="flex h-full flex-col">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20">
                  <Icon name={item.icon} />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{item.description}</p>
                <Button variant="ghost" className="mt-5 w-full justify-between border border-slate-200 bg-white">
                  {item.action}
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="m13.2 5.2 5.8 5.8-5.8 5.8-1.4-1.4 3.4-3.4H5v-2h10.2l-3.4-3.4 1.4-1.4Z" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
