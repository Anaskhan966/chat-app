import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import { useState, useEffect } from "react";
import NewChatModal from "../components/Modal/NewChatModal";

const Chat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

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

  // Fetch messages when selectedUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages/${currentUser._id}/${selectedUser._id}`,
        );
        const data = await response.json();
        // Ensure initial messages are sorted
        const sortedData = data.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        );
        setMessages(sortedData);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setSelectedUser(newUser);
  };

  const sendMessageApi = async (content) => {
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
    if (!response.ok) throw new Error("Failed to send message");
    return await response.json();
  };

  const handleSendMessage = async (content, temporaryId = null) => {
    if (!selectedUser || !currentUser) return;

    const tempId = temporaryId || Date.now().toString();

    // 1. Update state to 'sending'
    if (!temporaryId) {
      const optimisticMessage = {
        _id: tempId,
        sender: currentUser._id,
        receiver: selectedUser._id,
        content: content,
        timestamp: new Date().toISOString(),
        status: "sending",
      };
      setMessages((prev) => [...prev, optimisticMessage]);
    } else {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...m, status: "sending", error: false } : m,
        ),
      );
    }

    try {
      const newMessage = await sendMessageApi(content);

      // 2. Update state to 'sent' with real data
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m._id === tempId ? { ...newMessage, status: "sent" } : m,
        );

        // 3. If this was a successful send, trigger auto-retry for others sequentially
        const firstFailed = updated.find((m) => m.status === "error");
        if (firstFailed) {
          // Use setTimeout to avoid doing this during the state update itself
          setTimeout(
            () => handleSendMessage(firstFailed.content, firstFailed._id),
            0,
          );
        }

        return updated;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...m, status: "error" } : m)),
      );
    }
  };

  // Sort messages by timestamp for display
  const displayMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

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
        onRetryMessage={(msg) => handleSendMessage(msg.content, msg._id)}
        selectedUser={selectedUser}
        messages={displayMessages}
        currentUser={currentUser}
      />
      <NewChatModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default Chat;
