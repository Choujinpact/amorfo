const db = require("../db");

function saveRecommendation(entry) {
  const query = `
    INSERT INTO recommendation_history (
      user_id,
      monthly_income,
      monthly_expenses,
      income_level,
      suggested_monthly_savings,
      target_months,
      projected_credit_fund,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    entry.userId,
    entry.monthlyIncome,
    entry.monthlyExpenses,
    entry.incomeLevel,
    entry.suggestedMonthlySavings,
    entry.targetMonths,
    entry.projectedCreditFund,
    entry.createdAt
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, function onInsert(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ id: this.lastID, ...entry });
    });
  });
}

function getRecentRecommendations(userId, limit = 10) {
  const query = `
    SELECT *
    FROM recommendation_history
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT ?
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [userId, limit], (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

function getAllRecommendations(userId) {
  const query = `
    SELECT *
    FROM recommendation_history
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [userId], (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

module.exports = {
  saveRecommendation,
  getRecentRecommendations,
  getAllRecommendations
};
