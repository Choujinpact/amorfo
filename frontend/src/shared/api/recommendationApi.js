const API_URL = "http://localhost:4000/api/recommendation";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createRecommendation(payload, token) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token)
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Ошибка создания рекомендации");
  }

  return response.json();
}

export async function fetchHistory(token) {
  const response = await fetch(`${API_URL}/history`, {
    headers: authHeaders(token)
  });
  if (!response.ok) {
    throw new Error("Ошибка получения истории");
  }
  return response.json();
}

export function getExportUrl(type) {
  return `${API_URL}/export/${type}`;
}
