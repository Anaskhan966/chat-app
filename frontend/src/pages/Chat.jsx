import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import { useState, useEffect } from "react";
import NewChatModal from "../components/Modal/NewChatModal";
import { useUser, useAuth } from "@clerk/clerk-react";

const Chat = () => {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  // Sync Clerk user with backend and fetch users
  useEffect(() => {
    const syncAndFetch = async () => {
      if (!clerkUser) return;

      try {
        // Explicitly get the __session token for direct JWT verification
        const token = await getToken();
        if (!token) {
          console.warn("No token available yet");
          return;
        }

        // 1. Sync Clerk user with backend
        const syncResponse = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name:
              clerkUser.fullName ||
              clerkUser.username ||
              clerkUser.emailAddresses[0].emailAddress.split("@")[0],
            username:
              clerkUser.username ||
              clerkUser.emailAddresses[0].emailAddress.split("@")[0],
            email: clerkUser.emailAddresses[0].emailAddress,
            password: "clerk-auth-user", // placeholder
            clerkId: clerkUser.id,
          }),
        });

        const loggedInUser = await syncResponse.json();
        setCurrentUser(loggedInUser);

        // 2. Fetch all users
        const usersResponse = await fetch("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = await usersResponse.json();
        setUsers(allUsers);

        if (allUsers.length > 0) {
          const firstOther = allUsers.find((u) => u._id !== loggedInUser._id);
          if (firstOther) setSelectedUser(firstOther);
        }
      } catch (error) {
        console.error("Failed to sync/fetch users:", error);
      }
    };
    syncAndFetch();
  }, [clerkUser, getToken]);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(
          `http://localhost:3000/api/messages/${currentUser._id}/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
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
  }, [selectedUser, currentUser, getToken]);

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setSelectedUser(newUser);
  };

  const sendMessageApi = async (content) => {
    const token = await getToken();
    const response = await fetch("http://localhost:3000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
