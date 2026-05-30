import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Unified class variance utility configuration
const cn = (...classes) => classes.filter(Boolean).join(" ");

function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      {/* Structural Sidebar Layer */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Primary Dynamic Main Content Viewport */}
      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-col overflow-x-hidden transition-all duration-300 ease-out",
          sidebarCollapsed ? "lg:pl-[5.25rem]" : "lg:pl-72"
        )}
      >
        {/* Navigation Layer */}
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Content Node Container Grid 
          - pt-20 on mobile ensures content starts safely *below* the mobile navbar top heights
          - pt-24 on desktop keeps the clean spacing layout looking professional
        */}
        <main className="w-full min-w-0 flex-1 overflow-x-hidden px-3 pb-8 pt-20 sm:px-6 lg:px-8 lg:pb-12 lg:pt-24">
          <div className="mx-auto w-full min-w-0 max-w-[1600px] overflow-x-hidden animate-fade-in">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
