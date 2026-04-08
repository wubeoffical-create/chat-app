import { useState, useRef, useEffect } from "react";
import { useChat } from "../../context/ChatContext";

function MessageInput() {
  const [input, setInput] = useState("");
  const { sendMessage, sendTyping } = useChat();
  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    sendTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
      sendTyping(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white/50 p-4"
    >
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white text-sm"
            rows="1"
            style={{ minHeight: "48px", maxHeight: "120px" }}
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <div className="absolute right-3 bottom-3 text-xs text-gray-400">
            <span className="hidden sm:inline">Press Enter ↵</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span className="hidden sm:inline font-medium">Send</span>
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
