"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/onboarding");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Left Panel - Branding */}
      <div className="brand-panel">
        <div className="brand-content">
          <div className="brand-logo">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="brand-name">SecureInvest AI</h1>
          <p className="brand-tagline">Smart investing powered by artificial intelligence</p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h3 className="feature-title">AI-Powered Insights</h3>
                <p className="feature-desc">Personalized investment recommendations based on your risk profile</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div>
                <h3 className="feature-title">Fraud Detection</h3>
                <p className="feature-desc">Advanced anomaly detection to protect your transactions</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <div>
                <h3 className="feature-title">Financial Advisor</h3>
                <p className="feature-desc">24/7 AI chatbot for all your financial queries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="form-panel">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              <label htmlFor="email" className="input-label">Email address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="loginButton"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="footer-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          display: flex;
          min-height: 100vh;
          background: #050816;
          position: relative;
          overflow: hidden;
        }

        /* Animated Background Orbs */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
          z-index: 0;
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
          bottom: -50px;
          right: -50px;
          animation-delay: -7s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: #ec4899;
          top: 50%;
          left: 40%;
          animation-delay: -14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(10px, -10px) scale(1.02); }
        }

        /* Brand Panel */
        .brand-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
          z-index: 1;
        }

        .brand-content {
          max-width: 420px;
        }

        .brand-logo {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
        }

        .brand-name {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #e2e8f0, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .brand-tagline {
          font-size: 15px;
          color: #94a3b8;
          margin-top: 8px;
          line-height: 1.5;
        }

        .features-list {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .feature-icon {
          font-size: 24px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feature-title {
          font-size: 14px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 2px;
        }

        .feature-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Form Panel */
        .form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
          z-index: 1;
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .form-title {
          font-size: 24px;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }

        .form-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin-top: 6px;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          gap: 6px;
        }

        .input-label {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #475569;
          pointer-events: none;
          z-index: 1;
        }

        .auth-input {
          width: 100%;
          padding: 13px 14px 13px 44px;
          border-radius: 12px;
          border: 1px solid rgba(51, 65, 85, 0.6);
          background: rgba(15, 23, 42, 0.5);
          color: #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: all 0.25s;
        }

        .auth-input::placeholder {
          color: #475569;
        }

        .auth-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: rgba(15, 23, 42, 0.8);
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 4px;
          display: flex;
          transition: color 0.2s;
        }

        .toggle-password:hover {
          color: #94a3b8;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
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
          margin-top: 4px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
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

        /* Footer */
        .form-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #64748b;
        }

        .footer-link {
          color: #818cf8;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #a5b4fc;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .auth-page {
            flex-direction: column;
          }

          .brand-panel {
            padding: 32px 24px 0;
          }

          .features-list {
            display: none;
          }

          .brand-name {
            font-size: 28px;
          }

          .form-panel {
            padding: 24px;
          }

          .form-container {
            padding: 28px;
          }
        }
      `}</style>
    </div>
  );
}
