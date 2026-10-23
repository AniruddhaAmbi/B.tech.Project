import DociqLogo from "./DociqLogo";
import { Icon } from "./Icon";

const navigation = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "AI Analyst", icon: "sparkles" },
  { label: "Data Sources", icon: "database" },
  { label: "Analysis", icon: "chart" },
  { label: "Reports", icon: "file" },
  { label: "Settings", icon: "settings" },
];

export default function Sidebar({
  activePage = "Dashboard",
  onNavigate,
  mobileOpen,
  onClose,
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <DociqLogo />
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-title">
            WORKSPACE
          </p>

          {navigation.map((item) => (
            <button
              key={item.label}
              className={`sidebar-nav-item ${
                activePage === item.label ? "active" : ""
              }`}
              onClick={() => {
                onNavigate(item.label);
                onClose?.();
              }}
            >
              <Icon
                name={item.icon}
                size={19}
              />

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">

          <div className="security-card">
            <div className="security-icon">
              <Icon name="shield" size={18} />
            </div>

            <strong>Your data is secure</strong>

            <p>
              DOCIQ keeps your business data private and safe.
            </p>

            <button>
              Learn more →
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}