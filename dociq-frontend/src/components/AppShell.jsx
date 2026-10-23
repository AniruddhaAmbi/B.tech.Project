import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function AppShell({
  user,
  children,
  activePage,
  onNavigate,
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <div className="app-shell">

      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="app-main">

        <Topbar
          user={user}
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="app-content">
          {children}
        </main>

      </div>

    </div>
  );
}