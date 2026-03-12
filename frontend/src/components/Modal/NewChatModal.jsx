import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Search, X, UserPlus, Loader2 } from "lucide-react";

const NewChatModal = ({
  isOpen,
  onClose,
  onUserCreated,
  existingUsers = [],
  currentUser,
}) => {
  const { getToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(null); // Track which user is being added

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm.trim());
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performSearch = async (term) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users?search=${encodeURIComponent(term)}`,
      );

      if (response.ok) {
        const users = await response.json();
        const filteredUsers = users.filter(
          (user) =>
            user._id !== currentUser?._id &&
            !existingUsers.some((existing) => existing._id === user._id),
        );
        setSearchResults(filteredUsers);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim());
    }
  };

  const handleSelectUser = async (user) => {
    if (!currentUser || isAdding) return;

    setIsAdding(user._id);
    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/api/users/${currentUser._id}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ contactId: user._id }),
        },
      );

      if (response.ok) {
        onUserCreated(user);
        handleClose();
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    } finally {
      setIsAdding(null);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsAdding(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-neutral border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              Find Squad
            </h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative mb-6 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name or @handle"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {searchResults.length > 0
              ? searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="size-12 rounded-xl border border-white/10"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-primary transition-colors">
                          {user.name}
                        </div>
                        <div className="text-xs text-white/40 tracking-wider">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectUser(user)}
                      disabled={isAdding === user._id}
                      className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding === user._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <UserPlus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))
              : searchTerm &&
                !isLoading && (
                  <div className="py-12 text-center">
                    <div className="text-4xl mb-4 text-white/30">🛸</div>
                    <p className="text-white/40 font-medium italic">
                      No vibe found at this frequency.
                    </p>
                  </div>
                )}
          </div>
        </div>

        {!searchTerm && (
          <div className="p-8 text-center bg-white/[0.02] border-t border-white/5">
            <p className="text-sm text-white/30 italic">
              Search for your friends to start vibing together.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewChatModal;
