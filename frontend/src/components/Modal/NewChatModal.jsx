import React, { useState } from "react";

import { useAuth } from "@clerk/clerk-react";

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users?search=${encodeURIComponent(
          searchTerm.trim(),
        )}`,
      );

      if (response.ok) {
        const users = await response.json();
        // Filter out users who are already in existingUsers list
        const filteredUsers = users.filter(
          (user) =>
            !existingUsers.some((existing) => existing._id === user._id),
        );
        setSearchResults(filteredUsers);
      } else {
        alert("Failed to search users");
      }
    } catch (error) {
      console.error("Error searching users:", error);
      alert("Failed to connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = async (user) => {
    if (!currentUser) return;

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
        setSearchTerm("");
        setSearchResults([]);
        onClose();
      } else {
        alert("Failed to add contact");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Failed to connect to the server");
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="new-chat-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add New Contact</h3>
          <form onSubmit={handleSearch}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Search by Username or Email</span>
              </label>
              <div className="join">
                <input
                  type="text"
                  placeholder="johndoe or john@example.com"
                  className="input input-bordered w-full join-item"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className={`btn btn-primary join-item ${
                    isLoading ? "loading" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "" : "Search"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4 max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              <ul className="menu bg-base-200 w-full rounded-box">
                {searchResults.map((user) => (
                  <li key={user._id}>
                    <button onClick={() => handleSelectUser(user)}>
                      <div className="flex flex-col items-start">
                        <span className="font-bold">{user.name}</span>
                        <span className="text-sm opacity-70">
                          @{user.username}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              searchTerm &&
              !isLoading && (
                <p className="text-center opacity-70">No users found</p>
              )
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
                onClose();
              }}
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewChatModal;
