import { useEffect, useState } from "react";
import { CreditMotivationForm } from "../../widgets/credit-motivation-form/CreditMotivationForm";
import { RecommendationCard, HistoryList } from "../../entities/recommendation/ui";
import {
  createRecommendation,
  fetchHistory,
  getExportUrl
} from "../../shared/api/recommendationApi";
import { AuthForm } from "../../widgets/auth-form/AuthForm";
import { login, register } from "../../shared/api/authApi";

export function MainPage() {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || "");
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("auth_user") || "null")
  );
  const [recommendation, setRecommendation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    if (!token) {
      setHistory([]);
      return;
    }

    try {
      const data = await fetchHistory(token);
      setHistory(data);
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => {
    loadHistory();
  }, [token]);

  async function handleCalculate(payload) {
    setLoading(true);
    setError("");
    try {
      const data = await createRecommendation(payload, token);
      setRecommendation(data);
      await loadHistory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function saveSession(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
  }

  async function handleLogin(payload) {
    setLoading(true);
    setError("");
    try {
      const data = await login(payload);
      saveSession(data);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(payload) {
    setLoading(true);
    setError("");
    try {
      const data = await register(payload);
      saveSession(data);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    setRecommendation(null);
    setHistory([]);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  async function exportData(type) {
    if (!token) {
      return;
    }
    const response = await fetch(getExportUrl(type), {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      setError("Не удалось скачать экспорт");
      return;
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `credit-history.${type}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <main className="layout">
      {!token ? (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
      ) : (
        <section className="card">
          <p>
            Пользователь: <strong>{user?.email}</strong>
          </p>
          <div className="actions">
            <button onClick={() => exportData("json")}>Экспорт JSON</button>
            <button onClick={() => exportData("csv")}>Экспорт CSV</button>
            <button className="secondary" onClick={logout}>
              Выйти
            </button>
          </div>
        </section>
      )}
      {token && <CreditMotivationForm onSubmit={handleCalculate} loading={loading} />}
      {error && <p className="error">{error}</p>}
      {token && <RecommendationCard recommendation={recommendation} />}
      {token && <HistoryList items={history} />}
    </main>
  );
}
