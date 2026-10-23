import { useState } from "react";
import { Icon } from "../components/Icon";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const suggestions = [
    "What are my best-selling products?",
    "How is my revenue performing?",
    "Which customers are most valuable?",
    "Show me important trends in my data",
  ];

  function askQuestion(text = question) {
    const cleanQuestion = text.trim();

    if (!cleanQuestion) return;

    setMessages((current) => [
      ...current,
      {
        type: "user",
        text: cleanQuestion,
      },
      {
        type: "ai",
        text: "I'm analyzing your business data. AI insights will appear here once the data connection is enabled.",
      },
    ]);

    setQuestion("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    askQuestion();
  }

  return (
    <section className="analyst-page">
      <div className="analyst-header">
        <div>
          <p className="page-eyebrow">INTELLIGENCE</p>

          <h1>AI Analyst</h1>

          <p>
            Ask questions about your business data and get clear,
            actionable insights.
          </p>
        </div>
      </div>

      <div className="analyst-card">
        {messages.length === 0 ? (
          <div className="analyst-empty">
            <div className="analyst-ai-icon">
              <Icon name="sparkles" size={24} />
            </div>

            <h2>What would you like to know?</h2>

            <p>
              Ask DOCIQ anything about your business data.
            </p>

            <div className="analyst-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => askQuestion(suggestion)}
                >
                  <span>{suggestion}</span>
                  <Icon name="arrow" size={15} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="analyst-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`analyst-message ${message.type}`}
              >
                <div className="message-avatar">
                  {message.type === "ai" ? (
                    <Icon name="sparkles" size={17} />
                  ) : (
                    "U"
                  )}
                </div>

                <div className="message-content">
                  <span className="message-label">
                    {message.type === "ai" ? "DOCIQ" : "You"}
                  </span>

                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form
          className="analyst-input-area"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask anything about your business data..."
          />

          <button
            type="submit"
            className="analyst-send"
            aria-label="Send question"
          >
            <Icon name="send" size={18} />
          </button>
        </form>
      </div>
    </section>
  );
} 