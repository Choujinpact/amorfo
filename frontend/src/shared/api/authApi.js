const AUTH_URL = "http://localhost:4000/api/auth";

async function sendAuth(endpoint, payload) {
  const response = await fetch(`${AUTH_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Ошибка авторизации");
  }
  return body;
}

export function register(payload) {
  return sendAuth("register", payload);
}

export function login(payload) {
  return sendAuth("login", payload);
}
