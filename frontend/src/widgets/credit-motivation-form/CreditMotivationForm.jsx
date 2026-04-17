import { useState } from "react";

export function CreditMotivationForm({ onSubmit, loading }) {
  const [formState, setFormState] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    targetMonths: "12"
  });

  function updateField(event) {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      monthlyIncome: Number(formState.monthlyIncome),
      monthlyExpenses: Number(formState.monthlyExpenses),
      targetMonths: Number(formState.targetMonths)
    });
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h1>Курсовая: мотивация к кредитной цели</h1>
      <label>
        Доход в месяц (руб.)
        <input
          type="number"
          name="monthlyIncome"
          min="1"
          required
          value={formState.monthlyIncome}
          onChange={updateField}
        />
      </label>
      <label>
        Расходы в месяц (руб.)
        <input
          type="number"
          name="monthlyExpenses"
          min="0"
          required
          value={formState.monthlyExpenses}
          onChange={updateField}
        />
      </label>
      <label>
        Срок накопления (месяцев)
        <input
          type="number"
          name="targetMonths"
          min="1"
          required
          value={formState.targetMonths}
          onChange={updateField}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Расчет..." : "Показать сумму для откладывания"}
      </button>
    </form>
  );
}
