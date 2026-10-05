import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { AuthPage } from "./pages/AuthPage";
import { KnowledgePage } from "./pages/KnowledgePage";
import { AskPage } from "./pages/AskPage";
import { setAuthToken } from "./services/api";
import "./styles.css";

export default function App() {
  const [page, setPage] = useState("knowledge");
  const [session, setSession] = useState(null);

  function handleAuthenticated(nextSession) {
    setAuthToken(nextSession.token);
    setSession(nextSession);
  }

  function handleSignOut() {
    setAuthToken(null);
    setSession(null);
    setPage("knowledge");
  }

  if (!session) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={page}
        onNavigate={setPage}
        user={session.user}
        onSignOut={handleSignOut}
      />
      <main className="main-content">
        {page === "knowledge" ? (
          <KnowledgePage onAsk={() => setPage("ask")} />
        ) : (
          <AskPage />
        )}
      </main>
    </div>
  );
}
