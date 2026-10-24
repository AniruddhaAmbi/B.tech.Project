import { useState } from "react";
import { Icon } from "../components/Icon";
import { askAIAnalyst, askSQLAnalyst } from "../services/api";

const docSuggestedQuestions = [
  "Why did revenue change this month?",
  "Which products are performing best?",
  "Who are my highest-value customers?",
  "What should I focus on this month?",
];

const sqlSuggestedQuestions = [
  "Show me all sales records from the database",
  "What is the total revenue grouped by product?",
  "List orders with quantities greater than 5",
  "Show top customers by total purchase amount",
];

// Helper function outside the component to keep render pure
function generateUniqueId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default function AIAnalystPage() {
  const [mode, setMode] = useState("rag"); // "rag" or "sql"
  const [question, setQuestion] = useState("");
  
  // Active/Current displayed answer
  const [currentResult, setCurrentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // History list to store past conversations
  const [conversations, setConversations] = useState([]);

  const suggestedQuestions = mode === "rag" ? docSuggestedQuestions : sqlSuggestedQuestions;

  async function handleQuery(queryText) {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    setQuestion("");
    setLoading(true);
    setError("");

    try {
      let resultPayload;
      if (mode === "rag") {
        const data = await askAIAnalyst(trimmed);
        resultPayload = {
          id: generateUniqueId(),
          mode: "rag",
          question: trimmed,
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        const data = await askSQLAnalyst(trimmed);
        resultPayload = {
          id: generateUniqueId(),
          mode: "sql",
          question: trimmed,
          text: data.query_analysis?.answer || "Query executed successfully.",
          sql: data.query_analysis?.sql_query || data.query_analysis?.sql_generated,
          results: data.query_analysis?.results || data.query_analysis?.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setCurrentResult(resultPayload);
      // Prepend to history so recent conversations show up instantly
      setConversations((prev) => [resultPayload, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Unable to generate insight from the server. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleQuery(question);
  }

  function handleSuggestion(text) {
    handleQuery(text);
  }

  function selectHistoryItem(item) {
    setCurrentResult(item);
    setMode(item.mode); // Automatically switch mode if viewing past item
  }

  return (
    <div className="ai-analyst-page">
      <header className="page-header">
        <div className="breadcrumb">
          <span>Workspace</span>
          <Icon name="chevron" size={14} />
          <span className="breadcrumb-current">AI Analyst</span>
        </div>

        <div className="heading-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="eyebrow">AI INSIGHTS</p>
            <h1>AI Analyst</h1>
            <p className="page-description">
              Ask questions about your business documents or structured SQL databases.
            </p>
          </div>

          {/* Mode Switcher Toggle */}
          <div style={{ display: "flex", background: "#e2e8f0", padding: "4px", borderRadius: "8px", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setMode("rag")}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: mode === "rag" ? "#1b4332" : "transparent",
                color: mode === "rag" ? "#fff" : "#333",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              📄 Document RAG
            </button>
            <button
              type="button"
              onClick={() => setMode("sql")}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: mode === "sql" ? "#1b4332" : "transparent",
                color: mode === "sql" ? "#fff" : "#333",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              🗄️ SQL Database
            </button>
          </div>
        </div>
      </header>

      <div className="page-body">
        <section className="panel ai-question-panel">
          <div className="section-heading">
            <div>
              <h2>{mode === "rag" ? "Ask DOCIQ (Documents)" : "Text-to-SQL Query Engine"}</h2>
              <p>{mode === "rag" ? "Search across uploaded PDFs, Word, and Excel summaries." : "Query test.db using natural language."}</p>
            </div>
            <span className="section-icon">
              <Icon name="sparkles" size={20} />
            </span>
          </div>

          <form className="ai-question-form" onSubmit={handleSubmit}>
            <Icon name="sparkles" size={19} />
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={mode === "rag" ? "Ask anything about your business documents..." : "e.g., Show total sales by product..."}
              aria-label="Ask DOCIQ a question"
            />
            <button type="submit" className="button button-dark" disabled={!question.trim() || loading}>
              {loading ? "Analyzing..." : "Ask AI"}
            </button>
          </form>
        </section>

        <section className="panel suggested-panel" aria-labelledby="suggested-title">
          <div className="section-heading">
            <div>
              <h2 id="suggested-title">Suggested questions ({mode === "rag" ? "Documents" : "SQL Database"})</h2>
              <p>Start with one of these sample queries.</p>
            </div>
          </div>

          <div className="suggested-question-grid">
            {suggestedQuestions.map((item) => (
              <button
                key={item}
                className="suggested-question"
                onClick={() => handleSuggestion(item)}
                disabled={loading}
              >
                <span>{item}</span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
        </section>

        {/* ACTIVE ANSWER PANEL */}
        {currentResult && (
          <section className="panel answer-panel" aria-live="polite">
            <div className="section-heading">
              <div>
                <h2>Your question [{currentResult.mode === "rag" ? "RAG Mode" : "Text-to-SQL Mode"}]</h2>
                <p>{currentResult.question}</p>
              </div>
              <span className="section-icon">
                <Icon name="sparkles" size={20} />
              </span>
            </div>

            <div className="demo-answer">
              <strong>Analysis Result:</strong>
              <p style={{ whiteSpace: "pre-line", marginTop: "10px" }}>{currentResult.text}</p>

              {currentResult.mode === "sql" && (
                <div style={{ marginTop: "20px" }}>
                  {currentResult.sql && (
                    <div style={{ background: "#1e293b", color: "#e2e8f0", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}>🛠️ Generated SQL Query:</span>
                      <pre style={{ fontSize: "12px", overflowX: "auto", margin: "6px 0 0 0", color: "#a5f3fc" }}>{currentResult.sql}</pre>
                    </div>
                  )}

                  {currentResult.results && currentResult.results.length > 0 && (
                    <div style={{ overflowX: "auto", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #cbd5e1" }}>
                            {Object.keys(currentResult.results[0]).map((col) => (
                              <th key={col} style={{ padding: "10px", fontWeight: "600", color: "#334155" }}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentResult.results.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              {Object.values(row).map((val, vIdx) => (
                                <td key={vIdx} style={{ padding: "10px", color: "#475569" }}>{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {loading && (
          <div className="panel state-panel" style={{ textAlign: "center", padding: "20px" }}>
            <span className="loading-indicator" />
            <p style={{ marginTop: "10px" }}>DOCIQ AI Analyst is processing your query...</p>
          </div>
        )}

        {error && (
          <div className="notice notice-error" role="alert" style={{ margin: "20px 0" }}>
            <span>{error}</span>
          </div>
        )}

        {/* RECENT CONVERSATIONS SECTION */}
        <section className="panel recent-panel" style={{ marginTop: "30px" }}>
          <div className="section-heading">
            <div>
              <h2>Recent conversations</h2>
              <p>Your recent questions and insights will appear here for quick review.</p>
            </div>
          </div>

          {conversations.length === 0 ? (
            <div className="empty-state compact-empty-state">
              <span className="empty-icon">
                <Icon name="sparkles" size={22} />
              </span>
              <h3>No conversations yet</h3>
              <p>Ask your first question to start exploring your business data.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
              {conversations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => selectHistoryItem(item)}
                  style={{
                    padding: "14px 18px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1b4332"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "16px" }}>{item.mode === "rag" ? "📄" : "🗄️"}</span>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#1e293b", display: "block" }}>{item.question}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {item.mode === "rag" ? "Document RAG Analysis" : "Text-to-SQL Query Result"}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}