import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import { useState, useEffect, useMemo } from "react";
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
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState("");

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  // Sync Clerk user with backend and fetch users
  useEffect(() => {
    const syncAndFetch = async () => {
      if (!clerkUser) return;

      try {
        const token = await getToken();
        if (!token) return;

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
            password: "clerk-auth-user",
            clerkId: clerkUser.id,
          }),
        });

        const loggedInUser = await syncResponse.json();
        setCurrentUser(loggedInUser);

        const contactsResponse = await fetch(
          `http://localhost:3000/api/users/${loggedInUser._id}/contacts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const contacts = await contactsResponse.json();
        setUsers(contacts);

        if (contacts.length > 0 && !selectedUser) {
          setSelectedUser(contacts[0]);
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
    setUsers((prev) => {
      const exists = prev.find((u) => u._id === newUser._id);
      if (exists) return prev;
      return [newUser, ...prev];
    });
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

      const token = await getToken();
      const contactsResponse = await fetch(
        `http://localhost:3000/api/users/${currentUser._id}/contacts`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const contacts = await contactsResponse.json();
      setUsers(contacts);

      setMessages((prev) => {
        const updated = prev.map((m) =>
          m._id === tempId ? { ...newMessage, status: "sent" } : m,
        );

        const firstFailed = updated.find((m) => m.status === "error");
        if (firstFailed) {
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

  const filteredUsers = useMemo(() => {
    if (!sidebarSearchTerm.trim()) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(sidebarSearchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(sidebarSearchTerm.toLowerCase()),
    );
  }, [users, sidebarSearchTerm]);

  const displayMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  return (
    <div className="flex h-[calc(100vh-128px)] bg-transparent">
      <ChatSidebar
        users={filteredUsers.filter((u) => u._id !== currentUser?._id)}
        onAddUser={openModal}
        onSelectUser={setSelectedUser}
        selectedUser={selectedUser}
        searchTerm={sidebarSearchTerm}
        onSearchChange={setSidebarSearchTerm}
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
        existingUsers={users}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Chat;
