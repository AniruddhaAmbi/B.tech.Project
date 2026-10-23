import { Icon } from "../components/Icon";

export default function SettingsPage({ user }) {
  return (
    <div className="settings-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <header className="page-header">

        <div className="breadcrumb">
          <span>Workspace</span>

          <Icon name="chevron" size={14} />

          <span className="breadcrumb-current">
            Settings
          </span>
        </div>

        <div className="heading-row">

          <div>
            <p className="eyebrow">WORKSPACE SETTINGS</p>

            <h1>Settings</h1>

            <p className="page-description">
              Manage your DOCIQ workspace, account, and preferences.
            </p>
          </div>

        </div>

      </header>


      {/* =========================================
          PAGE BODY
      ========================================= */}

      <div className="page-body">


        {/* =========================================
            WORKSPACE
        ========================================= */}

        <section className="panel settings-panel">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Icon name="building" size={21} />
            </div>

            <div>
              <p className="eyebrow">WORKSPACE</p>

              <h2>Workspace settings</h2>

              <p>
                Manage the basic information for your DOCIQ business workspace.
              </p>
            </div>

          </div>


          <div className="settings-form-grid">

            <div className="settings-field">
              <label>Business name</label>

              <input
                type="text"
                value="GreenLeaf Retail"
                readOnly
              />
            </div>


            <div className="settings-field">
              <label>Workspace type</label>

              <input
                type="text"
                value="Business"
                readOnly
              />
            </div>

          </div>


          <div className="settings-panel-footer">
            <button
              type="button"
              className="button button-primary"
              disabled
            >
              Save changes
            </button>
          </div>

        </section>


        {/* =========================================
            ACCOUNT
        ========================================= */}

        <section className="panel settings-panel">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Icon name="users" size={21} />
            </div>

            <div>
              <p className="eyebrow">ACCOUNT</p>

              <h2>Account information</h2>

              <p>
                Manage your personal DOCIQ account information.
              </p>
            </div>

          </div>


          <div className="settings-account">

            <div className="settings-avatar">
              D
            </div>

            <div className="settings-account-info">

              <h3>
                {user?.name || "DOCIQ User"}
              </h3>

              <p>
                {user?.email || "Account email"}
              </p>

              <span className="settings-role">
                Owner
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            ANALYSIS PREFERENCES
        ========================================= */}

        <section className="panel settings-panel">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Icon name="chart" size={21} />
            </div>

            <div>
              <p className="eyebrow">ANALYSIS</p>

              <h2>Analysis preferences</h2>

              <p>
                Control how DOCIQ prepares and presents your business analysis.
              </p>
            </div>

          </div>


          <div className="settings-option-list">

            <div className="settings-option">

              <div>
                <h3>Default analysis</h3>

                <p>
                  Choose the analysis type DOCIQ should use by default.
                </p>
              </div>

              <span className="settings-option-value">
                Overview
                <Icon name="chevron" size={15} />
              </span>

            </div>


            <div className="settings-option">

              <div>
                <h3>Insight detail</h3>

                <p>
                  Control how detailed generated business insights should be.
                </p>
              </div>

              <span className="settings-option-value">
                Standard
                <Icon name="chevron" size={15} />
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            NOTIFICATIONS
        ========================================= */}

        <section className="panel settings-panel">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Icon name="bell" size={21} />
            </div>

            <div>
              <p className="eyebrow">NOTIFICATIONS</p>

              <h2>Notifications</h2>

              <p>
                Choose which DOCIQ notifications you receive.
              </p>
            </div>

          </div>


          <div className="settings-option-list">

            <div className="settings-option">

              <div>
                <h3>Analysis completed</h3>

                <p>
                  Notify me when an analysis has finished.
                </p>
              </div>

              <span className="settings-toggle settings-toggle-on">
                ON
              </span>

            </div>


            <div className="settings-option">

              <div>
                <h3>Report generated</h3>

                <p>
                  Notify me when a business report is ready.
                </p>
              </div>

              <span className="settings-toggle settings-toggle-on">
                ON
              </span>

            </div>


            <div className="settings-option">

              <div>
                <h3>Data source updates</h3>

                <p>
                  Notify me about important changes to connected data.
                </p>
              </div>

              <span className="settings-toggle settings-toggle-on">
                ON
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            SECURITY
        ========================================= */}

        <section className="panel settings-panel">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Icon name="shield" size={21} />
            </div>

            <div>
              <p className="eyebrow">SECURITY</p>

              <h2>Security</h2>

              <p>
                Manage your account security and access.
              </p>
            </div>

          </div>


          <div className="settings-option-list">

            <div className="settings-option">

              <div>
                <h3>Password</h3>

                <p>
                  Update your account password.
                </p>
              </div>

              <button
                type="button"
                className="button button-outline"
                disabled
              >
                Change
              </button>

            </div>


            <div className="settings-option">

              <div>
                <h3>Active sessions</h3>

                <p>
                  Review devices currently signed into your account.
                </p>
              </div>

              <button
                type="button"
                className="button button-outline"
                disabled
              >
                Manage
              </button>

            </div>


            <div className="settings-option">

              <div>
                <h3>Two-factor authentication</h3>

                <p>
                  Add an additional layer of security to your account.
                </p>
              </div>

              <span className="settings-coming-soon">
                Coming soon
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            DANGER ZONE
        ========================================= */}

        <section className="panel settings-danger-panel">

          <div>
            <p className="eyebrow">DANGER ZONE</p>

            <h2>Delete workspace</h2>

            <p>
              Permanently remove this DOCIQ workspace and its data.
            </p>
          </div>

          <button
            type="button"
            className="button button-danger"
            disabled
          >
            Delete workspace
          </button>

        </section>

      </div>
    </div>
  );
}