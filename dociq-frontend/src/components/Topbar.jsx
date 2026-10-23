import { Icon } from "./Icon";

export default function Topbar({ user, onMenuClick }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Icon name="menu" size={22} />
        </button>

        <button className="workspace-selector">
          <span className="workspace-icon">
            <Icon name="building" size={18} />
          </span>

          <span className="workspace-name">
            GreenLeaf Retail
          </span>

          <Icon name="chevronDown" size={16} />
        </button>
      </div>

      <div className="topbar-right">
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          <Icon name="bell" size={20} />
          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        <button className="profile-button">
          <div className="profile-avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="profile-info">
            <strong>
              {user?.name || "DOCIQ User"}
            </strong>

            <span>
              {user?.role === "admin"
                ? "Administrator"
                : "Owner"}
            </span>
          </div>

          <Icon name="chevronDown" size={15} />
        </button>
      </div>
    </header>
  );
}