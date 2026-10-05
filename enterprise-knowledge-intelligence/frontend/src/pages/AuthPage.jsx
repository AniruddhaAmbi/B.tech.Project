import React, { useState } from "react";
import { Icon } from "../components/Icon";
import {
  createUserAccount,
  signInAdmin,
  signInUser,
} from "../services/api";

const modes = {
  login: {
    title: "Welcome back",
    description: "Sign in to continue to your knowledge workspace.",
    submit: "Sign in",
  },
  register: {
    title: "Create your account",
    description: "Set up a profile to start using your knowledge workspace.",
    submit: "Create account",
  },
  admin: {
    title: "Administrator sign in",
    description: "Sign in with an administrator account.",
    submit: "Sign in as admin",
  },
};

export function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const session =
        mode === "register"
          ? await createUserAccount(name.trim(), email.trim(), password)
          : mode === "admin"
            ? await signInAdmin(email.trim(), password)
            : await signInUser(email.trim(), password);

      onAuthenticated(session);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const currentMode = modes[mode];

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <a className="brand auth-brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">DocIQ</span>
        </a>
        <span className="auth-topbar-note">Document knowledge workspace</span>
      </header>

      <section className="auth-content" aria-labelledby="auth-title">
        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-icon"><Icon name="archive" size={19} /></span>
            <h1 id="auth-title">{currentMode.title}</h1>
            <p>{currentMode.description}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button
              id="login-tab"
              role="tab"
              aria-selected={mode === "login"}
              aria-controls="auth-form-panel"
              className={mode === "login" ? "selected" : ""}
              onClick={() => changeMode("login")}
              type="button"
            >
              User sign in
            </button>
            <button
              id="register-tab"
              role="tab"
              aria-selected={mode === "register"}
              aria-controls="auth-form-panel"
              className={mode === "register" ? "selected" : ""}
              onClick={() => changeMode("register")}
              type="button"
            >
              Create account
            </button>
            <button
              id="admin-tab"
              role="tab"
              aria-selected={mode === "admin"}
              aria-controls="auth-form-panel"
              className={mode === "admin" ? "selected" : ""}
              onClick={() => changeMode("admin")}
              type="button"
            >
              Admin
            </button>
          </div>

          <form
            id="auth-form-panel"
            className="auth-form"
            role="tabpanel"
            aria-labelledby={`${mode}-tab`}
            onSubmit={handleSubmit}
          >
            {mode === "register" && (
              <div className="auth-field">
                <label htmlFor="account-name">Full name</label>
                <input
                  id="account-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="account-email">Email address</label>
              <input
                id="account-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="account-password">Password</label>
              <input
                id="account-password"
                name="password"
                type="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>

            {mode === "register" && (
              <div className="auth-field">
                <label htmlFor="confirm-password">Confirm password</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                  required
                />
              </div>
            )}

            {error && <div className="auth-error" role="alert">{error}</div>}

            <button className="button button-primary auth-submit" disabled={submitting}>
              {submitting ? "Please wait…" : currentMode.submit}
              {!submitting && <Icon name="arrow" size={16} />}
            </button>
          </form>

          {mode === "login" && (
            <p className="auth-switch">
              New to DocIQ?{" "}
              <button type="button" onClick={() => changeMode("register")}>
                Create an account
              </button>
            </p>
          )}
          {mode === "register" && (
            <p className="auth-switch">
              Already have an account?{" "}
              <button type="button" onClick={() => changeMode("login")}>
                Sign in
              </button>
            </p>
          )}
          {mode === "admin" && (
            <p className="admin-note">
              Administrator access is verified by the authentication service.
            </p>
          )}
        </div>
        <p className="auth-footnote">Your account access is managed by your DocIQ service.</p>
      </section>
    </main>
  );
}
