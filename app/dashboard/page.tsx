"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InvestmentOption {
  name: string;
  category: string;
  returns: string;
  risk: string;
  minInvestment: string;
  description: string;
  link: string;
  platform: string;
}

interface RecommendationData {
  profile: string;
  score: number;
  picks: string[];
  investments: InvestmentOption[];
  explanation: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBotTooltip, setShowBotTooltip] = useState(false);
  const [botPulse, setBotPulse] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/recommend");
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Failed to load recommendations");
          return;
        }

        setData(json);
      } catch {
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();

    // Show bot tooltip after 3 seconds
    const tooltipTimer = setTimeout(() => {
      setShowBotTooltip(true);
    }, 3000);

    // Hide tooltip after 8 seconds
    const hideTimer = setTimeout(() => {
      setShowBotTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const getRiskColor = (risk: string) => {
    if (risk.includes("Zero") || risk.includes("Very Low")) return "#22c55e";
    if (risk.includes("Low")) return "#4ade80";
    if (risk.includes("Moderate-High")) return "#f59e0b";
    if (risk.includes("Moderate")) return "#3b82f6";
    if (risk.includes("Very High")) return "#ef4444";
    if (risk.includes("High")) return "#f97316";
    return "#6b7280";
  };

  const getProfileTheme = (profile: string) => {
    if (profile === "Conservative")
      return {
        gradient: "linear-gradient(135deg, #22c55e, #4ade80)",
        bg: "rgba(34, 197, 94, 0.1)",
        border: "rgba(34, 197, 94, 0.25)",
        text: "#4ade80",
        glow: "rgba(34, 197, 94, 0.3)",
      };
    if (profile === "Moderate")
      return {
        gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)",
        bg: "rgba(59, 130, 246, 0.1)",
        border: "rgba(59, 130, 246, 0.25)",
        text: "#60a5fa",
        glow: "rgba(59, 130, 246, 0.3)",
      };
    if (profile === "Aggressive")
      return {
        gradient: "linear-gradient(135deg, #ef4444, #f97316)",
        bg: "rgba(239, 68, 68, 0.1)",
        border: "rgba(239, 68, 68, 0.25)",
        text: "#f87171",
        glow: "rgba(239, 68, 68, 0.3)",
      };
    return {
      gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
      bg: "rgba(99, 102, 241, 0.1)",
      border: "rgba(99, 102, 241, 0.25)",
      text: "#818cf8",
      glow: "rgba(99, 102, 241, 0.3)",
    };
  };

  const scorePercent = data?.score ? (data.score / 100) * 283 : 0;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="loading-state">
          <div className="loading-robot">
            <div className="robot-head">
              <div className="robot-eye left-eye"></div>
              <div className="robot-eye right-eye"></div>
            </div>
            <div className="robot-body"></div>
          </div>
          <p className="loading-text">Preparing your dashboard...</p>
          <div className="loading-bar">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="error-state">
          <div className="error-icon-wrap">⚠️</div>
          <p className="error-text">{error}</p>
          <Link href="/onboarding" className="error-cta" id="errorCta">
            Complete Risk Assessment →
          </Link>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  const theme = getProfileTheme(data?.profile || "");

  return (
    <div className="dashboard-page">
      {/* Animated background */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="dashboard-container">
        {/* Header */}
        <header className="dash-header">
          <div className="header-left">
            <div className="header-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h1 className="dash-title">Dashboard</h1>
              <p className="dash-subtitle">Your personalized investment insights</p>
            </div>
          </div>
          <Link href="/onboarding" className="header-action" id="retakeAssessment">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Retake Assessment
          </Link>
        </header>

        {/* Stats Row */}
        <div className="stats-row">
          {/* Risk Score Card with SVG Ring */}
          <div className="stat-card score-card">
            <div className="score-ring-wrap">
              <svg className="score-ring" viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="45" />
                <circle
                  className="ring-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDasharray: `${scorePercent} 283`,
                    stroke: theme.text,
                    filter: `drop-shadow(0 0 6px ${theme.glow})`,
                  }}
                />
              </svg>
              <div className="score-inner">
                <span className="score-number">{data?.score}</span>
                <span className="score-of">/100</span>
              </div>
            </div>
            <div className="score-label-text">Risk Score</div>
          </div>

          {/* Profile Card */}
          <div className="stat-card profile-card">
            <div className="profile-badge-wrap">
              <span
                className="profile-badge"
                style={{ background: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}
              >
                {data?.profile === "Conservative" && "🛡️"}
                {data?.profile === "Moderate" && "⚖️"}
                {data?.profile === "Aggressive" && "🚀"}
                {" "}{data?.profile}
              </span>
            </div>
            <p className="profile-desc">
              {data?.profile === "Conservative" && "Capital protection with steady, predictable returns."}
              {data?.profile === "Moderate" && "Balanced growth with reasonable risk management."}
              {data?.profile === "Aggressive" && "Maximum growth potential, embracing market volatility."}
            </p>
            <div className="profile-label">Risk Profile</div>
          </div>

          {/* Quick Categories */}
          <div className="stat-card categories-card">
            <div className="categories-title">Investment Mix</div>
            <div className="categories-list">
              {data?.picks.map((pick, i) => (
                <span key={i} className="category-tag">
                  {pick}
                </span>
              ))}
            </div>
            <div className="profile-label">Categories</div>
          </div>
        </div>

        {/* AI Strategy Card */}
        <div className="card ai-card">
          <div className="ai-header">
            <div className="ai-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">AI Investment Strategy</h2>
              <p className="ai-subtitle">Personalized by SecureInvest AI</p>
            </div>
          </div>
          <div className="ai-content">
            {data?.explanation}
          </div>
        </div>

        {/* Investments Section */}
        <div className="investments-section">
          <div className="section-header">
            <h2 className="section-title">💎 Recommended Investments</h2>
            <p className="section-desc">
              Curated picks for your <span style={{ color: theme.text, fontWeight: 600 }}>{data?.profile?.toLowerCase()}</span> profile
            </p>
          </div>

          <div className="investments-grid">
            {data?.investments.map((inv, index) => (
              <a
                key={index}
                href={inv.link}
                target="_blank"
                rel="noopener noreferrer"
                className="investment-card"
                id={`investment-${index}`}
              >
                <div className="inv-top">
                  <div className="inv-name-group">
                    <h3 className="inv-name">{inv.name}</h3>
                    <span className="inv-category">{inv.category}</span>
                  </div>
                  <div className="inv-returns-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    <span>{inv.returns}</span>
                  </div>
                </div>

                <p className="inv-description">{inv.description}</p>

                <div className="inv-bottom">
                  <div className="inv-meta">
                    <span className="inv-risk-dot" style={{ background: getRiskColor(inv.risk) }}></span>
                    <span className="inv-risk-text">{inv.risk} Risk</span>
                    <span className="inv-divider">•</span>
                    <span className="inv-min-text">Min: {inv.minInvestment}</span>
                  </div>
                  <div className="inv-platform-link">
                    {inv.platform}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="quick-nav">
          <Link href="/fraud-scanner" className="qnav-card" id="navFraudScanner">
            <div className="qnav-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="qnav-info">
              <span className="qnav-label">Fraud Scanner</span>
              <span className="qnav-desc">Detect suspicious transactions</span>
            </div>
            <div className="qnav-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
          <Link href="/chatbot" className="qnav-card" id="navChatbot">
            <div className="qnav-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="qnav-info">
              <span className="qnav-label">AI Financial Advisor</span>
              <span className="qnav-desc">Get personalized guidance</span>
            </div>
            <div className="qnav-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* ============================================= */}
      {/* FLOATING AI ROBOT ASSISTANT (Amazon-style)    */}
      {/* ============================================= */}
      <div className="ai-bot-container">
        {/* Speech Bubble Tooltip */}
        {showBotTooltip && (
          <div className="bot-tooltip" onClick={() => router.push("/chatbot")}>
            <p className="tooltip-text">👋 Hi! Need help with your investments? Ask me anything!</p>
            <button
              className="tooltip-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowBotTooltip(false);
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Robot Button */}
        <button
          className={`ai-bot-btn ${botPulse ? "bot-pulse" : ""}`}
          onClick={() => {
            setBotPulse(false);
            router.push("/chatbot");
          }}
          onMouseEnter={() => setShowBotTooltip(true)}
          onMouseLeave={() => setShowBotTooltip(false)}
          id="aiRobotAssistant"
          aria-label="Open AI Assistant"
        >
          <div className="bot-face">
            <div className="bot-eye bot-eye-left"></div>
            <div className="bot-eye bot-eye-right"></div>
            <div className="bot-mouth"></div>
          </div>
          <div className="bot-antenna">
            <div className="antenna-ball"></div>
          </div>
        </button>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  .dashboard-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #050816 0%, #0f172a 50%, #0a0e1a 100%);
    padding: 32px 16px 100px;
    position: relative;
    overflow-x: hidden;
  }

  /* Animated Background Orbs */
  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.2;
    animation: float 20s ease-in-out infinite;
    z-index: 0;
    pointer-events: none;
  }

  .orb-1 {
    width: 400px;
    height: 400px;
    background: #6366f1;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 300px;
    height: 300px;
    background: #8b5cf6;
    bottom: 200px;
    right: -80px;
    animation-delay: -7s;
  }

  .orb-3 {
    width: 250px;
    height: 250px;
    background: #06b6d4;
    top: 50%;
    left: 30%;
    animation-delay: -14s;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -30px) scale(1.05); }
    50% { transform: translate(-20px, 20px) scale(0.95); }
    75% { transform: translate(10px, -10px) scale(1.02); }
  }

  /* Loading State */
  .loading-state {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: #94a3b8;
    position: relative;
    z-index: 1;
  }

  .loading-robot {
    position: relative;
    animation: bot-bounce 1.5s ease-in-out infinite;
  }

  .robot-head {
    width: 60px;
    height: 50px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: relative;
    margin-bottom: 4px;
  }

  .robot-eye {
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    animation: blink 2.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }

  .robot-body {
    width: 44px;
    height: 24px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border-radius: 0 0 12px 12px;
    margin: 0 auto;
  }

  @keyframes bot-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .loading-text {
    font-size: 15px;
    font-weight: 500;
  }

  .loading-bar {
    width: 200px;
    height: 4px;
    border-radius: 4px;
    background: rgba(99, 102, 241, 0.15);
    overflow: hidden;
  }

  .loading-bar-fill {
    width: 40%;
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    animation: loading-slide 1.2s ease-in-out infinite;
  }

  @keyframes loading-slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(350%); }
  }

  /* Error State */
  .error-state {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: #94a3b8;
    position: relative;
    z-index: 1;
  }

  .error-icon-wrap {
    font-size: 48px;
  }

  .error-text {
    color: #f87171;
    font-weight: 600;
    font-size: 16px;
  }

  .error-cta {
    color: #818cf8;
    font-weight: 600;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 12px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    transition: all 0.25s;
  }

  .error-cta:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
  }

  /* Container */
  .dashboard-container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: relative;
    z-index: 1;
  }

  /* Header */
  .dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-logo {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
  }

  .dash-title {
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #f1f5f9, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.03em;
    line-height: 1.2;
  }

  .dash-subtitle {
    color: #64748b;
    font-size: 13px;
    margin-top: 2px;
  }

  .header-action {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #818cf8;
    font-weight: 600;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 10px;
    background: rgba(99, 102, 241, 0.08);
    border: 1px solid rgba(99, 102, 241, 0.15);
    transition: all 0.25s;
  }

  .header-action:hover {
    background: rgba(99, 102, 241, 0.15);
    transform: translateY(-1px);
  }

  /* Stats Row */
  .stats-row {
    display: grid;
    grid-template-columns: 200px 1fr 1fr;
    gap: 18px;
  }

  .stat-card {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.12);
    border-radius: 20px;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  /* Score Card */
  .score-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .score-ring-wrap {
    position: relative;
    width: 110px;
    height: 110px;
  }

  .score-ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .ring-bg {
    fill: none;
    stroke: rgba(99, 102, 241, 0.1);
    stroke-width: 6;
  }

  .ring-fill {
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .score-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .score-number {
    font-size: 36px;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1;
  }

  .score-of {
    display: block;
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }

  .score-label-text {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  /* Profile Card */
  .profile-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .profile-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    width: fit-content;
  }

  .profile-desc {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.5;
    flex: 1;
  }

  .profile-label {
    font-size: 11px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    margin-top: auto;
  }

  /* Categories Card */
  .categories-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .categories-title {
    font-size: 14px;
    font-weight: 700;
    color: #e2e8f0;
  }

  .categories-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
  }

  .category-tag {
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 20px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: #a5b4fc;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Cards */
  .card {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 28px;
    border: 1px solid rgba(99, 102, 241, 0.12);
  }

  .card-title {
    font-size: 17px;
    font-weight: 700;
    color: #f1f5f9;
  }

  /* AI Strategy Card */
  .ai-card {
    border-left: 3px solid #6366f1;
    position: relative;
    overflow: hidden;
  }

  .ai-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.03), transparent);
    pointer-events: none;
  }

  .ai-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
    position: relative;
  }

  .ai-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
    border: 1px solid rgba(99, 102, 241, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #818cf8;
    animation: slow-spin 8s linear infinite;
  }

  @keyframes slow-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .ai-subtitle {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }

  .ai-content {
    font-size: 14px;
    color: #cbd5e1;
    line-height: 1.75;
    white-space: pre-line;
    position: relative;
  }

  /* Investments Section */
  .investments-section {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  .section-title {
    font-size: 20px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }

  .section-desc {
    font-size: 13px;
    color: #64748b;
  }

  .investments-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .investment-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid rgba(99, 102, 241, 0.1);
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    text-decoration: none;
    color: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .investment-card:hover {
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.12);
    transform: translateY(-4px);
    background: rgba(30, 41, 59, 0.7);
  }

  .inv-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .inv-name-group {
    flex: 1;
    min-width: 0;
  }

  .inv-name {
    font-size: 14px;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1.3;
  }

  .inv-category {
    display: inline-block;
    margin-top: 5px;
    font-size: 10px;
    color: #818cf8;
    background: rgba(99, 102, 241, 0.1);
    padding: 3px 10px;
    border-radius: 6px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .inv-returns-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 700;
    color: #4ade80;
    background: rgba(34, 197, 94, 0.1);
    padding: 4px 10px;
    border-radius: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .inv-description {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.55;
    flex: 1;
    margin-bottom: 14px;
  }

  .inv-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(99, 102, 241, 0.08);
    padding-top: 12px;
  }

  .inv-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
  }

  .inv-risk-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .inv-risk-text {
    color: #94a3b8;
    font-weight: 500;
  }

  .inv-divider {
    color: #334155;
  }

  .inv-min-text {
    color: #64748b;
  }

  .inv-platform-link {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #818cf8;
    font-weight: 600;
    transition: color 0.2s;
  }

  .investment-card:hover .inv-platform-link {
    color: #a5b4fc;
  }

  /* Quick Navigation */
  .quick-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .qnav-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.1);
    text-decoration: none;
    color: #f1f5f9;
    transition: all 0.3s;
  }

  .qnav-card:hover {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.1);
    transform: translateY(-3px);
  }

  .qnav-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .qnav-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .qnav-label {
    font-size: 14px;
    font-weight: 700;
  }

  .qnav-desc {
    font-size: 12px;
    color: #64748b;
  }

  .qnav-arrow {
    color: #475569;
    transition: all 0.25s;
  }

  .qnav-card:hover .qnav-arrow {
    color: #818cf8;
    transform: translateX(3px);
  }

  /* =============================== */
  /* FLOATING AI ROBOT ASSISTANT     */
  /* =============================== */
  .ai-bot-container {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  /* Tooltip Speech Bubble */
  .bot-tooltip {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 16px;
    padding: 14px 18px;
    max-width: 260px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    animation: tooltip-slide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }

  .bot-tooltip:hover {
    border-color: rgba(99, 102, 241, 0.4);
  }

  .bot-tooltip::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 28px;
    width: 16px;
    height: 16px;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  @keyframes tooltip-slide {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .tooltip-text {
    font-size: 13px;
    color: #e2e8f0;
    line-height: 1.5;
    margin-right: 20px;
  }

  .tooltip-close {
    position: absolute;
    top: 8px;
    right: 10px;
    background: none;
    border: none;
    color: #475569;
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
    transition: color 0.2s;
  }

  .tooltip-close:hover {
    color: #94a3b8;
  }

  /* Robot Button */
  .ai-bot-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #7c3aed, #8b5cf6);
    border: 2px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 8px 30px rgba(99, 102, 241, 0.4),
      0 0 0 0 rgba(99, 102, 241, 0.3);
    overflow: visible;
  }

  .ai-bot-btn:hover {
    transform: scale(1.12);
    box-shadow:
      0 12px 40px rgba(99, 102, 241, 0.5),
      0 0 0 8px rgba(99, 102, 241, 0.08);
  }

  .ai-bot-btn:active {
    transform: scale(1.05);
  }

  /* Pulse Animation */
  .bot-pulse {
    animation: bot-ring-pulse 2.5s ease-in-out infinite;
  }

  @keyframes bot-ring-pulse {
    0% {
      box-shadow:
        0 8px 30px rgba(99, 102, 241, 0.4),
        0 0 0 0 rgba(99, 102, 241, 0.3);
    }
    50% {
      box-shadow:
        0 8px 30px rgba(99, 102, 241, 0.4),
        0 0 0 14px rgba(99, 102, 241, 0);
    }
    100% {
      box-shadow:
        0 8px 30px rgba(99, 102, 241, 0.4),
        0 0 0 0 rgba(99, 102, 241, 0.3);
    }
  }

  /* Robot Face */
  .bot-face {
    width: 36px;
    height: 28px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    flex-wrap: wrap;
  }

  .bot-eye {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
    animation: bot-blink 3s ease-in-out infinite;
  }

  .bot-eye-left { animation-delay: 0s; }
  .bot-eye-right { animation-delay: 0.1s; }

  @keyframes bot-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }

  .bot-mouth {
    width: 14px;
    height: 4px;
    border-radius: 0 0 8px 8px;
    background: rgba(255, 255, 255, 0.6);
    position: absolute;
    bottom: 3px;
  }

  /* Antenna */
  .bot-antenna {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 10px;
    background: rgba(255, 255, 255, 0.4);
  }

  .antenna-ball {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fbbf24;
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
    animation: antenna-glow 2s ease-in-out infinite;
  }

  @keyframes antenna-glow {
    0%, 100% { box-shadow: 0 0 6px rgba(251, 191, 36, 0.4); opacity: 0.8; }
    50% { box-shadow: 0 0 14px rgba(251, 191, 36, 0.8); opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .stats-row {
      grid-template-columns: 1fr;
    }

    .score-card {
      flex-direction: row;
      gap: 20px;
    }

    .investments-grid {
      grid-template-columns: 1fr;
    }

    .quick-nav {
      grid-template-columns: 1fr;
    }

    .dash-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .section-header {
      flex-direction: column;
      gap: 4px;
    }

    .ai-bot-container {
      bottom: 20px;
      right: 20px;
    }

    .ai-bot-btn {
      width: 56px;
      height: 56px;
    }
  }
`;
