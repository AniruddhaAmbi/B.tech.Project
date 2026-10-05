import React, { useState } from "react";
import { Icon } from "../components/Icon";
import { askQuestion } from "../services/api";

export function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");
  const [asking, setAsking] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setAsking(true);
    setError("");
    setAnswer(null);
    try {
      setAnswer(await askQuestion(trimmedQuestion));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAsking(false);
    }
  }

  return (
    <>
      <header className="page-header">
        <div className="breadcrumb">
          <span>Workspace</span>
          <Icon name="chevron" size={14} />
          <span className="breadcrumb-current">Ask a question</span>
        </div>
        <div className="heading-row">
          <div>
            <p className="eyebrow">DOCUMENT Q&A</p>
            <h1>Ask a question</h1>
            <p className="page-description">
              Get an answer grounded in the documents in your knowledge base.
            </p>
          </div>
        </div>
      </header>
      <div className="page-body ask-body">
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        <section className="panel ask-panel">
          <span className="section-icon"><Icon name="spark" /></span>
          <h2>What would you like to know?</h2>
          <p>Answers depend on the sources available in your workspace.</p>
          <form className="ask-form" onSubmit={handleSubmit}>
            <label htmlFor="question-input">Your question</label>
            <textarea
              id="question-input"
              placeholder="Ask about a policy, process, or detail in your documents…"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
            />
            <div className="ask-form-footer">
              <span>Responses are based on your connected documents.</span>
              <button className="button button-primary" disabled={asking || !question.trim()}>
                <Icon name="send" size={16} />
                {asking ? "Finding an answer…" : "Ask"}
              </button>
            </div>
          </form>
          {answer && (
            <div className="answer-block" aria-live="polite">
              <h3>Answer</h3>
              <p>{typeof answer === "string" ? answer : answer.answer}</p>
              {Array.isArray(answer.citations) && answer.citations.length > 0 && (
                <div className="citations">
                  <h4>Sources</h4>
                  {answer.citations.map((citation, index) => (
                    <div className="citation-row" key={citation.id ?? index}>
                      <Icon name="file" size={15} />
                      <span>{citation.title ?? citation.filename ?? "Source document"}</span>
                      {citation.page != null && <span>Page {citation.page}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
