import { useState } from "react";

import { AuthPage } from "./pages/AuthPage";
import AppShell from "./components/AppShell";

import DashboardPage from "./pages/DashboardPage";
import AIAnalystPage from "./pages/AIAnalystPage";
import { KnowledgePage } from "./pages/KnowledgePage";

export default function App() {
  const [session, setSession] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const savedSession = localStorage.getItem("dociq_session");

    if (!savedSession) {
      return null;
    }

    try {
      const parsedSession = JSON.parse(savedSession);
      return parsedSession?.authenticated ? parsedSession : null;
    } catch {
      localStorage.removeItem("dociq_session");
      return null;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");

  function handleAuthenticated(newSession) {
    setSession(newSession);
  }

  if (!session) {
    return (
      <AuthPage
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <DashboardPage user={session} />;

      case "Data Sources":
        return <KnowledgePage />;

      case "AI Analyst":
        return <AIAnalystPage />;

      case "Analysis":
        return <div>Analysis page coming next.</div>;

      case "Reports":
        return <div>Reports page coming next.</div>;

      case "Settings":
        return <div>Settings page coming next.</div>;

      default:
        return <DashboardPage user={session} />;
    }
  }

  return (
    <AppShell
      user={session}
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </AppShell>
  );
}