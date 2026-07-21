import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "CSV file is required" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.trim().split("\n");

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV must have a header row and at least one data row" },
        { status: 400 }
      );
    }

    // Skip header row, parse all rows
    const header = lines[0].split(",").map((h) => h.trim());
    const rows: Record<string, string>[] = [];
    const amounts: number[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      header.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      rows.push(row);

      // Try to find an amount column
      const amountValue =
        row["amount"] || row["Amount"] || row["AMOUNT"] || row["value"] || row["Value"];
      if (amountValue) {
        const parsed = parseFloat(amountValue);
        if (!isNaN(parsed)) {
          amounts.push(parsed);
        }
      }
    }

    if (amounts.length === 0) {
      return NextResponse.json(
        { error: "No valid amount column found in CSV. Expected column named 'amount' or 'Amount'." },
        { status: 400 }
      );
    }

    // Calculate mean and standard deviation
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance =
      amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      amounts.length;
    const stdDev = Math.sqrt(variance);

    // Flag transactions > 2 standard deviations from mean
    const flagged: { row: Record<string, string>; amount: number; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const amountValue =
        rows[i]["amount"] || rows[i]["Amount"] || rows[i]["AMOUNT"] || rows[i]["value"] || rows[i]["Value"];
      const amount = parseFloat(amountValue);

      if (!isNaN(amount) && Math.abs(amount - mean) > 2 * stdDev) {
        const reason = `Amount ${amount} deviates ${Math.abs(amount - mean).toFixed(2)} from mean ${mean.toFixed(2)} (> 2σ = ${(2 * stdDev).toFixed(2)})`;
        flagged.push({ row: rows[i], amount, reason });

        // Save to FraudLog
        await prisma.fraudLog.create({
          data: {
            userId: session.userId,
            transactionData: JSON.stringify(rows[i]),
            reason,
          },
        });
      }
    }

    return NextResponse.json(
      {
        flagged: flagged.map((f) => ({ ...f.row, _reason: f.reason })),
        count: flagged.length,
        totalTransactions: rows.length,
        mean: mean.toFixed(2),
        stdDev: stdDev.toFixed(2),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fraud scan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
