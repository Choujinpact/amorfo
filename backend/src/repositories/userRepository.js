const db = require("../db");

function createUser({ email, passwordHash }) {
  const query = `
    INSERT INTO users (email, password_hash, created_at)
    VALUES (?, ?, ?)
  `;
  const createdAt = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.run(query, [email, passwordHash, createdAt], function onInsert(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ id: this.lastID, email, createdAt });
    });
  });
}

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, email, password_hash FROM users WHERE email = ?",
      [email],
      (error, row) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(row || null);
      }
    );
  });
}

module.exports = {
  createUser,
  findUserByEmail
};
