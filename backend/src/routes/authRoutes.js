const express = require("express");
const { createUser, findUserByEmail } = require("../repositories/userRepository");
const { hashPassword, verifyPassword, createToken } = require("../services/authService");
const { setToken } = require("../authStore");

const router = express.Router();

router.post("/register", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password || password.length < 6) {
    res.status(400).json({ message: "Email и пароль (минимум 6 символов) обязательны" });
    return;
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      res.status(409).json({ message: "Пользователь уже существует" });
      return;
    }

    const user = await createUser({
      email,
      passwordHash: hashPassword(password)
    });

    const token = createToken();
    setToken(token, { id: user.id, email: user.email });
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Ошибка регистрации" });
  }
});

router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    res.status(400).json({ message: "Введите email и пароль" });
    return;
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ message: "Неверный email или пароль" });
      return;
    }

    const token = createToken();
    const normalizedUser = { id: user.id, email: user.email };
    setToken(token, normalizedUser);
    res.json({ token, user: normalizedUser });
  } catch (error) {
    res.status(500).json({ message: "Ошибка входа" });
  }
});

module.exports = router;
