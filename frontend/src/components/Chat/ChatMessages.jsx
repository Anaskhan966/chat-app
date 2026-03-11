import { useEffect, useRef } from "react";

const ChatMessages = ({ messages = [], currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-base-content/50 mt-10">
          No messages yet. Start a conversation!
        </div>
      ) : (
        messages.map((msg) => {
          // sender can be an object (populated) or a string (just ID from new message)
          const senderId =
            typeof msg.sender === "object" ? msg.sender._id : msg.sender;
          const isMe = senderId === currentUser?._id;

          return (
            <div
              key={msg._id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div
                className={`chat-bubble ${isMe ? "chat-bubble-primary" : ""}`}
              >
                {msg.content}
              </div>
              <div className="chat-footer opacity-50 text-xs mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
