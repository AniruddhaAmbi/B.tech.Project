import { useState, useEffect } from "react";
import { Icon } from "../components/Icon";

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active workspace state (can later be tied to your top ribbon dropdown)
  const activeWorkspace = "GreenLeaf Retail";

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/dashboard/stats?workspace_id=${encodeURIComponent(activeWorkspace)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard metrics");
        }
        const data = await response.json();
        setStats(data.metrics);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [activeWorkspace]);

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">OVERVIEW</p>

          <h1>
            Welcome back, DOCIQ <span>👋</span>
          </h1>

          <p className="dashboard-description">
            Turn your business data into clear insights. Ask questions,
            analyze trends, and make better decisions.
          </p>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="stats-grid">
        {loading ? (
          <p className="loading-text">Loading live analytics...</p>
        ) : error ? (
          <p className="error-text">Unable to load metrics from server.</p>
        ) : (
          stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon name={stat.icon} size={19} />
                </div>
              </div>

              <p className="stat-label">{stat.label}</p>

              <h2 className="stat-value">{stat.value}</h2>

              <div className="stat-change">
                <span>↑ {stat.change}</span>
                <small>vs. last month</small>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}