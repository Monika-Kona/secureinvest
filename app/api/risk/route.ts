import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRiskScore } from "@/lib/risk-engine";

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { income, expenses, age, goalYears } = body;

    if (
      income === undefined ||
      expenses === undefined ||
      age === undefined ||
      goalYears === undefined
    ) {
      return NextResponse.json(
        { error: "Income, expenses, age, and goalYears are required" },
        { status: 400 }
      );
    }

    const { score, profile } = calculateRiskScore({
      income: Number(income),
      expenses: Number(expenses),
      age: Number(age),
      goalYears: Number(goalYears),
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        income: Number(income),
        expenses: Number(expenses),
        age: Number(age),
        riskScore: score,
        riskProfile: profile,
      },
    });

    return NextResponse.json({ score, profile }, { status: 200 });
  } catch (error) {
    console.error("Risk calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
