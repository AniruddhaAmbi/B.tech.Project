import { Icon } from "../components/Icon";

export default function AnalysisPage() {
  return (
    <div className="analysis-page">
      <header className="page-header">
        <div className="breadcrumb">
          <span>Workspace</span>

          <Icon name="chevron" size={14} />

          <span className="breadcrumb-current">
            Analysis
          </span>
        </div>

        <div className="heading-row">
          <div>
            <p className="eyebrow">BUSINESS ANALYSIS</p>

            <h1>Analysis</h1>

            <p className="page-description">
              Explore your business data and discover useful
              insights.
            </p>
          </div>

          <button
            type="button"
            className="button button-primary"
            disabled
          >
            <Icon name="plus" size={16} />
            New analysis
          </button>
        </div>
      </header>

      <div className="page-body">

        {/* Dataset selection */}
        <section className="panel analysis-dataset-panel">
          <div className="analysis-section-header">
            <div>
              <p className="eyebrow">DATASET</p>

              <h2>Select data to analyze</h2>

              <p>
                Choose one of your connected business
                data sources to begin an analysis.
              </p>
            </div>
          </div>

          <div className="analysis-dataset-empty">
            <div className="analysis-empty-icon">
              <Icon name="database" size={24} />
            </div>

            <div>
              <h3>No dataset selected</h3>

              <p>
                Connect a business document or database
                from Data Sources to begin analyzing it.
              </p>
            </div>

            <button
              type="button"
              className="button button-outline"
              disabled
            >
              Select dataset
            </button>
          </div>
        </section>

        {/* Analysis types */}
        <section className="analysis-types-section">
          <div className="analysis-section-header">
            <div>
              <p className="eyebrow">ANALYSIS TYPES</p>

              <h2>What would you like to analyze?</h2>

              <p>
                Choose the type of analysis DOCIQ should
                perform on your business data.
              </p>
            </div>
          </div>

          <div className="analysis-type-grid">

            <article className="analysis-type-card">
              <span className="analysis-type-icon">
                <Icon name="dashboard" size={21} />
              </span>

              <h3>Overview</h3>

              <p>
                Get a high-level view of your business
                performance.
              </p>
            </article>

            <article className="analysis-type-card">
              <span className="analysis-type-icon">
                <Icon name="chart" size={21} />
              </span>

              <h3>Trends</h3>

              <p>
                Identify changes and patterns across
                your business data.
              </p>
            </article>

            <article className="analysis-type-card">
              <span className="analysis-type-icon">
                <Icon name="file" size={21} />
              </span>

              <h3>Products</h3>

              <p>
                Understand which products or categories
                are performing best.
              </p>
            </article>

            <article className="analysis-type-card">
              <span className="analysis-type-icon">
                <Icon name="users" size={21} />
              </span>

              <h3>Customers</h3>

              <p>
                Discover customer behaviour and
                purchasing patterns.
              </p>
            </article>

          </div>
        </section>

        {/* Empty analysis state */}
        <section className="panel analysis-empty-panel">
          <div className="analysis-empty-large-icon">
            <Icon name="chart" size={30} />
          </div>

          <h2>Your analysis will appear here</h2>

          <p>
            Connect your business data and select an
            analysis type to start discovering insights
            with DOCIQ.
          </p>
        </section>

      </div>
    </div>
  );
}