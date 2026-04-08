const conn = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

async function register(username, email, password) {
  // Check if user exists
  const existing = await conn.query(
    "SELECT id FROM users WHERE username = ? OR email = ?",
    [username, email],
  );

  if (existing.length > 0) {
    throw new Error("Username or email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const result = await conn.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
  );

  // Generate token
  const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    id: result.insertId,
    username,
    email,
    token,
  };
}

async function login(username, password) {
  // Find user
  const users = await conn.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, username],
  );

  if (users.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = users[0];

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    token,
  };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { register, login, verifyToken };
