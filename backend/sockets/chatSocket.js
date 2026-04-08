const messageService = require("../services/message.service");

function setupChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // Track online users
    socket.on("user_joined", (username) => {
      socket.username = username;
      io.emit("user_online", {
        username,
        socketId: socket.id,
        onlineCount: io.engine.clientsCount,
      });
    });

    // Handle new message
    socket.on("send_message", async (data) => {
      try {
        const { username, message } = data;
        const saved = await messageService.createMessage(username, message);

        // Broadcast with full data including timestamp
        io.emit("receive_message", {
          id: saved.id,
          username: saved.username,
          message: saved.message,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Socket error:", err);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      socket.broadcast.emit("user_typing", {
        username: data.username,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      io.emit("user_offline", {
        socketId: socket.id,
        onlineCount: io.engine.clientsCount,
      });
    });
  });
}

module.exports = setupChatSocket;
