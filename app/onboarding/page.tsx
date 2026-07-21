"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [age, setAge] = useState("");
  const [goalYears, setGoalYears] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const savings = income && expenses ? Math.max(0, Number(income) - Number(expenses)) : 0;
  const savingsRate = income && Number(income) > 0 ? ((savings / Number(income)) * 100).toFixed(0) : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income: Number(income),
          expenses: Number(expenses),
          age: Number(age),
          goalYears: Number(goalYears),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to calculate risk profile");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      {/* Animated background orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="bg-orb orb-4"></div>

      <div className="onboarding-container">
        {/* Header Section */}
        <div className="onboarding-header">
          <div className="header-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h1 className="header-title">Risk Profiler</h1>
          <p className="header-subtitle">
            Tell us about your finances so our AI can craft a personalized investment strategy just for you
          </p>
        </div>

        <div className="content-grid">
          {/* Form Card */}
          <div className="form-card">
            <form onSubmit={handleSubmit} className="onboarding-form">
              {error && (
                <div className="error-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="input-group">
                <label htmlFor="income" className="input-label">
                  <span className="label-icon">💰</span>
                  Monthly Income (₹)
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="income"
                    type="number"
                    required
                    min="0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="onboarding-input"
                    placeholder="50,000"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="expenses" className="input-label">
                  <span className="label-icon">🛒</span>
                  Monthly Expenses (₹)
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">₹</span>
                  <input
                    id="expenses"
                    type="number"
                    required
                    min="0"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    className="onboarding-input"
                    placeholder="30,000"
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="age" className="input-label">
                    <span className="label-icon">🎂</span>
                    Age
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="age"
                      type="number"
                      required
                      min="18"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="onboarding-input no-prefix"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="goalYears" className="input-label">
                    <span className="label-icon">🎯</span>
                    Goal (Years)
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="goalYears"
                      type="number"
                      required
                      min="1"
                      value={goalYears}
                      onChange={(e) => setGoalYears(e.target.value)}
                      className="onboarding-input no-prefix"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
                id="riskProfileButton"
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Get My Risk Profile
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Side Panel - Live Preview & Info */}
          <div className="side-panel">
            {/* Live Savings Preview */}
            <div className="preview-card">
              <h3 className="preview-title">📊 Live Savings Preview</h3>
              <div className="savings-display">
                <div className="savings-amount">
                  ₹{savings.toLocaleString()}
                </div>
                <span className="savings-label">Monthly Savings</span>
              </div>
              <div className="savings-bar-container">
                <div className="savings-bar-track">
                  <div
                    className="savings-bar-fill"
                    style={{
                      width: `${Math.min(100, Number(savingsRate))}%`,
                      background: Number(savingsRate) >= 30
                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : Number(savingsRate) >= 15
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                          : "linear-gradient(90deg, #ef4444, #f87171)"
                    }}
                  ></div>
                </div>
                <div className="savings-rate">
                  <span>{savingsRate}% savings rate</span>
                  <span className="savings-status">
                    {Number(savingsRate) >= 30 ? "🟢 Excellent" : Number(savingsRate) >= 15 ? "🟡 Good" : "🔴 Needs work"}
                  </span>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="info-card">
              <h3 className="info-title">✨ What happens next?</h3>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-num">1</div>
                  <div>
                    <p className="step-name">AI Risk Analysis</p>
                    <p className="step-desc">We analyze your financial data using advanced algorithms</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-num">2</div>
                  <div>
                    <p className="step-name">Risk Score</p>
                    <p className="step-desc">You&apos;ll get a score from 0-100 with your risk profile</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-num">3</div>
                  <div>
                    <p className="step-name">Smart Recommendations</p>
                    <p className="step-desc">Personalized investment picks matched to your profile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .onboarding-page {
          min-height: 100vh;
          background: #050816;
          position: relative;
          overflow: hidden;
          padding: 40px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Animated Background Orbs */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: float 20s ease-in-out infinite;
          z-index: 0;
        }

        .orb-1 {
          width: 350px;
          height: 350px;
          background: #6366f1;
          top: -80px;
          left: -80px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 280px;
          height: 280px;
          background: #8b5cf6;
          bottom: -60px;
          right: -60px;
          animation-delay: -7s;
        }

        .orb-3 {
          width: 200px;
          height: 200px;
          background: #06b6d4;
          top: 40%;
          right: 20%;
          animation-delay: -14s;
        }

        .orb-4 {
          width: 180px;
          height: 180px;
          background: #ec4899;
          bottom: 30%;
          left: 15%;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(10px, -10px) scale(1.02); }
        }

        .onboarding-container {
          position: relative;
          z-index: 1;
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
        }

        /* Header */
        .onboarding-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-icon {
          width: 72px;
          height: 72px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
          border: 1px solid rgba(99, 102, 241, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #818cf8;
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.1); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.25); }
        }

        .header-title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .header-subtitle {
          font-size: 15px;
          color: #94a3b8;
          margin-top: 10px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        /* Form Card */
        .form-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
        }

        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          font-size: 13px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .input-label {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .label-icon {
          font-size: 15px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix {
          position: absolute;
          left: 16px;
          font-size: 15px;
          font-weight: 700;
          color: #64748b;
          pointer-events: none;
          z-index: 1;
        }

        .onboarding-input {
          width: 100%;
          padding: 14px 16px 14px 40px;
          border-radius: 14px;
          border: 1px solid rgba(51, 65, 85, 0.6);
          background: rgba(15, 23, 42, 0.5);
          color: #e2e8f0;
          font-size: 15px;
          font-weight: 500;
          outline: none;
          transition: all 0.25s;
        }

        .onboarding-input.no-prefix {
          padding-left: 16px;
        }

        .onboarding-input::placeholder {
          color: #475569;
          font-weight: 400;
        }

        .onboarding-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: rgba(15, 23, 42, 0.8);
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-top: 6px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Side Panel */
        .side-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Preview Card */
        .preview-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .preview-title {
          font-size: 15px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 20px;
        }

        .savings-display {
          text-align: center;
          margin-bottom: 20px;
        }

        .savings-amount {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #22c55e, #4ade80);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          transition: all 0.4s ease;
        }

        .savings-label {
          display: block;
          font-size: 13px;
          color: #64748b;
          margin-top: 6px;
        }

        .savings-bar-container {
          margin-top: 4px;
        }

        .savings-bar-track {
          width: 100%;
          height: 8px;
          border-radius: 10px;
          background: rgba(51, 65, 85, 0.5);
          overflow: hidden;
        }

        .savings-bar-fill {
          height: 100%;
          border-radius: 10px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 4px;
        }

        .savings-rate {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 12px;
          color: #94a3b8;
        }

        .savings-status {
          font-weight: 600;
        }

        /* Info Card */
        .info-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .info-title {
          font-size: 15px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 20px;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .step-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .step-num {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(99, 102, 241, 0.25);
          color: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .step-name {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 2px;
        }

        .step-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .onboarding-page {
            padding: 24px 16px;
            align-items: flex-start;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .header-title {
            font-size: 28px;
          }

          .form-card {
            padding: 28px;
          }

          .input-row {
            grid-template-columns: 1fr;
          }

          .onboarding-header {
            margin-bottom: 28px;
          }
        }
      `}</style>
    </div>
  );
}
