// auth-utils.js — password hashing + simple in-memory session tokens
const crypto = require('node:crypto');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPassword(password, salt, hash) {
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(check), Buffer.from(hash));
}

// token -> userId, kept in memory (fine for a demo; resets on server restart)
const sessions = new Map();

function createToken(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, userId);
  return token;
}

function getUserIdFromToken(token) {
  return sessions.get(token) || null;
}

module.exports = { hashPassword, verifyPassword, createToken, getUserIdFromToken };
