const express = require("express");
const cors = require("cors");
const recommendationRoutes = require("./routes/recommendationRoutes");
const authRoutes = require("./routes/authRoutes");
require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recommendation", recommendationRoutes);

app.listen(PORT, () => {
  console.log(`Backend started on http://localhost:${PORT}`);
});
