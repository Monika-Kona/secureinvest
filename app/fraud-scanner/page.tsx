"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface FlaggedTransaction {
  [key: string]: string;
}

interface FraudResult {
  flagged: FlaggedTransaction[];
  count: number;
  totalTransactions: number;
  mean: string;
  stdDev: string;
}

const FRAUD_TIPS = [
  {
    icon: "🔐",
    title: "Never Share OTPs",
    desc: "Banks will never ask for your OTP, CVV, or PIN via calls, SMS, or email.",
  },
  {
    icon: "📱",
    title: "Enable 2FA",
    desc: "Always enable two-factor authentication on banking and investment apps.",
  },
  {
    icon: "🔗",
    title: "Verify URLs",
    desc: "Check for HTTPS and correct domain before entering credentials on any website.",
  },
  {
    icon: "💳",
    title: "Monitor Statements",
    desc: "Review bank and card statements weekly to catch unauthorized transactions early.",
  },
  {
    icon: "📧",
    title: "Beware of Phishing",
    desc: "Don't click links in suspicious emails claiming to be from your bank or broker.",
  },
  {
    icon: "🛡️",
    title: "Use Virtual Cards",
    desc: "Use virtual/temporary card numbers for online purchases to limit exposure.",
  },
];

const COMMON_FRAUD_TYPES = [
  {
    type: "Unusual Amount",
    icon: "💰",
    color: "#ef4444",
    desc: "Transactions significantly higher than your average spending pattern",
  },
  {
    type: "Odd Timing",
    icon: "🕐",
    color: "#f59e0b",
    desc: "Transactions at unusual hours (e.g., 2-5 AM) may indicate compromised accounts",
  },
  {
    type: "Rapid Succession",
    icon: "⚡",
    color: "#8b5cf6",
    desc: "Multiple transactions in quick succession, especially to different merchants",
  },
  {
    type: "Foreign Location",
    icon: "🌍",
    color: "#3b82f6",
    desc: "Transactions from locations you've never visited or countries flagged for fraud",
  },
];

