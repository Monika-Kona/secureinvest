import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGeminiResponse } from "@/lib/gemini";

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

const INVESTMENT_DATA: Record<string, InvestmentOption[]> = {
  Conservative: [
    {
      name: "SBI Fixed Deposit",
      category: "Fixed Deposits",
      returns: "6.5% - 7.1% p.a.",
      risk: "Very Low",
      minInvestment: "₹1,000",
      description: "Guaranteed returns with capital protection. Ideal for risk-averse investors seeking stable income.",
      link: "https://sbi.co.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits",
      platform: "SBI",
    },
    {
      name: "HDFC Corporate Bond Fund",
      category: "Debt Funds",
      returns: "7.2% - 8.5% p.a.",
      risk: "Low",
      minInvestment: "₹5,000",
      description: "Invests in high-quality corporate bonds. Better returns than FDs with moderate liquidity.",
      link: "https://www.hdfcfund.com/mutual-fund/debt-funds/hdfc-corporate-bond-fund",
      platform: "HDFC Mutual Fund",
    },
    {
      name: "RBI Floating Rate Savings Bond",
      category: "Government Bonds",
      returns: "8.05% p.a. (floating)",
      risk: "Zero (Govt. Backed)",
      minInvestment: "₹1,000",
      description: "Government-backed bonds with sovereign guarantee. Interest rate linked to NSC and revised every 6 months.",
      link: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11913",
      platform: "RBI / Banks",
    },
    {
      name: "ICICI Prudential Savings Fund",
      category: "Debt Funds",
      returns: "6.8% - 7.5% p.a.",
      risk: "Low",
      minInvestment: "₹5,000 (SIP: ₹1,000)",
      description: "Ultra-short duration debt fund for parking surplus money with better returns than savings account.",
      link: "https://www.groww.in/mutual-funds/icici-prudential-savings-fund-direct-plan-growth",
      platform: "Groww",
    },
    {
      name: "Post Office Monthly Income Scheme",
      category: "Government Bonds",
      returns: "7.4% p.a.",
      risk: "Zero (Govt. Backed)",
      minInvestment: "₹1,000",
      description: "Monthly interest payout scheme backed by Government of India. Max investment ₹9 lakh (single) / ₹15 lakh (joint).",
      link: "https://www.indiapost.gov.in/Financial/pages/content/post-office-saving-schemes.aspx",
      platform: "India Post",
    },
  ],
  Moderate: [
    {
      name: "UTI Nifty 50 Index Fund",
      category: "Index Funds",
      returns: "12% - 14% p.a. (5yr avg)",
      risk: "Moderate",
      minInvestment: "₹500 (SIP)",
      description: "Tracks the Nifty 50 index with ultra-low expense ratio of 0.18%. Perfect entry point for equity investing.",
      link: "https://www.groww.in/mutual-funds/uti-nifty-50-index-fund-direct-plan-growth",
      platform: "Groww",
    },
    {
      name: "HDFC Gold ETF",
      category: "Gold ETFs",
      returns: "10% - 15% p.a. (5yr avg)",
      risk: "Moderate",
      minInvestment: "₹500 (1 unit)",
      description: "Invest in 99.5% pure gold electronically. No storage hassles, high liquidity on stock exchange.",
      link: "https://www.groww.in/etf/hdfc-gold-exchange-traded-fund",
      platform: "Groww",
    },
    {
      name: "ICICI Prudential Equity & Debt Fund",
      category: "Hybrid Mutual Funds",
      returns: "13% - 16% p.a. (5yr avg)",
      risk: "Moderate",
      minInvestment: "₹500 (SIP)",
      description: "Balanced mix of 65-80% equity + 20-35% debt. Tax-efficient with equity taxation benefits.",
      link: "https://www.groww.in/mutual-funds/icici-prudential-equity-debt-fund-direct-plan-growth",
      platform: "Groww",
    },
    {
      name: "Nippon India Gold Savings Fund",
      category: "Gold ETFs",
      returns: "11% - 14% p.a. (5yr avg)",
      risk: "Moderate",
      minInvestment: "₹100 (SIP)",
      description: "Fund-of-fund investing in gold ETF. Start SIP from just ₹100 without needing a demat account.",
      link: "https://www.groww.in/mutual-funds/nippon-india-gold-savings-fund-direct-growth",
      platform: "Groww",
    },
    {
      name: "Parag Parikh Flexi Cap Fund",
      category: "Index Funds",
      returns: "16% - 20% p.a. (5yr avg)",
      risk: "Moderate-High",
      minInvestment: "₹1,000 (SIP)",
      description: "India's most popular flexi cap fund with global diversification. Invests in Indian + international stocks.",
      link: "https://www.groww.in/mutual-funds/parag-parikh-flexi-cap-fund-direct-plan-growth",
      platform: "Groww",
    },
    {
      name: "Sovereign Gold Bond (SGB)",
      category: "Gold ETFs",
      returns: "2.5% interest + gold price appreciation",
      risk: "Low",
      minInvestment: "1 gram (~₹7,500)",
      description: "Government-backed gold bond with 2.5% annual interest on top of gold price gains. 8-year tenure with exit at 5th year.",
      link: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=109",
      platform: "RBI / Banks",
    },
  ],
  Aggressive: [
    {
      name: "Mirae Asset Large Cap Fund",
      category: "Equity Mutual Funds",
      returns: "15% - 18% p.a. (5yr avg)",
      risk: "High",
      minInvestment: "₹500 (SIP)",
      description: "Top-performing large cap fund investing in India's blue-chip companies like TCS, Reliance, HDFC Bank.",
      link: "https://www.groww.in/mutual-funds/mirae-asset-large-cap-fund-direct-growth",
      platform: "Groww",
    },
    {
      name: "Quant Small Cap Fund",
      category: "Equity Mutual Funds",
      returns: "25% - 40% p.a. (5yr avg)",
      risk: "Very High",
      minInvestment: "₹500 (SIP)",
      description: "Aggressive small-cap fund with exceptional historical returns. High volatility but massive growth potential.",
      link: "https://www.groww.in/mutual-funds/quant-small-cap-fund-direct-plan-growth",
      platform: "Groww",
    },
    {
      name: "Motilal Oswal Nasdaq 100 ETF",
      category: "International ETFs",
      returns: "18% - 25% p.a. (5yr avg)",
      risk: "High",
      minInvestment: "₹500 (1 unit)",
      description: "Invest in top US tech giants — Apple, Google, Microsoft, Amazon, Meta. Dollar-denominated diversification.",
      link: "https://www.groww.in/etf/motilal-oswal-nasdaq-100-etf",
      platform: "Groww",
    },
    {
      name: "Reliance Industries (RELIANCE)",
      category: "Stocks",
      returns: "15% - 22% p.a. (5yr avg)",
      risk: "High",
      minInvestment: "~₹2,800 (1 share)",
      description: "India's largest conglomerate spanning telecom (Jio), retail, oil & gas, and digital services.",
      link: "https://www.moneycontrol.com/india/stockpricequote/refineries/relianceindustries/RI",
      platform: "Moneycontrol",
    },
    {
      name: "Tata Digital India Fund",
      category: "Equity Mutual Funds",
      returns: "20% - 30% p.a. (5yr avg)",
      risk: "High",
      minInvestment: "₹500 (SIP)",
      description: "Focused on India's booming IT & digital sector — TCS, Infosys, Wipro, HCL Tech, and more.",
      link: "https://www.groww.in/mutual-funds/tata-digital-india-fund-direct-growth",
      platform: "Groww",
    },
    {
      name: "HDFC Nifty50 Equal Weight Index Fund",
      category: "Stocks",
      returns: "13% - 17% p.a. (5yr avg)",
      risk: "Moderate-High",
      minInvestment: "₹500 (SIP)",
      description: "Equal weight Nifty 50 index avoids concentration risk. Each stock gets equal allocation for balanced exposure.",
      link: "https://www.groww.in/mutual-funds/hdfc-nifty50-equal-weight-index-fund-direct-growth",
      platform: "Groww",
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        age: true,
        income: true,
        expenses: true,
        riskProfile: true,
        riskScore: true,
      },
    });

    if (!user || !user.riskProfile) {
      return NextResponse.json(
        { error: "Please complete the risk assessment first" },
        { status: 400 }
      );
    }

    const investments = INVESTMENT_DATA[user.riskProfile] || INVESTMENT_DATA["Moderate"];
    const picks = investments.map((inv) => inv.category);
    const uniqueCategories = [...new Set(picks)];

    const savings =
      user.income && user.expenses
        ? Math.round(user.income - user.expenses)
        : 0;

    const fundNames = investments.map((inv) => inv.name).join(", ");

    const prompt = `You are a certified financial advisor for SecureInvest AI. The user has been shown these specific investments: ${fundNames}.

USER PROFILE:
- Age: ${user.age} years old
- Monthly Savings: ₹${savings.toLocaleString()}
- Risk Score: ${user.riskScore}/100
- Risk Profile: ${user.riskProfile}

Give a brief 80-100 word strategy summary:
1. How to split their ₹${savings.toLocaleString()} monthly SIP across these investments
2. One key tip based on their age and risk profile

RULES:
- Do NOT list or repeat fund names — the user can already see them
- Focus on allocation percentages and strategy
- Use a confident, encouraging tone
- Add a one-line disclaimer at the end`;

    const explanation = await getGeminiResponse(prompt);

    return NextResponse.json(
      {
        profile: user.riskProfile,
        score: user.riskScore,
        picks: uniqueCategories,
        investments,
        explanation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
