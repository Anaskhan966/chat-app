import { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-base-300 bg-base-100 flex gap-2"
    >
      <input
        type="text"
        placeholder="Type your message…"
        className="input input-bordered flex-1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!message.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
