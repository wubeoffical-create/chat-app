import { useChat } from "../../context/ChatContext";

function Message({ username, message, timestamp }) {
  const { username: currentUser } = useChat();
  const isOwnMessage = username === currentUser;

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
        {!isOwnMessage && (
          <span className="text-xs font-medium text-gray-500 ml-2">
            {username}
          </span>
        )}
        <div
          className={`mt-1 px-4 py-2 rounded-2xl shadow-sm ${
            isOwnMessage
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <span className="text-[10px] text-gray-400 mt-1 block px-2">
          {formatTime(timestamp)}
        </span>
      </div>

      {isOwnMessage && (
        <div className="order-3 ml-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {!isOwnMessage && (
        <div className="order-1 mr-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;
