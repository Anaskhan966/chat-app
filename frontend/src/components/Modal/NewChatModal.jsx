import React, { useState } from "react";

const NewChatModal = ({ isOpen, onClose }) => {
  const [chatName, setChatName] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatName.trim()) {
      setChatName("");
      onClose();
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
          <h3 className="font-bold text-lg mb-4">New Chat</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Chat name"
              className="input input-bordered w-full mb-4"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              autoFocus
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="input input-bordered w-full mb-4"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setChatName("");
                  setContact("");
                  onClose();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewChatModal;
