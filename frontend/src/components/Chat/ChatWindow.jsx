import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Info, MoreVertical, Phone, Video } from "lucide-react";

const ChatWindow = ({
  onSendMessage,
  onRetryMessage,
  selectedUser,
  messages,
  currentUser,
}) => {
  return (
    <main className="flex-1 flex flex-col bg-transparent">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {selectedUser && (
            <div className="relative">
              <img
                className="size-10 rounded-xl object-cover border-2 border-primary/20"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                alt={selectedUser.name}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-white/90">
              {selectedUser ? selectedUser.name : "Select a vibe"}
            </h2>
            <p className="text-[10px] text-primary font-medium tracking-widest uppercase">
              {selectedUser ? "Online" : "Waiting for connection"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-white/40 hover:text-primary transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/40 hover:text-primary transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ChatMessages
          messages={messages}
          currentUser={currentUser}
          onRetry={onRetryMessage}
        />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-transparent">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </main>
  );
};

export default ChatWindow;
