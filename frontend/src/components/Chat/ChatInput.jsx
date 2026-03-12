import { useState } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="relative group">
      {/* Glow effect behind input */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>

      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl transition-all focus-within:border-primary/30"
      >
        <button
          type="button"
          className="p-3 text-white/40 hover:text-primary transition-colors rounded-full hover:bg-white/5"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Drop a message..."
          className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm text-white placeholder:text-white/20"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-3 text-white/40 hover:text-accent transition-colors rounded-full hover:bg-white/5"
          >
            <Smile className="w-5 h-5" />
          </button>

          {message.trim() ? (
            <button
              className="p-3 genz-gradient text-white rounded-full shadow-lg shadow-primary/20 transform transition-all active:scale-90 hover:scale-105"
              type="submit"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              className="p-3 text-white/40 hover:text-secondary transition-colors rounded-full hover:bg-white/5"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
