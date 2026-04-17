export function RecommendationCard({ recommendation }) {
  if (!recommendation) {
    return null;
  }

  return (
    <section className="card">
      <h2>Твоя мотивационная рекомендация</h2>
      <p>
        Уровень дохода: <strong>{recommendation.incomeLevel}</strong>
      </p>
      <p>
        Рекомендуется откладывать:{" "}
        <strong>{recommendation.suggestedMonthlySavings.toLocaleString("ru-RU")} руб.</strong>{" "}
        в месяц
      </p>
      <p>
        Процент от дохода: <strong>{recommendation.savingsPercent}%</strong>
      </p>
      <p>
        За {recommendation.targetMonths} мес. можно накопить:{" "}
        <strong>{recommendation.projectedCreditFund.toLocaleString("ru-RU")} руб.</strong>
      </p>
    </section>
  );
}

export function HistoryList({ items }) {
  if (!items.length) {
    return (
      <section className="card">
        <h2>История расчетов</h2>
        <p>Пока пусто. Сделай первый расчет.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Последние расчеты</h2>
      <ul className="history-list">
        {items.map((item) => (
          <li key={item.id}>
            {new Date(item.created_at || item.createdAt).toLocaleDateString("ru-RU")} -{" "}
            {Number(item.suggested_monthly_savings || item.suggestedMonthlySavings).toLocaleString("ru-RU")} руб./мес
          </li>
        ))}
      </ul>
    </section>
  );
}
