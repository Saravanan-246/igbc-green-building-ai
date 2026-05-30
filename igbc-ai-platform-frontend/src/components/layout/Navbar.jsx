import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const iconPaths = {
  menu: "M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z",
  search:
    "m20.3 18.9-4.2-4.2a7 7 0 1 0-1.4 1.4l4.2 4.2 1.4-1.4ZM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z",
  bell:
    "M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22ZM5 18h14l-1.8-2.4V11a5.2 5.2 0 0 0-4.2-5.1V4a1 1 0 1 0-2 0v1.9A5.2 5.2 0 0 0 6.8 11v4.6L5 18Z",
  chevron: "m7 10 5 5 5-5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z",
  settings:
    "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.5 3.5-1.7-.8a7.8 7.8 0 0 0-.6-1.4l.6-1.8-2.3-2.3-1.8.6a7.8 7.8 0 0 0-1.4-.6L12.5 3h-3l-.8 1.7a7.8 7.8 0 0 0-1.4.6l-1.8-.6-2.3 2.3.6 1.8a7.8 7.8 0 0 0-.6 1.4L1.5 11v3l1.7.8c.2.5.4 1 .6 1.4l-.6 1.8 2.3 2.3 1.8-.6c.4.2.9.4 1.4.6l.8 1.7h3l.8-1.7c.5-.2 1-.4 1.4-.6l1.8.6 2.3-2.3-.6-1.8c.2-.4.4-.9.6-1.4l1.7-.8v-3Z",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Icon({ name, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("h-5 w-5 fill-current", className)}>
      <path d={iconPaths[name]} />
    </svg>
  );
}

function getInitials(name = "IGBC User") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Navbar({ onMenuClick }) {
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayUser = user || {
    name: "Company User",
    email: "company@igbc.ai",
    role: "Company User",
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-11 w-11 place-items-center rounded-2xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
          aria-label="Open navigation"
        >
          <Icon name="menu" />
        </button>

        <div className="hidden min-w-0 flex-1 md:block">
          <label className="relative block max-w-xl">
            <span className="sr-only">Search</span>
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search projects, documents, certificates"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            aria-label="Notifications"
          >
            <span className="relative">
              <Icon name="bell" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          </button>

          <div className="relative">
            <button
              type="button"
              className="flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 pr-3 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              {/* Clean User Initials Badge - No Indicator Dot */}
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-green-500 via-emerald-400 to-teal-400 text-xs font-bold text-white">
                {getInitials(displayUser.name)}
              </span>
              
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[9rem] truncate text-sm font-semibold leading-4 text-slate-900">
                  {displayUser.name}
                </span>
                <span className="block text-xs text-slate-500">{displayUser.role}</span>
              </span>
              <Icon name="chevron" className={cn("h-4 w-4 text-slate-400 transition", menuOpen && "rotate-180")} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-lg"
                role="menu"
              >
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="truncate text-sm font-bold text-slate-900">{displayUser.name}</p>
                  <p className="truncate text-xs text-slate-500">{displayUser.email}</p>
                </div>
                <button
                  className="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                  type="button"
                  role="menuitem"
                >
                  <Icon name="user" className="h-4 w-4" />
                  Profile
                </button>
                <button
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                  type="button"
                  role="menuitem"
                >
                  <Icon name="settings" className="h-4 w-4" />
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;