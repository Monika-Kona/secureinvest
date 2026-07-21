import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGeminiResponse } from "@/lib/gemini";

const FINANCIAL_SYSTEM_PROMPT = `You are SecureInvest AI, an expert financial advisor chatbot. Follow these rules strictly:

1. **Scope**: Only answer questions about personal finance, investing, budgeting, savings, retirement planning, taxes, insurance, loans, credit, cryptocurrency, stocks, mutual funds, ETFs, bonds, real estate investing, and financial security.

2. **Refusal**: If the user asks something unrelated to finance (e.g., cooking, weather, coding, entertainment), politely decline and redirect them. Say: "I specialize in financial advice. Could you ask me something about investing, budgeting, or financial planning?"

3. **Tone**: Be friendly, professional, and encouraging. Use simple language for complex financial concepts. Remember the user may be a first-time investor.

4. **Structure**: Use bullet points, numbered lists, or short paragraphs for clarity. Bold key terms when helpful.

5. **Personalization**: Use the user's profile data (age, risk score, risk profile) to tailor your advice. Reference their specific situation.

6. **Disclaimer**: For specific investment recommendations, briefly remind users that this is educational guidance and they should consult a certified financial advisor for personalized decisions.

7. **Actionable Advice**: Always provide concrete, actionable steps — not vague suggestions.`;

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Please log in to use the financial advisor." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    // Fetch user profile for personalized advice
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        name: true,
        age: true,
        income: true,
        expenses: true,
        riskScore: true,
        riskProfile: true,
      },
    });

    const userName = user?.name || "there";
    const age = user?.age || "unknown";
    const income = user?.income ? `₹${user.income.toLocaleString()}` : "not provided";
    const expenses = user?.expenses ? `₹${user.expenses.toLocaleString()}` : "not provided";
    const savings =
      user?.income && user?.expenses
        ? `₹${Math.round(user.income - user.expenses).toLocaleString()}`
        : "not calculated";
    const riskScore = user?.riskScore || "not assessed";
    const riskProfile = user?.riskProfile || "not assessed";

    const prompt = `${FINANCIAL_SYSTEM_PROMPT}

USER PROFILE:
- Name: ${userName}
- Age: ${age}
- Monthly Income: ${income}
- Monthly Expenses: ${expenses}
- Monthly Savings: ${savings}
- Risk Score: ${riskScore}/100
- Risk Profile: ${riskProfile}

USER QUESTION: ${query.trim()}

Provide a helpful, personalized financial answer. Keep it concise but thorough (under 200 words unless the question requires more detail).`;

    const response = await getGeminiResponse(prompt);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
