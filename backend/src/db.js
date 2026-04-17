const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "..", "credit_motivation.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recommendation_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 0,
      monthly_income REAL NOT NULL,
      monthly_expenses REAL NOT NULL,
      income_level TEXT NOT NULL,
      suggested_monthly_savings REAL NOT NULL,
      target_months INTEGER NOT NULL,
      projected_credit_fund REAL NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  db.all("PRAGMA table_info(recommendation_history)", (error, columns = []) => {
    if (error) {
      return;
    }

    const hasUserId = columns.some((column) => column.name === "user_id");
    if (!hasUserId) {
      db.run(
        "ALTER TABLE recommendation_history ADD COLUMN user_id INTEGER NOT NULL DEFAULT 0"
      );
    }
  });
});

module.exports = db;
