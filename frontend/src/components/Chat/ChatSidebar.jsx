import { Plus } from "lucide-react";

const ChatSidebar = ({ users, onAddUser, onSelectUser, selectedUser }) => {
  return (
    <aside className="w-80 bg-base-100 border-r border-base-300 flex flex-col relative">
      <div className="p-4 border-b border-base-300">
        <h3 className="text-lg font-bold">Users in Chat Room</h3>
      </div>
      <ul className="flex-1 overflow-y-auto p-4 space-y-2">
        {users && users.length > 0 ? (
          users.map((user) => (
            <li
              className={`flex gap-2 items-center p-2 rounded-lg cursor-pointer hover:bg-base-200 transition-colors ${
                selectedUser?._id === user._id ? "bg-base-300" : ""
              }`}
              key={user._id || user.id}
              onClick={() => onSelectUser(user)}
            >
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                alt={user.name}
              />
              <div className="flex-1">
                <div className="font-medium">{user.name || "User"}</div>
                <div className="text-xs opacity-60 truncate">
                  Latest message...
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-base-content/50 p-4">No users found.</li>
        )}
      </ul>
      <button
        onClick={onAddUser}
        className="btn btn-primary btn-circle absolute bottom-4 right-4 shadow-lg"
        title="Start New Chat"
      >
        <Plus className="w-5 h-5" />
      </button>
    </aside>
  );
};

export default ChatSidebar;
