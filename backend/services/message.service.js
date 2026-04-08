const conn = require("../config/db.config");

async function getMessages(limit = 50) {
  const sql = "SELECT * FROM messages ORDER BY created_at ASC LIMIT ?";
  const rows = await conn.query(sql, [limit]);
  return rows;
}

async function createMessage(username, message) {
  const sql = "INSERT INTO messages (username, message) VALUES (?, ?)";
  const result = await conn.query(sql, [username, message]);
  return { id: result.insertId, username, message };
}

async function getMessageById(id) {
  const sql = "SELECT * FROM messages WHERE id = ?";
  const rows = await conn.query(sql, [id]);
  return rows[0];
}

async function deleteMessage(id) {
  const sql = "DELETE FROM messages WHERE id = ?";
  const result = await conn.query(sql, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getMessages,
  createMessage,
  getMessageById,
  deleteMessage,
};
