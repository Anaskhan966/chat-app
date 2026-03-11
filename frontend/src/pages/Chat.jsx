import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import { useState, useEffect } from "react";
import NewChatModal from "../components/Modal/NewChatModal";

const Chat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  // Fetch users and set a dummy current user for integration
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const data = await response.json();
        setUsers(data);
        if (data.length > 0) {
          // Setting the first user as current user for demo purposes
          // In a real app, this would come from auth state
          setCurrentUser(data[0]);
          // Select the second user as the default chat contact if available
          if (data.length > 1) {
            setSelectedUser(data[1]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSendMessage = async (content) => {
    if (!selectedUser || !currentUser) return;

    try {
      const response = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: currentUser._id,
          receiver: selectedUser._id,
          content: content,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        console.log("Message sent:", newMessage);
        // Here you would typically update the messages state to show the new message
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-base-200">
      <ChatSidebar
        users={users.filter((u) => u._id !== currentUser?._id)}
        onAddUser={openModal}
        onSelectUser={setSelectedUser}
        selectedUser={selectedUser}
      />
      <ChatWindow
        onSendMessage={handleSendMessage}
        selectedUser={selectedUser}
      />
      <NewChatModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Chat;
