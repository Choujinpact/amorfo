function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getIncomeLevel(monthlyIncome) {
  if (monthlyIncome < 60000) {
    return "low";
  }
  if (monthlyIncome < 150000) {
    return "middle";
  }
  return "high";
}

function getLevelPercentRange(incomeLevel) {
  if (incomeLevel === "low") {
    return { min: 0.05, max: 0.1 };
  }
  if (incomeLevel === "middle") {
    return { min: 0.1, max: 0.2 };
  }
  return { min: 0.2, max: 0.35 };
}

function calculateRecommendation({ monthlyIncome, monthlyExpenses, targetMonths }) {
  const disposableIncome = Math.max(0, monthlyIncome - monthlyExpenses);
  const incomeLevel = getIncomeLevel(monthlyIncome);
  const { min, max } = getLevelPercentRange(incomeLevel);
  const randomPercent = randomBetween(min, max);

  const draftSavings = monthlyIncome * randomPercent;
  const safeSavings = Math.min(draftSavings, disposableIncome * 0.9);
  const suggestedMonthlySavings = Math.max(500, Math.round(safeSavings));

  return {
    monthlyIncome,
    monthlyExpenses,
    incomeLevel,
    savingsPercent: Number((randomPercent * 100).toFixed(1)),
    suggestedMonthlySavings,
    targetMonths,
    projectedCreditFund: suggestedMonthlySavings * targetMonths,
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  calculateRecommendation
};
