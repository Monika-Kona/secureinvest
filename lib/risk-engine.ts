export interface RiskInput {
  income: number;
  expenses: number;
  age: number;
  goalYears: number;
}

export interface RiskResult {
  score: number;
  profile: string;
}

export function calculateRiskScore(input: RiskInput): RiskResult {
  const { income, expenses, age, goalYears } = input;

  let score = 50;

  // Savings Rate Factor
  const savingsRate = income > 0 ? (income - expenses) / income : 0;
  if (savingsRate > 0.4) {
    score += 20;
  } else if (savingsRate > 0.2) {
    score += 10;
  } else {
    score -= 10;
  }

  // Age Factor
  if (age < 30) {
    score += 15;
  } else if (age < 45) {
    score += 5;
  } else {
    score -= 10;
  }

  // Goal Years Factor
  if (goalYears > 10) {
    score += 15;
  } else if (goalYears > 5) {
    score += 5;
  } else {
    score -= 10;
  }

  // Clamp between 0 and 100
  score = Math.min(100, Math.max(0, score));

  const profile = getRiskProfile(score);

  return { score, profile };
}

export function getRiskProfile(score: number): string {
  if (score < 35) return "Conservative";
  if (score <= 65) return "Moderate";
  return "Aggressive";
}
