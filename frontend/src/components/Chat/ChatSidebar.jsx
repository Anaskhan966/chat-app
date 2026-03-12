import { Plus, Search } from "lucide-react";

const ChatSidebar = ({
  users,
  onAddUser,
  onSelectUser,
  selectedUser,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <aside className="w-80 bg-white/5 flex flex-col relative border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold tracking-tight text-white/90">
            Chats
          </h3>
          <button
            onClick={onAddUser}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-primary transition-all active:scale-90"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search vibes..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {users && users.length > 0 ? (
          users.map((user) => (
            <li
              className={`flex gap-3 items-center p-3 rounded-2xl cursor-pointer transition-all duration-300 group ${
                selectedUser?._id === user._id
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10"
                  : "hover:bg-white/5 border border-transparent"
              }`}
              key={user._id || user.id}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                <img
                  className="size-12 rounded-2xl object-cover border-2 border-white/5 group-hover:border-primary/50 transition-colors"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                    {user.name || "User"}
                  </div>
                  {user.lastMessageTime && (
                    <div className="text-[10px] text-white/40 font-medium">
                      {new Date(user.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
                <div className="text-xs text-white/50 truncate group-hover:text-white/70 transition-colors">
                  {user.lastMessage || "Start the vibe..."}
                </div>
              </div>
            </li>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <p className="text-white/30 text-sm mb-4">No vibes found yet.</p>
            <button
              onClick={onAddUser}
              className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
            >
              Start New Chat
            </button>
          </div>
        )}
      </ul>
    </aside>
  );
};

export default ChatSidebar;
