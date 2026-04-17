import { useState } from "react";

export function AuthForm({ onLogin, onRegister, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(event, action) {
    event.preventDefault();
    action({ email, password });
  }

  return (
    <form className="card form">
      <h1>Вход в личный кабинет</h1>
      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Пароль
        <input
          type="password"
          minLength={6}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <div className="actions">
        <button disabled={loading} onClick={(event) => submit(event, onLogin)}>
          Войти
        </button>
        <button
          type="button"
          disabled={loading}
          className="secondary"
          onClick={(event) => submit(event, onRegister)}
        >
          Регистрация
        </button>
      </div>
    </form>
  );
}
