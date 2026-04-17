const express = require("express");
const { calculateRecommendation } = require("../services/recommendationService");
const {
  saveRecommendation,
  getRecentRecommendations,
  getAllRecommendations
} = require("../repositories/recommendationRepository");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

router.post("/", async (req, res) => {
  const monthlyIncome = Number(req.body.monthlyIncome);
  const monthlyExpenses = Number(req.body.monthlyExpenses);
  const targetMonths = Number(req.body.targetMonths ?? 12);

  if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
    res.status(400).json({ message: "Некорректный ежемесячный доход" });
    return;
  }

  if (!Number.isFinite(monthlyExpenses) || monthlyExpenses < 0) {
    res.status(400).json({ message: "Некорректные ежемесячные расходы" });
    return;
  }

  if (!Number.isFinite(targetMonths) || targetMonths <= 0) {
    res.status(400).json({ message: "Некорректный срок накопления" });
    return;
  }

  try {
    const recommendation = calculateRecommendation({
      monthlyIncome,
      monthlyExpenses,
      targetMonths
    });

    const saved = await saveRecommendation({
      ...recommendation,
      userId: req.user.id
    });
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Не удалось сохранить рекомендацию" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await getRecentRecommendations(req.user.id, 10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Не удалось получить историю" });
  }
});

router.get("/export/json", async (req, res) => {
  try {
    const items = await getAllRecommendations(req.user.id);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="credit-history-${req.user.id}.json"`
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Не удалось экспортировать JSON" });
  }
});

router.get("/export/csv", async (req, res) => {
  try {
    const items = await getAllRecommendations(req.user.id);
    const header = [
      "id",
      "monthly_income",
      "monthly_expenses",
      "income_level",
      "suggested_monthly_savings",
      "target_months",
      "projected_credit_fund",
      "created_at"
    ];
    const lines = items.map((row) =>
      [
        row.id,
        row.monthly_income,
        row.monthly_expenses,
        row.income_level,
        row.suggested_monthly_savings,
        row.target_months,
        row.projected_credit_fund,
        row.created_at
      ].join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="credit-history-${req.user.id}.csv"`
    );
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Не удалось экспортировать CSV" });
  }
});

module.exports = router;
