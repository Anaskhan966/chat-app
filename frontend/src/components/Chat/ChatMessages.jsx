import { useEffect, useRef } from "react";

const ChatMessages = ({ messages = [], currentUser, onRetry }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="size-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center animate-pulse">
            <span className="text-4xl text-primary">✨</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white/80 tracking-tight">
              Vibe check passed!
            </h3>
            <p className="text-sm text-white/40">
              Say something cool to start the convo.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const senderId =
            typeof msg.sender === "object" ? msg.sender._id : msg.sender;
          const isMe = senderId === currentUser?._id;

          const showTimestamp =
            idx === 0 ||
            new Date(msg.timestamp) - new Date(messages[idx - 1].timestamp) >
              300000; // 5 mins gap

          return (
            <div key={msg._id} className="space-y-1">
              {showTimestamp && (
                <div className="flex justify-center my-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-3 py-1 rounded-full border border-white/5">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}

              <div
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"} items-end gap-2 group`}
              >
                {!isMe && (
                  <img
                    className="size-6 rounded-lg opacity-40 group-hover:opacity-100 transition-opacity"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${typeof msg.sender === "object" ? msg.sender.name : "other"}`}
                    alt="avatar"
                  />
                )}

                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`px-5 py-3 text-sm font-medium ${
                      isMe ? "chat-bubble-genz-me" : "chat-bubble-genz-them"
                    } ${msg.status === "error" ? "ring-2 ring-error/50 ring-offset-2 ring-offset-black" : ""} ${
                      msg.status === "sending"
                        ? "animate-pulse brightness-90"
                        : ""
                    } shadow-xl transform transition-transform active:scale-[0.98] hover:shadow-primary/5`}
                  >
                    {msg.content}
                  </div>

                  {isMe &&
                    (msg.status === "sending" || msg.status === "error") && (
                      <div className="flex justify-end mt-1 px-1">
                        {msg.status === "sending" ? (
                          <div className="flex gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onRetry(msg)}
                            className="text-[10px] font-bold text-error uppercase hover:underline"
                          >
                            Retry Send
                          </button>
                        )}
                      </div>
                    )}
                </div>
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
