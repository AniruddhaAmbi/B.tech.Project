import { Icon } from "../components/Icon";

export default function ReportPage() {
  return (
    <div className="reports-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <header className="page-header">
        <div className="breadcrumb">
          <span>Workspace</span>

          <Icon name="chevron" size={14} />

          <span className="breadcrumb-current">
            Reports
          </span>
        </div>

        <div className="heading-row">
          <div>
            <p className="eyebrow">BUSINESS REPORTS</p>

            <h1>Reports</h1>

            <p className="page-description">
              Turn your business analysis into clear,
              shareable reports and insights.
            </p>
          </div>

          <button
            type="button"
            className="button button-primary"
            disabled
          >
            <Icon name="plus" size={16} />
            New report
          </button>
        </div>
      </header>


      {/* =========================================
          PAGE BODY
      ========================================= */}

      <div className="page-body">

        {/* -----------------------------------------
            REPORT CREATION
        ----------------------------------------- */}

        <section className="panel report-create-panel">

          <div className="report-section-heading">
            <div>
              <p className="eyebrow">CREATE A REPORT</p>

              <h2>
                Turn your analysis into a report
              </h2>

              <p>
                Select a completed analysis to generate
                a structured business report.
              </p>
            </div>

            <div className="report-heading-icon">
              <Icon name="file" size={22} />
            </div>
          </div>


          <div className="report-create-content">

            <div className="report-empty-icon">
              <Icon name="chart" size={24} />
            </div>

            <div className="report-empty-content">
              <h3>No analysis available</h3>

              <p>
                Complete an analysis first. Your results
                will become available here for reporting.
              </p>
            </div>

            <button
              type="button"
              className="button button-outline"
              disabled
            >
              Create report
            </button>

          </div>

        </section>


        {/* -----------------------------------------
            REPORT TYPES
        ----------------------------------------- */}

        <section className="report-types-section">

          <div className="report-section-heading">
            <div>
              <p className="eyebrow">REPORT TYPES</p>

              <h2>Choose a report format</h2>

              <p>
                DOCIQ can organize your analysis into
                different business-focused reports.
              </p>
            </div>
          </div>


          <div className="report-type-grid">

            <article className="report-type-card">

              <span className="report-type-icon">
                <Icon name="dashboard" size={21} />
              </span>

              <h3>Business Overview</h3>

              <p>
                Summarize overall business performance,
                key metrics, and important findings.
              </p>

            </article>


            <article className="report-type-card">

              <span className="report-type-icon">
                <Icon name="chart" size={21} />
              </span>

              <h3>Performance Report</h3>

              <p>
                Present important trends, changes,
                and performance patterns.
              </p>

            </article>


            <article className="report-type-card">

              <span className="report-type-icon">
                <Icon name="file" size={21} />
              </span>

              <h3>Analysis Summary</h3>

              <p>
                Convert your completed analysis into
                a concise summary of key insights.
              </p>

            </article>

          </div>

        </section>


        {/* -----------------------------------------
            RECENT REPORTS
        ----------------------------------------- */}

        <section className="panel reports-history-panel">

          <div className="report-section-heading">
            <div>
              <p className="eyebrow">REPORT HISTORY</p>

              <h2>Recent reports</h2>

              <p>
                Reports generated from your business
                analyses will appear here.
              </p>
            </div>
          </div>


          <div className="reports-empty-state">

            <div className="reports-empty-large-icon">
              <Icon name="file" size={27} />
            </div>

            <h3>No reports yet</h3>

            <p>
              Once you complete an analysis and generate
              a report, it will appear here.
            </p>

          </div>

        </section>

      </div>
    </div>
  );
}