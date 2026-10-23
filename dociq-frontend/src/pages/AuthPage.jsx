import { useState } from "react";
import { Icon } from "../components/Icon";

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

// DEVELOPMENT ONLY
const STATIC_CREDENTIALS = {
  user: {
    email: "user@dociq.local",
    password: "DocIQ@123",
    role: "user",
    name: "DOCIQ User",
  },
  admin: {
    email: "admin@dociq.local",
    password: "Admin@123",
    role: "admin",
    name: "DOCIQ Admin",
  },
};

export function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function changeMode(nextMode) {
    setMode(nextMode);

    setError("");
    setSuccess("");

    setPassword("");
    setConfirmPassword("");
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    // --------------------------------
    // BASIC VALIDATION
    // --------------------------------

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // --------------------------------
    // CREATE ACCOUNT
    // --------------------------------

    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (password !== confirmPassword) {
        setError("The passwords do not match.");
        return;
      }

      // Check whether account already exists
      const savedUser = localStorage.getItem("dociq_user");

      if (savedUser) {
        try {
          const existingUser = JSON.parse(savedUser);

          if (existingUser.email === cleanEmail) {
            setError("An account with this email already exists.");
            return;
          }
        } catch {
          localStorage.removeItem("dociq_user");
        }
      }

      // Create new local development account
      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        password: password,
        role: "user",
      };

      localStorage.setItem("dociq_user", JSON.stringify(newUser));

      // Clear registration fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Move user to login
      setMode("login");

      setSuccess(
        "Account created successfully. Please sign in with your new account."
      );

      return;
    }

    // --------------------------------
    // LOGIN
    // --------------------------------

    setSubmitting(true);

    // Simulate authentication request
    await new Promise((resolve) => setTimeout(resolve, 600));

    let credentials;

    // Admin login
    if (mode === "admin") {
      credentials = STATIC_CREDENTIALS.admin;
    }

    // Normal user login
    else {
      const savedUser = localStorage.getItem("dociq_user");

      if (savedUser) {
        try {
          credentials = JSON.parse(savedUser);
      } catch {
          credentials = STATIC_CREDENTIALS.user;
        }
      } else {
        credentials = STATIC_CREDENTIALS.user;
      }
    }

    // Check credentials
    if (
      cleanEmail !== credentials.email ||
      password !== credentials.password
    ) {
      setError("Invalid email or password.");
      setSubmitting(false);
      return;
    }

    // --------------------------------
    // CREATE SESSION
    // --------------------------------

    const session = {
      authenticated: true,
      role: credentials.role,
      name: credentials.name,
      email: credentials.email,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("dociq_session", JSON.stringify(session));

    // Tell App that authentication succeeded
    if (onAuthenticated) {
      onAuthenticated(session);
    }

    setSubmitting(false);
  }

  const currentMode = modes[mode];

  return (
    <main className="auth-page">
      {/* ================================
          TOP BAR
      ================================= */}

      <header className="auth-topbar">
        <a
          className="brand auth-brand"
          href="#"
          onClick={(event) => event.preventDefault()}
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>

          <span className="brand-name">DocIQ</span>
        </a>

        <span className="auth-topbar-note">
          Document knowledge workspace
        </span>
      </header>

      {/* ================================
          AUTH CONTENT
      ================================= */}

      <section
        className="auth-content"
        aria-labelledby="auth-title"
      >
        <div className="auth-card">

          {/* HEADING */}

          <div className="auth-card-heading">
            <span className="auth-icon">
              <Icon name="archive" size={19} />
            </span>

            <h1 id="auth-title">
              {currentMode.title}
            </h1>

            <p>
              {currentMode.description}
            </p>
          </div>

          {/* ================================
              AUTH TABS
          ================================= */}

          <div
            className="auth-tabs"
            role="tablist"
            aria-label="Account access"
          >
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

          {/* ================================
              FORM
          ================================= */}

          <form
            id="auth-form-panel"
            className="auth-form"
            role="tabpanel"
            aria-labelledby={`${mode}-tab`}
            onSubmit={handleSubmit}
          >

            {/* NAME - REGISTER ONLY */}

            {mode === "register" && (
              <div className="auth-field">
                <label htmlFor="account-name">
                  Full name
                </label>

                <input
                  id="account-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your name"
                />
              </div>
            )}

            {/* EMAIL */}

            <div className="auth-field">
              <label htmlFor="account-email">
                Email address
              </label>

              <input
                id="account-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@company.com"
              />
            </div>

            {/* PASSWORD */}

            <div className="auth-field">
              <label htmlFor="account-password">
                Password
              </label>

              <input
                id="account-password"
                name="password"
                type="password"
                autoComplete={
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 8 characters"
              />
            </div>

            {/* CONFIRM PASSWORD */}

            {mode === "register" && (
              <div className="auth-field">
                <label htmlFor="confirm-password">
                  Confirm password
                </label>

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your password again"
                />
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div
                className="auth-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div
                className="auth-success"
                role="status"
              >
                {success}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="button button-primary auth-submit"
              disabled={submitting}
            >
              {submitting
                ? "Please wait…"
                : currentMode.submit}

              {!submitting && (
                <Icon
                  name="arrow"
                  size={16}
                />
              )}
            </button>

          </form>

          {/* ================================
              LOGIN SWITCH
          ================================= */}

          {mode === "login" && (
            <p className="auth-switch">
              New to DocIQ?{" "}

              <button
                type="button"
                onClick={() =>
                  changeMode("register")
                }
              >
                Create an account
              </button>
            </p>
          )}

          {/* ================================
              REGISTER SWITCH
          ================================= */}

          {mode === "register" && (
            <p className="auth-switch">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  changeMode("login")
                }
              >
                Sign in
              </button>
            </p>
          )}

          {/* ================================
              ADMIN NOTE
          ================================= */}

          {mode === "admin" && (
            <p className="admin-note">
              Administrator access is currently
              using development credentials.
            </p>
          )}

        </div>

        {/* FOOTNOTE */}

        <p className="auth-footnote">
          Your account access is managed securely by DocIQ.
        </p>

      </section>
    </main>
  );
}