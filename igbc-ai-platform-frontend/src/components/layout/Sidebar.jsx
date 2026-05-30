import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Projects", path: "/projects", icon: "projects" },
  { label: "Documents", path: "/documents", icon: "documents" },
  { label: "Assessments", path: "/assessments", icon: "assessments" },
  { label: "AI Analysis", path: "/ai-analysis", icon: "ai" },
  { label: "Reports", path: "/reports", icon: "reports" },
  { label: "Certificates", path: "/certificates", icon: "certificates" },
  { label: "Verify Certificate", path: "/verify-certificate", icon: "verify" },
];

const iconPaths = {
  dashboard: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-11h6V4h-6v5Z",
  projects:
    "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm3 1.25v2.5h10v-2.5H7Zm0 5v3.5h4v-3.5H7Zm6 0v3.5h4v-3.5h-4Z",
  documents:
    "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 1.5V9h4.5L13 4.5ZM8 13h8v1.5H8V13Zm0 3h8v1.5H8V16Z",
  assessments:
    "M5 4h14v16H5V4Zm3 4h8V6.5H8V8Zm0 4h8v-1.5H8V12Zm0 4h5v-1.5H8V16Zm8.5-.25 1.7-1.7-1.05-1.05-.65.65-.65-.65-1.05 1.05 1.7 1.7Z",
  ai: "M12 3 9.6 8.4 4 10.8l5.6 2.4L12 19l2.4-5.8 5.6-2.4-5.6-2.4L12 3Zm-6 12-1 2.3L2.7 18.3 5 19.3 6 22l1-2.7 2.3-1L7 17.3 6 15Z",
  reports:
    "M6 3h12v18H6V3Zm3 4h6V5.5H9V7Zm0 4h6V9.5H9V11Zm0 4h4v-1.5H9V15Zm0 3h6v-1.5H9V18Z",
  certificates:
    "M12 2a6 6 0 0 1 3.3 11L16 22l-4-2-4 2 .7-9A6 6 0 0 1 12 2Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  verify:
    "M12 2 4 5.5v6.2C4 16.8 7.4 21 12 22c4.6-1 8-5.2 8-10.3V5.5L12 2Zm3.8 7.2-4.6 4.6-2-2-1.4 1.4 3.4 3.4 6-6-1.4-1.4Z",
  logout:
    "M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10m4-4 3-3-3-3m3 3H9",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

function NavIcon({ name, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0 fill-current", className)}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function Sidebar({
  collapsed = false,
  mobileOpen = false,
  onClose,
  onToggleCollapse,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const displayUser = user || { name: "Company User", role: "Company User" };
  const isCollapsed = collapsed && !mobileOpen;

  const handleLogout = () => {
    logout();
    setConfirmLogoutOpen(false);
    onClose?.();
    navigate("/login", { replace: true });
  };

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-full max-w-full flex-col overflow-hidden border-r border-slate-200/80 bg-white transition-all duration-300",
        "shadow-xs",
        isCollapsed ? "w-[5.25rem]" : mobileOpen ? "w-[85vw] max-w-[320px]" : "w-72"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center gap-3 px-5 shrink-0">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-xs shadow-emerald-500/20">
          IG
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1 animate-fade-in">
            <p className="text-sm font-semibold tracking-tight text-slate-900">IGBC Intelligence</p>
            <p className="truncate text-xs text-slate-400 font-medium">
              Green Building Platform
            </p>
          </div>
        )}
        {!isCollapsed && mobileOpen && (
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-2xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="m7.4 5.9 4.6 4.6 4.6-4.6 1.5 1.5-4.6 4.6 4.6 4.6-1.5 1.5-4.6-4.6-4.6 4.6-1.5-1.5 4.6-4.6-4.6-4.6 1.5-1.5Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                "group flex min-h-11 items-center rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-200 ease-out",
                isCollapsed ? "justify-center" : "gap-3",
                isActive
                  ? "bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-200/60"
                  : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <NavIcon 
                  name={item.icon} 
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-600"
                  )} 
                />
                {!isCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Interactive Actions Wrapper */}
      <div className="mt-auto border-t border-slate-100 p-3 space-y-2 shrink-0 bg-white">
        {/* User Card Segment */}
        {!isCollapsed ? (
          <div className="rounded-2xl bg-slate-50/60 p-3.5 border border-slate-100/40">
            <p className="truncate text-sm font-semibold text-slate-800 leading-none">{displayUser.name}</p>
            <p className="mt-2 text-[11px] font-medium tracking-wider text-slate-400 uppercase leading-none">{displayUser.role}</p>
          </div>
        ) : null}

        {/* Action Controls Array */}
        <div className="flex flex-col gap-0.5">
          {/* Logout Trigger Control */}
          <button
            type="button"
            onClick={() => setConfirmLogoutOpen(true)}
            title={isCollapsed ? "Logout" : undefined}
            className={cn(
              "flex min-h-11 w-full items-center rounded-2xl text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50/60 hover:text-red-600",
              isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
            )}
          >
            <NavIcon name="logout" className="h-5 w-5 text-red-400 group-hover:text-red-500" />
            {!isCollapsed && <span>Logout</span>}
          </button>

          {/* Core Collapse Controller Trigger */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden min-h-11 w-full items-center rounded-2xl text-slate-400 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 lg:flex",
              isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={cn("h-5 w-5 fill-current transition duration-300", collapsed && "rotate-180")}
            >
              <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12l4.6-4.6Z" />
            </svg>
            {!isCollapsed && <span className="font-medium text-slate-500">Collapse View</span>}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Structural Screen Anchor Layout Element */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
        {sidebarContent}
      </div>

      {/* Adaptive Mobile Drawer Layout Component Overlay Layer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={onClose}
            aria-label="Close navigation"
          />
          <div className="relative h-full w-[85vw] max-w-[320px] overflow-hidden">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Premium Confirm Logout Backdrop Modal Screen Container */}
      {confirmLogoutOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/40 px-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl animate-scale-up">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-500">
              <NavIcon name="logout" className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">Log out of your account?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400 font-medium">
              Your secure session will end and you will be returned to the registration log-in screen portal safely.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                onClick={() => setConfirmLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-11 rounded-2xl bg-red-600 px-4 text-sm font-semibold text-white shadow-xs shadow-red-600/10 transition hover:bg-red-700 active:scale-[0.98]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;