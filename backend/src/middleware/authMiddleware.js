const { getUserByToken } = require("../authStore");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const user = getUserByToken(token);
  if (!user) {
    res.status(401).json({ message: "Сессия истекла. Войдите снова" });
    return;
  }

  req.user = user;
  next();
}

module.exports = { authMiddleware };
