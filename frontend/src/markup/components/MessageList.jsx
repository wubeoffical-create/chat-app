import { useEffect, useRef } from "react";
import Message from "./Message";
import { useChat } from "../../context/ChatContext";

function MessageList() {
  const { messages, typingUsers, onlineCount, isConnected } = useChat();
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative">
      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          ></div>
          <span className="text-xs text-gray-600">
            {onlineCount} {onlineCount === 1 ? "user" : "users"} online
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {isConnected ? "Connected" : "Reconnecting..."}
        </span>
      </div>

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Be the first to say hello! 👋
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <Message
                key={i}
                username={msg.username}
                message={msg.message}
                timestamp={msg.created_at}
              />
            ))}
          </>
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-gray-500 text-sm animate-pulse">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.length} people are typing...`}
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default MessageList;
