import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatWindow = ({ onSendMessage, selectedUser }) => {
  return (
    <main className="flex-1 flex flex-col">
      <div className="p-4 border-b border-base-300 bg-base-100 flex items-center">
        <h2 className="text-xl font-semibold">
          {selectedUser ? `Chat with ${selectedUser.name}` : "Chat Room"}
        </h2>
      </div>
      <ChatMessages />
      <ChatInput onSendMessage={onSendMessage} />
    </main>
  );
};

export default ChatWindow;
