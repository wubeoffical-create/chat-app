import { createContext, useContext, useState, useEffect, useRef } from "react";
import socket from "../sockets/socket";
import { getMessages } from "../services/api";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Get username from localStorage (set during login)
  const [username, setUsername] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.username || "Guest";
    }
    return "Guest";
  });

  // Load message history
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await getMessages();
      setMessages(res.data.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // Socket connection
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("user_joined", username);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_online", (data) => {
      setOnlineCount(data.onlineCount);
    });

    socket.on("user_offline", (data) => {
      setOnlineCount(data.onlineCount);
    });

    socket.on("user_typing", (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => [...new Set([...prev, data.username])]);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== data.username));
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message");
      socket.off("user_online");
      socket.off("user_offline");
      socket.off("user_typing");
    };
  }, [username]);

  const sendMessage = (message) => {
    if (message.trim()) {
      socket.emit("send_message", { username, message });
    }
  };

  const sendTyping = (isTyping) => {
    socket.emit("typing", { username, isTyping });
  };

  const updateUsername = (newUsername) => {
    setUsername(newUsername);
    // Also update in localStorage user object
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.username = newUsername;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        username,
        setUsername: updateUsername,
        sendMessage,
        sendTyping,
        onlineCount,
        typingUsers,
        isConnected,
        loadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
