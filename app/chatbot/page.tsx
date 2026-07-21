"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "How should I start investing as a beginner?",
  "What's the 50/30/20 budgeting rule?",
  "How can I build an emergency fund?",
  "What are the best low-risk investments?",
  "How do mutual funds work?",
  "Should I invest in stocks or bonds?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (messageText?: string) => {
    const text = messageText || query;
    if (!text.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError("Please log in to use the financial advisor.");
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.error || "Something went wrong. Please try again.",
              timestamp: new Date(),
            },
          ]);
        }
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleSuggestionClick = (question: string) => {
    handleSend(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatContent = (content: string) => {
    // Convert **bold** to <strong>
    let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Convert *italic* to <em>
    formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
    // Convert bullet points
    formatted = formatted.replace(/^[•\-]\s/gm, "• ");
    return formatted;
  };

  return (
    <div className="chatbot-page">
      {/* Header */}
      <header className="chatbot-header">
        <div className="header-content">
          <Link href="/dashboard" className="back-btn" id="backToDashboard">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div className="header-info">
            <div className="header-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z" />
                <path d="M18 20c0-3.3-2.7-6-6-6s-6 2.7-6 6" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div>
              <h1 className="header-title">SecureInvest AI Advisor</h1>
              <div className="header-status">
                <span className="status-dot"></span>
                Online — Ready to help
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="chat-container">
        {/* Welcome State */}
        {messages.length === 0 && !loading && (
          <div className="welcome-section">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <h2 className="welcome-title">Your AI Financial Advisor</h2>
            <p className="welcome-desc">
              Ask me anything about investing, budgeting, savings, retirement planning, or financial security. I provide personalized advice based on your profile.
            </p>

            <div className="suggestions-grid">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  id={`suggestion-${i}`}
                  className="suggestion-card"
                  onClick={() => handleSuggestionClick(q)}
                >
                  <span className="suggestion-icon">
                    {i === 0 && "📈"}
                    {i === 1 && "💰"}
                    {i === 2 && "🛡️"}
                    {i === 3 && "🔒"}
                    {i === 4 && "📊"}
                    {i === 5 && "⚖️"}
                  </span>
                  <span className="suggestion-text">{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="messages-list">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message-wrapper ${msg.role === "user" ? "message-user" : "message-assistant"}`}
            >
              {msg.role === "assistant" && (
                <div className="avatar-ai">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
              )}
              <div className={`message-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}>
                <div
                  className="message-text"
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="message-wrapper message-assistant">
              <div className="avatar-ai">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="bubble-assistant typing-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <Link href="/login" className="error-link">Go to Login →</Link>
        </div>
      )}

      {/* Input Form */}
      <footer className="chat-footer">
        <form onSubmit={handleSubmit} className="chat-form" id="chatForm">
          <input
            ref={inputRef}
            id="chatInput"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="chat-input"
            placeholder="Ask about investing, budgeting, savings..."
            autoComplete="off"
          />
          <button
            type="submit"
            id="sendButton"
            disabled={loading || !query.trim()}
            className="send-btn"
            aria-label="Send message"
          >
            {loading ? (
              <div className="send-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>
        <p className="chat-disclaimer">
          SecureInvest AI provides educational financial guidance. Always consult a certified advisor for major decisions.
        </p>
      </footer>

      <style jsx>{`
        .chatbot-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          height: 100dvh;
          background: linear-gradient(145deg, #0a0e1a 0%, #111827 50%, #0f172a 100%);
          color: #e2e8f0;
        }

        /* Header */
        .chatbot-header {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99, 102, 241, 0.15);
          padding: 12px 20px;
          flex-shrink: 0;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .back-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          transform: scale(1.05);
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .header-title {
          font-size: 16px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }

        .header-status {
          font-size: 12px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Chat Container */
        .chat-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          scroll-behavior: smooth;
        }

        .chat-container::-webkit-scrollbar {
          width: 6px;
        }

        .chat-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-container::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 3px;
        }

        /* Welcome Section */
        .welcome-section {
          max-width: 600px;
          margin: 40px auto;
          text-align: center;
        }

        .welcome-icon {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
          border: 1px solid rgba(99, 102, 241, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #818cf8;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .welcome-desc {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          text-align: left;
        }

        .suggestion-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          border-radius: 14px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.1);
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }

        .suggestion-card:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
        }

        .suggestion-icon {
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .suggestion-text {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.4;
        }

        /* Messages */
        .messages-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-wrapper {
          display: flex;
          gap: 10px;
          animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-user {
          justify-content: flex-end;
        }

        .message-assistant {
          justify-content: flex-start;
        }

        .avatar-ai {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .message-bubble {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
        }

        .bubble-user {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          border-bottom-right-radius: 6px;
        }

        .bubble-assistant {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.1);
          color: #e2e8f0;
          border-bottom-left-radius: 6px;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.65;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .message-text :global(strong) {
          font-weight: 600;
          color: #c7d2fe;
        }

        .bubble-user .message-text :global(strong) {
          color: #e0e7ff;
        }

        .message-time {
          display: block;
          font-size: 10px;
          margin-top: 6px;
          opacity: 0.5;
        }

        /* Typing Indicator */
        .typing-bubble {
          padding: 16px 20px;
        }

        .typing-indicator {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #818cf8;
          animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingBounce {
          0%, 80%, 100% {
            transform: scale(0.7);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Error Banner */
        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border-top: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 13px;
          color: #fca5a5;
        }

        .error-link {
          color: #818cf8;
          font-weight: 600;
          text-decoration: underline;
        }

        /* Footer */
        .chat-footer {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(99, 102, 241, 0.15);
          padding: 16px 20px 12px;
          flex-shrink: 0;
        }

        .chat-form {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          background: rgba(30, 41, 59, 0.6);
          color: #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: all 0.25s;
        }

        .chat-input::placeholder {
          color: #64748b;
        }

        .chat-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: rgba(30, 41, 59, 0.8);
        }

        .chat-input:disabled {
          opacity: 0.5;
        }

        .send-btn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .send-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .chat-disclaimer {
          max-width: 800px;
          margin: 8px auto 0;
          font-size: 11px;
          color: #475569;
          text-align: center;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .suggestions-grid {
            grid-template-columns: 1fr;
          }

          .message-bubble {
            max-width: 85%;
          }

          .welcome-section {
            margin: 20px auto;
          }

          .welcome-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