export default function FraudScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<FraudResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/fraud", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Fraud scan failed");
        return;
      }

      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      setError("Please upload a CSV file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const safePercent = result
    ? ((result.count / result.totalTransactions) * 100).toFixed(1)
    : "0";

  const cleanPercent = result
    ? (((result.totalTransactions - result.count) / result.totalTransactions) * 100).toFixed(1)
    : "0";

  return (
    <div className="fraud-page">
      <div className="fraud-container">
        {/* Header */}
        <div className="fraud-header">
          <Link href="/dashboard" className="back-link" id="backToDashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </Link>
          <div className="header-content">
            <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="header-title">Fraud Scanner</h1>
            <p className="header-subtitle">
              Upload your transaction CSV to detect anomalous and potentially fraudulent transactions using statistical analysis
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="card upload-card">
          <h2 className="card-title">
            <span className="title-icon">📁</span> Upload Transactions
          </h2>
          <form onSubmit={handleUpload}>
            {error && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div
              className={`drop-zone ${dragOver ? "drop-zone-active" : ""} ${file ? "drop-zone-has-file" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setError("");
                }}
                className="hidden-input"
              />
              {file ? (
                <div className="file-info">
                  <div className="file-icon-success">✓</div>
                  <div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    className="file-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setResult(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="drop-content">
                  <div className="drop-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="drop-text">Drag & drop your CSV file here</p>
                  <p className="drop-subtext">or click to browse</p>
                  <span className="drop-hint">Supports .csv files with an &quot;amount&quot; column</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              id="scanButton"
              disabled={!file || loading}
              className="scan-btn"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Analyzing Transactions...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Scan for Fraud
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="results-section">
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>📊</div>
                <div className="stat-value">{result.totalTransactions}</div>
                <div className="stat-label">Total Transactions</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: result.count > 0 ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: result.count > 0 ? "#ef4444" : "#22c55e" }}>
                  {result.count > 0 ? "🚨" : "✅"}
                </div>
                <div className="stat-value" style={{ color: result.count > 0 ? "#ef4444" : "#22c55e" }}>
                  {result.count}
                </div>
                <div className="stat-label">Flagged</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>✓</div>
                <div className="stat-value" style={{ color: "#22c55e" }}>{cleanPercent}%</div>
                <div className="stat-label">Clean Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>📈</div>
                <div className="stat-value">₹{parseFloat(result.mean).toLocaleString()}</div>
                <div className="stat-label">Avg Transaction</div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="card analysis-card">
              <h2 className="card-title">
                <span className="title-icon">🔬</span> Analysis Summary
              </h2>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <span className="analysis-label">Statistical Method</span>
                  <span className="analysis-value">Z-Score (2σ deviation)</span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Mean Amount</span>
                  <span className="analysis-value">₹{parseFloat(result.mean).toLocaleString()}</span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Standard Deviation</span>
                  <span className="analysis-value">₹{parseFloat(result.stdDev).toLocaleString()}</span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Anomaly Threshold</span>
                  <span className="analysis-value">
                    &gt; ₹{(parseFloat(result.mean) + 2 * parseFloat(result.stdDev)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Fraud Rate</span>
                  <span className="analysis-value" style={{ color: parseFloat(safePercent) > 5 ? "#ef4444" : "#22c55e" }}>
                    {safePercent}%
                  </span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Risk Level</span>
                  <span className="analysis-value">
                    {result.count === 0 && <span style={{ color: "#22c55e" }}>● Low</span>}
                    {result.count > 0 && result.count <= 3 && <span style={{ color: "#f59e0b" }}>● Medium</span>}
                    {result.count > 3 && <span style={{ color: "#ef4444" }}>● High</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Flagged Transactions Table */}
            {result.flagged.length > 0 ? (
              <div className="card table-card">
                <h2 className="card-title">
                  <span className="title-icon">🚨</span> Flagged Transactions
                </h2>
                <p className="card-desc">
                  These transactions deviate more than 2 standard deviations from the mean, indicating potential fraud.
                </p>
                <div className="table-wrapper">
                  <table className="fraud-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        {Object.keys(result.flagged[0]).map((key) => (
                          <th key={key}>{key === "_reason" ? "Reason" : key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.flagged.map((row, i) => (
                        <tr key={i} className="flagged-row">
                          <td className="row-number">{i + 1}</td>
                          {Object.entries(row).map(([key, val], j) => (
                            <td key={j} className={key === "_reason" ? "reason-cell" : ""}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="card safe-card">
                <div className="safe-content">
                  <div className="safe-icon">✅</div>
                  <h3 className="safe-title">All Clear!</h3>
                  <p className="safe-desc">
                    No anomalous transactions detected. All {result.totalTransactions} transactions are within normal range.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="card how-card">
          <h2 className="card-title">
            <span className="title-icon">⚙️</span> How It Works
          </h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Upload CSV</h3>
              <p className="step-desc">Upload your transaction data with an &quot;amount&quot; column</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Statistical Analysis</h3>
              <p className="step-desc">We calculate mean and standard deviation of amounts</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Anomaly Detection</h3>
              <p className="step-desc">Transactions beyond 2σ are flagged as suspicious</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h3 className="step-title">Detailed Report</h3>
              <p className="step-desc">Review flagged items with reasons and statistics</p>
            </div>
          </div>
        </div>

        {/* Common Fraud Types */}
        <div className="card">
          <h2 className="card-title">
            <span className="title-icon">🎯</span> Common Fraud Patterns We Detect
          </h2>
          <div className="fraud-types-grid">
            {COMMON_FRAUD_TYPES.map((item, i) => (
              <div key={i} className="fraud-type-card" style={{ borderLeftColor: item.color }}>
                <span className="fraud-type-icon">{item.icon}</span>
                <div>
                  <h4 className="fraud-type-title">{item.type}</h4>
                  <p className="fraud-type-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Tips */}
        <div className="card">
          <h2 className="card-title">
            <span className="title-icon">🛡️</span> Financial Security Tips
          </h2>
          <div className="tips-grid">
            {FRAUD_TIPS.map((tip, i) => (
              <div key={i} className="tip-card">
                <span className="tip-icon">{tip.icon}</span>
                <h4 className="tip-title">{tip.title}</h4>
                <p className="tip-desc">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample CSV Format */}
        <div className="card">
          <h2 className="card-title">
            <span className="title-icon">📋</span> Sample CSV Format
          </h2>
          <p className="card-desc">Your CSV should have at minimum an &quot;amount&quot; column. Here&#39;s a sample format:</p>
          <div className="sample-csv">
            <code>
              date,description,amount,category{"\n"}
              2025-01-15,Grocery Store,2500,Food{"\n"}
              2025-01-16,Online Shopping,4200,Shopping{"\n"}
              2025-01-17,ATM Withdrawal,10000,Cash{"\n"}
              2025-01-18,Restaurant,1800,Food{"\n"}
              2025-01-19,Unknown Transfer,150000,Transfer
            </code>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fraud-page {
          min-height: 100vh;
          background: linear-gradient(145deg, #0a0e1a 0%, #111827 50%, #0f172a 100%);
          padding: 32px 16px;
          color: #e2e8f0;
        }

        .fraud-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Header */
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #818cf8;
          font-weight: 500;
          text-decoration: none;
          margin-bottom: 16px;
          transition: all 0.2s;
        }

        .back-link:hover {
          color: #a5b4fc;
          transform: translateX(-3px);
        }

        .header-content {
          text-align: center;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15));
          border: 1px solid rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #f87171;
        }

        .header-title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #f1f5f9, #f87171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
        }

        .header-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin-top: 8px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }

        /* Cards */
        .card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .card-title {
          font-size: 17px;
          font-weight: 700;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .title-icon {
          font-size: 20px;
        }

        .card-desc {
          font-size: 13px;
          color: #94a3b8;
          margin-top: -8px;
          margin-bottom: 16px;
        }

        /* Error */
        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .error-icon {
          font-size: 16px;
        }

        /* Drop Zone */
        .drop-zone {
          border: 2px dashed rgba(99, 102, 241, 0.3);
          border-radius: 14px;
          padding: 40px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(15, 23, 42, 0.4);
          margin-bottom: 16px;
        }

        .drop-zone:hover,
        .drop-zone-active {
          border-color: #818cf8;
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.1);
        }

        .drop-zone-has-file {
          border-color: #22c55e;
          border-style: solid;
          background: rgba(34, 197, 94, 0.05);
          padding: 20px 24px;
        }

        .hidden-input {
          display: none;
        }

        .drop-icon {
          color: #6366f1;
          margin-bottom: 12px;
        }

        .drop-text {
          font-size: 15px;
          font-weight: 600;
          color: #e2e8f0;
        }

        .drop-subtext {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .drop-hint {
          display: inline-block;
          margin-top: 12px;
          font-size: 11px;
          color: #475569;
          background: rgba(51, 65, 85, 0.5);
          padding: 4px 12px;
          border-radius: 20px;
        }

        /* File Info */
        .file-info {
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
        }

        .file-icon-success {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .file-name {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
        }

        .file-size {
          font-size: 12px;
          color: #64748b;
        }

        .file-remove {
          margin-left: auto;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
        }

        .file-remove:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* Scan Button */
        .scan-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ef4444, #f97316);
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
        }

        .scan-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
        }

        .scan-btn:disabled {
          opacity: 0.4;
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

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .stat-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 14px;
          padding: 18px;
          text-align: center;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
          font-size: 18px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #f1f5f9;
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Analysis Card */
        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .analysis-item {
          background: rgba(15, 23, 42, 0.4);
          padding: 14px;
          border-radius: 10px;
          border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .analysis-label {
          display: block;
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .analysis-value {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
        }

        /* Table */
        .table-card {
          border-left: 4px solid #ef4444;
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .fraud-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .fraud-table th {
          background: rgba(15, 23, 42, 0.6);
          padding: 10px 14px;
          text-align: left;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .fraud-table td {
          padding: 10px 14px;
          border-top: 1px solid rgba(51, 65, 85, 0.3);
          color: #cbd5e1;
        }

        .flagged-row {
          transition: background 0.2s;
        }

        .flagged-row:hover {
          background: rgba(239, 68, 68, 0.05);
        }

        .row-number {
          color: #64748b;
          font-weight: 600;
          width: 40px;
        }

        .reason-cell {
          color: #fca5a5;
          font-size: 12px;
          max-width: 300px;
        }

        /* Safe Card */
        .safe-card {
          border-left: 4px solid #22c55e;
        }

        .safe-content {
          text-align: center;
          padding: 20px 0;
        }

        .safe-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .safe-title {
          font-size: 20px;
          font-weight: 700;
          color: #22c55e;
          margin-bottom: 6px;
        }

        .safe-desc {
          font-size: 14px;
          color: #94a3b8;
        }

        /* How It Works Steps */
        .steps-grid {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .step {
          flex: 1;
          text-align: center;
        }

        .step-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          margin: 0 auto 10px;
        }

        .step-title {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 4px;
        }

        .step-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        .step-arrow {
          color: #475569;
          font-size: 18px;
          margin-top: 6px;
          flex-shrink: 0;
        }

        /* Fraud Types */
        .fraud-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .fraud-type-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-left: 3px solid;
        }

        .fraud-type-icon {
          font-size: 22px;
          flex-shrink: 0;
        }

        .fraud-type-title {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 4px;
        }

        .fraud-type-desc {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* Tips */
        .tips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .tip-card {
          padding: 18px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(51, 65, 85, 0.4);
          text-align: center;
          transition: all 0.25s;
        }

        .tip-card:hover {
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
        }

        .tip-icon {
          font-size: 28px;
          display: block;
          margin-bottom: 10px;
        }

        .tip-title {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 6px;
        }

        .tip-desc {
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* Sample CSV */
        .sample-csv {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 10px;
          padding: 16px 20px;
          overflow-x: auto;
        }

        .sample-csv code {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #a5b4fc;
          white-space: pre;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .analysis-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .steps-grid {
            flex-direction: column;
            align-items: center;
          }

          .step-arrow {
            transform: rotate(90deg);
          }

          .fraud-types-grid,
          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
