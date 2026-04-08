const messageService = require("../services/message.service");

async function getMessages(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const messages = await messageService.getMessages(limit);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function createMessage(req, res) {
  try {
    const { username, message } = req.body;

    if (!username || !message) {
      return res.status(400).json({
        success: false,
        error: "Username and message are required",
      });
    }

    const result = await messageService.createMessage(username, message);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const deleted = await messageService.deleteMessage(id);

    if (deleted) {
      res.json({ success: true, message: "Message deleted" });
    } else {
      res.status(404).json({ success: false, error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getMessages, createMessage, deleteMessage };
