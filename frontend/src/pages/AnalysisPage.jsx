import { useState } from "react";
import { Icon } from "../components/Icon";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";

export default function AnalysisPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeWorkspace = "GreenLeaf Retail";

  const handleRunAnalysis = async (typeId) => {
    setSelectedType(typeId);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/analysis/generate?workspace_id=${encodeURIComponent(activeWorkspace)}&analysis_type=${typeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to generate analysis from server.");
      }
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format data for Recharts (combines labels and dataset arrays into objects)
  const formatChartData = (result) => {
    if (!result || !result.labels || !result.datasets) return [];
    return result.labels.map((label, index) => {
      const obj = { name: label };
      result.datasets.forEach((ds) => {
        obj[ds.label] = ds.data[index];
      });
      return obj;
    });
  };

  const chartData = formatChartData(analysisResult);

  return (
    <div className="analysis-page">
      <header className="page-header" style={{ marginBottom: "16px" }}>
        <div className="breadcrumb">
          <span>Workspace</span>
          <Icon name="chevron" size={14} />
          <span className="breadcrumb-current">Analysis</span>
        </div>

        <div className="heading-row">
          <div>
            <p className="eyebrow">BUSINESS ANALYSIS</p>
            <h1>Analysis</h1>
            <p className="page-description">
              Explore your business data and discover useful insights.
            </p>
          </div>

          <button type="button" className="button button-primary" disabled>
            <Icon name="plus" size={16} />
            New analysis
          </button>
        </div>
      </header>

      <div className="page-body" style={{ gap: "16px" }}>

        {/* Compact Dataset Selection Strip */}
        <section 
          className="panel" 
          style={{ 
            padding: "12px 20px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            gap: "16px" 
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="analysis-empty-icon" style={{ width: "36px", height: "36px", margin: 0 }}>
              <Icon name="database" size={18} />
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669", textTransform: "uppercase" }}>
                Active Dataset
              </span>
              <h3 style={{ fontSize: "14px", fontWeight: "600", margin: 0, color: "#111827" }}>
                {activeWorkspace} — Connected Data Source
              </h3>
            </div>
          </div>

          <span 
            style={{ 
              background: "#d1fae5", 
              color: "#065f46", 
              padding: "4px 12px", 
              borderRadius: "20px", 
              fontSize: "12px", 
              fontWeight: "600" 
            }}
          >
            Connected
          </span>
        </section>

        {/* Analysis Types - Compact Single Row */}
        <section className="analysis-types-section" style={{ marginTop: "8px" }}>
          <div className="analysis-section-header" style={{ marginBottom: "12px" }}>
            <div>
              <p className="eyebrow">ANALYSIS TYPES</p>
              <h2>What would you like to analyze?</h2>
            </div>
          </div>

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(4, 1fr)", 
              gap: "12px" 
            }}
          >
            <article 
              className={`analysis-type-card ${selectedType === "overview" ? "active" : ""}`}
              onClick={() => handleRunAnalysis("overview")}
              style={{ 
                padding: "14px", 
                cursor: "pointer", 
                borderColor: selectedType === "overview" ? "#059669" : undefined 
              }}
            >
              <span className="analysis-type-icon" style={{ marginBottom: "8px" }}>
                <Icon name="dashboard" size={18} />
              </span>
              <h3 style={{ fontSize: "15px", marginBottom: "4px" }}>Overview</h3>
              <p style={{ fontSize: "12px", lineHeight: "1.3" }}>High-level view of performance.</p>
            </article>

            <article 
              className={`analysis-type-card ${selectedType === "trends" ? "active" : ""}`}
              onClick={() => handleRunAnalysis("trends")}
              style={{ 
                padding: "14px", 
                cursor: "pointer", 
                borderColor: selectedType === "trends" ? "#059669" : undefined 
              }}
            >
              <span className="analysis-type-icon" style={{ marginBottom: "8px" }}>
                <Icon name="chart" size={18} />
              </span>
              <h3 style={{ fontSize: "15px", marginBottom: "4px" }}>Trends</h3>
              <p style={{ fontSize: "12px", lineHeight: "1.3" }}>Identify changes & patterns.</p>
            </article>

            <article 
              className={`analysis-type-card ${selectedType === "products" ? "active" : ""}`}
              onClick={() => handleRunAnalysis("products")}
              style={{ 
                padding: "14px", 
                cursor: "pointer", 
                borderColor: selectedType === "products" ? "#059669" : undefined 
              }}
            >
              <span className="analysis-type-icon" style={{ marginBottom: "8px" }}>
                <Icon name="file" size={18} />
              </span>
              <h3 style={{ fontSize: "15px", marginBottom: "4px" }}>Products</h3>
              <p style={{ fontSize: "12px", lineHeight: "1.3" }}>Top performing products.</p>
            </article>

            <article 
              className={`analysis-type-card ${selectedType === "customers" ? "active" : ""}`}
              onClick={() => handleRunAnalysis("customers")}
              style={{ 
                padding: "14px", 
                cursor: "pointer", 
                borderColor: selectedType === "customers" ? "#059669" : undefined 
              }}
            >
              <span className="analysis-type-icon" style={{ marginBottom: "8px" }}>
                <Icon name="users" size={18} />
              </span>
              <h3 style={{ fontSize: "15px", marginBottom: "4px" }}>Customers</h3>
              <p style={{ fontSize: "12px", lineHeight: "1.3" }}>Customer purchasing behavior.</p>
            </article>
          </div>
        </section>

        {/* Dynamic Analysis Output Panel with Recharts */}
        <section className="panel analysis-empty-panel" style={{ padding: "20px", marginTop: "8px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <h2 style={{ fontSize: "16px" }}>Generating interactive charts...</h2>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>Processing business data with Gemini AI engine.</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#dc2626" }}>
              <h2 style={{ fontSize: "16px" }}>Error loading analysis</h2>
              <p style={{ fontSize: "13px" }}>{error}</p>
            </div>
          ) : !analysisResult ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <div className="analysis-empty-large-icon" style={{ marginBottom: "12px" }}>
                <Icon name="chart" size={24} />
              </div>
              <h2 style={{ fontSize: "16px", marginBottom: "4px" }}>Your analysis will appear here</h2>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                Select an analysis type above to render interactive charts and AI insights.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "16px", margin: 0, color: "#111827" }}>{analysisResult.title}</h2>
                <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>
                  PowerBI Visualizer Active
                </span>
              </div>

              {/* Recharts Container */}
              <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #e5e7eb", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  {analysisResult.chart_type === "line" ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      {analysisResult.datasets.map((ds, idx) => (
                        <Line 
                          key={ds.label} 
                          type="monotone" 
                          dataKey={ds.label} 
                          stroke={idx === 0 ? "#059669" : "#3b82f6"} 
                          strokeWidth={3} 
                          dot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      {analysisResult.datasets.map((ds, idx) => (
                        <Bar 
                          key={ds.label} 
                          dataKey={ds.label} 
                          fill={idx === 0 ? "#059669" : "#10b981"} 
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* AI Summary Box */}
              <div style={{ background: "#ecfdf5", borderLeft: "4px solid #059669", padding: "12px 16px", borderRadius: "0 8px 8px 0" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#065f46", margin: "0 0 4px 0" }}>AI Analyst Summary</h4>
                <p style={{ fontSize: "13px", color: "#047857", lineHeight: "1.4", margin: 0 }}>{analysisResult.summary}</p>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}