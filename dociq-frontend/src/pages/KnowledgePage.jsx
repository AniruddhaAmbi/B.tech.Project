import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import {
  getDocuments,
  uploadDocuments,
} from "../services/api";

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(filename = "") {
  const extension = filename
    .split(".")
    .pop()
    ?.toLowerCase();

  const types = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    xls: "Excel",
    xlsx: "Excel",
    csv: "CSV",
    txt: "Text",
  };

  return types[extension] || "Document";
}

function isUnsupportedFile(file) {
  return (
    file.type?.startsWith("audio/") ||
    file.type?.startsWith("video/")
  );
}

export function KnowledgePage() {
  const fileInput = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentsError, setDocumentsError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function loadDocuments() {
    setLoading(true);
    setDocumentsError("");

    try {
      const data = await getDocuments();

      setDocuments(data);
      setError("");
    } catch (loadError) {
      const message =
        loadError?.message ||
        "Unable to load documents.";

      setError(message);
      setDocumentsError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initializeDocuments() {
      try {
        const data = await getDocuments();

        if (cancelled) return;

        setDocuments(data);
        setDocumentsError("");
        setError("");
      } catch (loadError) {
        if (cancelled) return;

        const message =
          loadError?.message ||
          "Unable to load documents.";

        setError(message);
        setDocumentsError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeDocuments();

    return () => {
      cancelled = true;
    };
  }, []);

  async function processFiles(files) {
    if (!files.length) {
      return;
    }

    const supportedFiles = files.filter(
      (file) => !isUnsupportedFile(file)
    );

    if (!supportedFiles.length) {
      setError(
        "Audio and video files are not supported. Please choose document files."
      );
      return;
    }

    if (supportedFiles.length !== files.length) {
      setError(
        "Some audio or video files were skipped. Only document files were added."
      );
    } else {
      setError("");
    }

    setUploading(true);

    try {
      const uploadedDocuments =
        await uploadDocuments(supportedFiles);

      // Temporary frontend behaviour.
      // Replace this with the real backend response
      // when the document upload API is connected.
      setDocuments((currentDocuments) => [
        ...currentDocuments,
        ...uploadedDocuments,
      ]);
    } catch (uploadError) {
      setError(
        uploadError?.message ||
          "Unable to upload documents."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleUpload(event) {
    const files = Array.from(
      event.target.files ?? []
    );

    // Allows selecting the same file again later.
    event.target.value = "";

    await processFiles(files);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);

    const files = Array.from(
      event.dataTransfer.files ?? []
    );

    processFiles(files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(event) {
    if (
      !event.currentTarget.contains(
        event.relatedTarget
      )
    ) {
      setDragging(false);
    }
  }

  function openFilePicker() {
    if (!uploading) {
      fileInput.current?.click();
    }
  }

  return (
    <div className="data-sources-page">
      {/* ==============================
          PAGE HEADER
      ============================== */}

      <header className="page-header">
        <div className="breadcrumb">
          <span>Workspace</span>

          <Icon name="chevron" size={14} />

          <span className="breadcrumb-current">
            Data Sources
          </span>
        </div>

        <div className="heading-row">
          <div>
            <p className="eyebrow">YOUR SOURCES</p>

            <h1>Data Sources</h1>

            <p className="page-description">
              Connect your business data so DOCIQ can
              analyze it and generate useful insights.
            </p>
          </div>
        </div>
      </header>

      <div className="page-body">
        {/* ==============================
            ERROR NOTICE
        ============================== */}

        {error && (
          <div
            className="notice notice-error"
            role="alert"
          >
            <span>{error}</span>

            <button
              type="button"
              className="text-button"
              onClick={() => setError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ==============================
            DATA CONNECTION OPTIONS
        ============================== */}

        <section className="panel data-connection-panel">
          <div className="section-heading">
            <div>
              <h2>Connect your data</h2>

              <p>
                Choose how you want to provide data
                to DOCIQ.
              </p>
            </div>
          </div>

          <div className="connection-grid">
            {/* SQL DATABASE */}

            <article className="connection-card connection-card-disabled">
              <div className="connection-card-top">
                <span className="section-icon">
                  <Icon
                    name="database"
                    size={22}
                  />
                </span>

                <span className="connection-badge coming-soon">
                  Coming soon
                </span>
              </div>

              <div className="connection-card-content">
                <h3>SQL Database</h3>

                <p>
                  Connect your business database
                  directly to DOCIQ for deeper
                  analysis.
                </p>

                <span className="connection-types">
                  MySQL · PostgreSQL · SQL Server
                </span>
              </div>
            </article>

            {/* COMPANY DOCUMENTS */}

            <article className="connection-card connection-card-active">
              <div className="connection-card-top">
                <span className="section-icon">
                  <Icon
                    name="file"
                    size={22}
                  />
                </span>

                <span className="connection-badge available">
                  Available
                </span>
              </div>

              <div className="connection-card-content">
                <h3>Company Documents</h3>

                <p>
                  Upload reports, spreadsheets and
                  other business documents for DOCIQ
                  to understand.
                </p>

                <span className="connection-types">
                  PDF · Word · Excel · CSV · Text
                </span>
              </div>
            </article>
          </div>
        </section>

        {/* ==============================
            DOCUMENT UPLOAD AREA
        ============================== */}

        <section
          className={`upload-dropzone ${
            dragging ? "is-dragging" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="Document upload area"
        >
          <div className="dropzone-icon">
            <Icon name="upload" size={23} />
          </div>

          <div className="dropzone-content">
            <h3>
              {uploading
                ? "Uploading your documents…"
                : "Drop your files here"}
            </h3>

            <p>
              Drag and drop files here, or choose
              them from your computer.
            </p>

            <span>
              Documents only · Multiple files
              supported
            </span>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={openFilePicker}
            disabled={uploading}
          >
            <Icon name="upload" size={16} />

            {uploading
              ? "Uploading…"
              : "Choose files"}
          </button>

          {/* 
            This is the ONLY actual file input
            on the page.

            It is intentionally hidden because
            the custom button above controls it.
          */}
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            onChange={handleUpload}
            aria-label="Choose business documents"
          />
        </section>

        {/* ==============================
            CONNECTED DOCUMENTS
        ============================== */}

        <section
          className="documents-section"
          aria-labelledby="documents-title"
        >
          <div className="documents-heading">
            <div>
              <p className="eyebrow">
                CONNECTED FILES
              </p>

              <h2 id="documents-title">
                Documents
              </h2>

              <p>
                Files currently available to DOCIQ.
              </p>
            </div>

            {!loading && !documentsError && (
              <span className="document-count">
                {documents.length}{" "}
                {documents.length === 1
                  ? "document"
                  : "documents"}
              </span>
            )}
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="panel state-panel">
              <span className="loading-indicator" />

              <p>Loading documents…</p>
            </div>
          ) : documentsError ? (
            /* ERROR */

            <div className="panel state-panel">
              <p>{documentsError}</p>

              <button
                type="button"
                className="text-button"
                onClick={loadDocuments}
              >
                Retry
              </button>
            </div>
          ) : documents.length ? (
            /* DOCUMENT LIST */

            <div className="document-list">
              {documents.map(
                (document, index) => {
                  const filename =
                    document.name ??
                    document.filename ??
                    "Untitled document";

                  const status =
                    document.status ??
                    "Available";

                  return (
                    <div
                      className="document-card"
                      key={
                        document.id ?? index
                      }
                    >
                      <span className="file-icon">
                        <Icon
                          name="file"
                          size={20}
                        />
                      </span>

                      <div className="document-info">
                        <strong>
                          {filename}
                        </strong>

                        <span>
                          {getFileType(filename)}
                          {" · "}
                          {status}

                          {Number.isFinite(
                            document.size
                          ) &&
                            ` · ${formatFileSize(
                              document.size
                            )}`}
                        </span>
                      </div>

                      <span className="document-status">
                        <span className="status-dot" />

                        {status}
                      </span>

                      <Icon
                        name="chevron"
                        size={16}
                        className="row-chevron"
                      />
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            /* EMPTY STATE */

            <div className="panel empty-state">
              <span className="empty-icon">
                <Icon
                  name="file"
                  size={24}
                />
              </span>

              <h3>
                No documents connected yet
              </h3>

              <p>
                Upload your first business
                document to make it available
                to DOCIQ.
              </p>

              <button
                type="button"
                className="button button-outline"
                onClick={openFilePicker}
                disabled={uploading}
              >
                <Icon name="plus" size={16} />

                Add your first document
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}