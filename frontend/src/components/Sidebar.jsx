import React from "react";
import { Icon } from "./Icon";

export function Sidebar({ activePage, onNavigate, user, onSignOut }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="brand-name">DocIQ</span>
      </a>

      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        <button
          className={`nav-item ${activePage === "knowledge" ? "active" : ""}`}
          onClick={() => onNavigate("knowledge")}
          aria-current={activePage === "knowledge" ? "page" : undefined}
        >
          <Icon name="archive" />
          <span>Knowledge base</span>
        </button>
        <button
          className={`nav-item ${activePage === "ask" ? "active" : ""}`}
          onClick={() => onNavigate("ask")}
          aria-current={activePage === "ask" ? "page" : undefined}
        >
          <Icon name="spark" />
          <span>Ask a question</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <span className="profile-avatar" aria-hidden="true">
          {(user?.name ?? user?.full_name ?? user?.email ?? "U").slice(0, 1).toUpperCase()}
        </span>
        <span className="profile-details">
          <strong>{user?.name ?? user?.full_name ?? "Your profile"}</strong>
          <span>{user?.email ?? "Signed in"}</span>
        </span>
        <button className="sign-out-button" onClick={onSignOut}>Sign out</button>
      </div>
    </aside>
  );
}
