import { Icon } from "../components/Icon";

const stats = [
  {
    label: "Total Revenue",
    value: "₹ 24,84,320",
    change: "12.4%",
    icon: "archive",
  },
  {
    label: "Total Orders",
    value: "8,421",
    change: "7.2%",
    icon: "check",
  },
  {
    label: "Total Customers",
    value: "2,184",
    change: "5.6%",
    icon: "users",
  },
  {
    label: "Average Order Value",
    value: "₹ 2,943",
    change: "3.8%",
    icon: "spark",
  },
];

export default function DashboardPage() {
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

      {/* KPI Cards */}
      <section className="stats-grid">
        {stats.map((stat) => (
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
        ))}
      </section>
    </div>
  );
}