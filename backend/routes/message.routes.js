const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

// GET - Fetch messages
router.get("/messages", messageController.getMessages);

// POST - Create message
router.post("/messages", messageController.createMessage);

module.exports = router;
