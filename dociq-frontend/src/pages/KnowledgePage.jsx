import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import {
  getDocuments,
  searchDocuments,
  uploadDocuments,
} from "../services/api";

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function KnowledgePage({ onAsk }) {
  const fileInput = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentsError, setDocumentsError] = useState("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadDocuments() {
    setLoading(true);
    setError("");
    setDocumentsError("");

    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (loadError) {
      const message =
        loadError?.message || "Unable to load documents.";

      setError(message);
      setDocumentsError(message);
    } finally {
      setLoading(false);
    }
  }

  // Initial document loading
  useEffect(() => {
    let cancelled = false;

    getDocuments()
      .then((data) => {
        if (cancelled) return;

        setDocuments(data);
        setDocumentsError("");
        setError("");
        setLoading(false);
      })
      .catch((loadError) => {
        if (cancelled) return;

        const message =
          loadError?.message || "Unable to load documents.";

        setError(message);
        setDocumentsError(message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(event) {
    const files = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      await uploadDocuments(files);
      await loadDocuments();
    } catch (uploadError) {
      setError(
        uploadError?.message || "Unable to upload documents."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    setSearching(true);
    setError("");
    setResults(null);

    try {
      const data = await searchDocuments(trimmedQuery);
      setResults(data);
    } catch (searchError) {
      setError(
        searchError?.message || "Unable to search documents."
      );
    } finally {
      setSearching(false);
    }
  }

  return (
    <>
      <header className="page-header">
        <div className="breadcrumb">
          <span>Workspace</span>
          <Icon name="chevron" size={14} />
          <span className="breadcrumb-current">
            Knowledge base
          </span>
        </div>

        <div className="heading-row">
          <div>
            <p className="eyebrow">YOUR SOURCES</p>

            <h1>Knowledge base</h1>

            <p className="page-description">
              Add documents, then search their contents or ask a
              question.
            </p>
          </div>

          <button
            className="button button-primary"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            <Icon name="upload" size={17} />

            {uploading ? "Uploading…" : "Add documents"}
          </button>

          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            multiple
            onChange={handleUpload}
            aria-label="Choose documents to add"
          />
        </div>
      </header>

      <div className="page-body">
        {error && error !== documentsError && (
          <div className="notice notice-error" role="alert">
            <span>{error}</span>

            <button
              className="text-button"
              onClick={loadDocuments}
            >
              Retry
            </button>
          </div>
        )}

        <section
          className="panel search-panel"
          aria-labelledby="search-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="search-title">
                Search your sources
              </h2>

              <p>
                Find relevant passages across your connected
                documents.
              </p>
            </div>

            <span className="section-icon">
              <Icon name="search" />
            </span>
          </div>

          <form
            className="search-form"
            onSubmit={handleSearch}
          >
            <Icon name="search" size={18} />

            <input
              aria-label="Search documents"
              placeholder="Search documents…"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />

            <button
              className="button button-dark"
              disabled={
                searching || !query.trim()
              }
            >
              {searching ? "Searching…" : "Search"}
            </button>
          </form>

          {results && (
            <div
              className="search-results"
              aria-live="polite"
            >
              <h3>
                {results.length
                  ? "Results"
                  : "No matching passages"}
              </h3>

              {results.map((result, index) => (
                <article
                  className="result-item"
                  key={result.id ?? index}
                >
                  <div className="result-title">
                    <Icon name="file" size={16} />

                    <strong>
                      {result.title ??
                        result.filename ??
                        "Untitled source"}
                    </strong>
                  </div>

                  <p>
                    {result.snippet ??
                      result.content ??
                      "No passage text was provided."}
                  </p>
                </article>
              ))}
            </div>
          )}

          <button
            className="text-link"
            onClick={onAsk}
          >
            Ask a question instead
            <Icon name="arrow" size={15} />
          </button>
        </section>

        <section
          className="documents-section"
          aria-labelledby="documents-title"
        >
          <div className="documents-heading">
            <div>
              <h2 id="documents-title">
                Documents
              </h2>

              <p>
                Files available in this workspace
              </p>
            </div>

            {!loading && !documentsError && (
              <span className="document-count">
                {documents.length} documents
              </span>
            )}
          </div>

          {loading ? (
            <div className="panel state-panel">
              <span className="loading-indicator" />

              <p>
                Loading documents…
              </p>
            </div>
          ) : documentsError ? (
            <div className="panel state-panel">
              <p>{documentsError}</p>

              <button
                className="text-button"
                onClick={loadDocuments}
              >
                Retry
              </button>
            </div>
          ) : documents.length ? (
            <div className="panel document-list">
              {documents.map((document, index) => (
                <div
                  className="document-row"
                  key={document.id ?? index}
                >
                  <span className="file-icon">
                    <Icon name="file" size={18} />
                  </span>

                  <div className="document-info">
                    <strong>
                      {document.name ??
                        document.filename ??
                        "Untitled document"}
                    </strong>

                    <span>
                      {document.status ?? "Available"}

                      {Number.isFinite(document.size) &&
                        ` · ${formatFileSize(
                          document.size
                        )}`}
                    </span>
                  </div>

                  <Icon
                    name="chevron"
                    size={16}
                    className="row-chevron"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="panel empty-state">
              <span className="empty-icon">
                <Icon name="book" size={22} />
              </span>

              <h3>No documents yet</h3>

              <p>
                Add a source document to make its contents
                searchable in this workspace.
              </p>

              <button
                className="button button-outline"
                onClick={() =>
                  fileInput.current?.click()
                }
                disabled={uploading}
              >
                <Icon name="plus" size={16} />

                Add your first document
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}