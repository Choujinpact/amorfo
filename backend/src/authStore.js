const tokenToUser = new Map();

function setToken(token, user) {
  tokenToUser.set(token, user);
}

function getUserByToken(token) {
  return tokenToUser.get(token) || null;
}

module.exports = {
  setToken,
  getUserByToken
};
