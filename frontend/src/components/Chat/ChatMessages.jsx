const ChatMessages = () => (
  <div className="flex-1 overflow-y-auto p-6 space-y-4">
    <div className="chat chat-start">
      <div className="chat-bubble">Hello! 👋</div>
    </div>
    <div className="chat chat-end">
      <div className="chat-bubble chat-bubble-primary">Hi there!</div>
    </div>
  </div>
);

export default ChatMessages;
