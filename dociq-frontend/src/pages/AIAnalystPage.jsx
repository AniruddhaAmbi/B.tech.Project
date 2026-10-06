import { useState } from "react";
import { Icon } from "../components/Icon";

const suggestedQuestions = [
  "Why did revenue change this month?",
  "Which products are performing best?",
  "Who are my highest-value customers?",
  "What should I focus on this month?",
];

export default function AIAnalystPage() {
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    setAskedQuestion(trimmedQuestion);
    setQuestion("");
  }

  function handleSuggestion(text) {
    setQuestion(text);
  }

  return (
    <>
      <header className="page-header">
        <div className="breadcrumb">
          <span>Workspace</span>
          <Icon name="chevron" size={14} />
          <span className="breadcrumb-current">
            AI Analyst
          </span>
        </div>

        <div className="heading-row">
          <div>
            <p className="eyebrow">AI INSIGHTS</p>

            <h1>AI Analyst</h1>

            <p className="page-description">
              Ask questions about your business data and get
              clear, actionable insights.
            </p>
          </div>
        </div>
      </header>

      <div className="page-body">

        <section className="panel ai-question-panel">
          <div className="section-heading">
            <div>
              <h2>Ask DOCIQ</h2>
              <p>
                Ask a question about your business data.
              </p>
            </div>

            <span className="section-icon">
              <Icon name="sparkles" size={20} />
            </span>
          </div>

          <form
            className="ai-question-form"
            onSubmit={handleSubmit}
          >
            <Icon name="sparkles" size={19} />

            <input
              type="text"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              placeholder="Ask anything about your business data..."
              aria-label="Ask DOCIQ a question"
            />

            <button
              type="submit"
              className="button button-dark"
              disabled={!question.trim()}
            >
              Ask AI
            </button>
          </form>
        </section>

        <section
          className="panel suggested-panel"
          aria-labelledby="suggested-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="suggested-title">
                Suggested questions
              </h2>

              <p>
                Start with one of these questions.
              </p>
            </div>
          </div>

          <div className="suggested-question-grid">
            {suggestedQuestions.map((item) => (
              <button
                key={item}
                className="suggested-question"
                onClick={() => handleSuggestion(item)}
              >
                <span>{item}</span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
        </section>

        {askedQuestion && (
          <section
            className="panel answer-panel"
            aria-live="polite"
          >
            <div className="section-heading">
              <div>
                <h2>Your question</h2>

                <p>{askedQuestion}</p>
              </div>

              <span className="section-icon">
                <Icon name="sparkles" size={20} />
              </span>
            </div>

            <div className="demo-answer">
              <strong>DOCIQ is analyzing your data.</strong>

              <p>
                AI-generated business insights will appear
                here once the analysis service is connected.
              </p>
            </div>
          </section>
        )}

        <section className="panel recent-panel">
          <div className="section-heading">
            <div>
              <h2>Recent conversations</h2>

              <p>
                Your recent questions and insights will
                appear here.
              </p>
            </div>
          </div>

          <div className="empty-state compact-empty-state">
            <span className="empty-icon">
              <Icon name="sparkles" size={22} />
            </span>

            <h3>No conversations yet</h3>

            <p>
              Ask your first question to start exploring
              your business data.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}