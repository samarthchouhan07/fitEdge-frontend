import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import debounce from "lodash.debounce";
import EmojiPicker from "emoji-picker-react";

const getAvatarColor = (email) => {
  const hash = email
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-blue-600",
    "bg-green-600",
    "bg-red-600",
    "bg-purple-600",
    "bg-teal-600",
    "bg-orange-600",
  ];
  return colors[hash % colors.length];
};

export const Chat = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;
  const token = localStorage.getItem("token");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef(null);
  const messageEndRef = useRef(null);

  const debouncedSearch = useMemo(
    () => debounce((query) => setSearchQuery(query), 300),
    []
  );

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userId || !token) {
      toast.error("Please log in to access chat");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    socketRef.current = io("https://fitedge-backend.onrender.com");
    socketRef.current.emit("join", userId);

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://fitedge-backend.onrender.com/api/chat/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
        console.log("Fetched users:", response.data);
      } catch (error) {
        console.error(
          "Error fetching users:",
          error.response?.data || error.message
        );
        toast.error("Error fetching users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();

    socketRef.current.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      if (message.sender._id === userId) return;
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          senderId: message.sender._id,
          message: message.content,
          timestamp: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: message.sender._id === userId,
          isRead: false,
        },
      ]);
      setUsers((prev) => {
        const updatedUsers = prev.map((u) =>
          u._id ===
          (message.sender._id === userId
            ? message.receiver._id
            : message.sender._id)
            ? {
                ...u,
                lastMessage: message.content,
                lastTime: formatRelativeTime(new Date(message.createdAt)),
                lastMessageTime: new Date(message.createdAt),
                unread:
                  message.sender._id !== userId &&
                  u._id === message.sender._id &&
                  u._id !== selectedUser?._id
                    ? (u.unread || 0) + 1
                    : u.unread,
              }
            : u
        );
        return updatedUsers.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return b.lastMessageTime - a.lastMessageTime;
        });
      });
    });

    socketRef.current.on("userStatusUpdate", ({ userId, online }) => {
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, online } : user))
      );
    });

    socketRef.current.on("messageRead", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
        )
      );
    });

    socketRef.current.on("refreshUsers", async () => {
      try {
        const response = await axios.get(
          "https://fitedge-backend.onrender.com/api/chat/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
        console.log("Refreshed users:", response.data);
      } catch (error) {
        console.error(
          "Error refreshing users:",
          error.response?.data || error.message
        );
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, token, selectedUser, navigate]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `https://fitedge-backend.onrender.com/api/chat/messages/${selectedUser._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const mappedMessages = response.data.map((msg, index) => ({
            _id: msg._id,
            id: index,
            senderId: msg.sender._id,
            message: msg.content,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: msg.sender._id === userId,
            isRead: msg.isRead,
          }));
          setMessages(mappedMessages);
          const readResponse = await axios.post(
            `https://fitedge-backend.onrender.com/api/chat/messages/${selectedUser._id}/read`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (readResponse.data.updatedMessages?.length > 0) {
            socketRef.current.emit("messagesRead", {
              senderId: userId,
              receiverId: selectedUser._id,
            });
          }
          setUsers((prev) =>
            prev.map((u) =>
              u._id === selectedUser._id ? { ...u, unread: 0 } : u
            )
          );
        } catch (error) {
          console.error(
            "Error in fetchMessages:",
            error.response?.data || error.message
          );
          toast.error("Error fetching messages");
        }
      };
      fetchMessages();
    }
  }, [selectedUser, token, userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) {
      toast.error("Select a user or enter a message");
      return;
    }
    const message = {
      sender: userId,
      receiver: selectedUser._id,
      content: messageInput,
    };
    socketRef.current.emit("sendMessage", message);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        senderId: userId,
        message: messageInput,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        isRead: false,
      },
    ]);
    setMessageInput("");
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour${
        Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""
      } ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} day${
        Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""
      } ago`;
    return date.toLocaleDateString();
  };

  console.log("users:", selectedUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row pt-16">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div
            className={`top-16 sm:flex fixed inset-y-0 left-0 w-full sm:w-64 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-300 sm:static sm:transform-none z-20 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="h-28 p-3 sm:p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Chats
                  </h2>
                  <Button
                    variant="outline"
                    className="sm:hidden text-gray-600 hover:text-blue-600 border-gray-300 p-2"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                </div>
                <div className="relative mt-2 sm:mt-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                  <Input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="w-full pl-9 pr-9 py-1.5 sm:py-2 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      onClick={() => {
                        setSearchQuery("");
                        debouncedSearch("");
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-6 sm:py-8">
                    <div className="animate-spin text-blue-600">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    </div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-600 text-sm sm:text-base py-6 sm:py-8">
                    {searchQuery
                      ? `No users found for "${searchQuery}"`
                      : "No users available"}
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        setSelectedUser(user);
                        setIsSidebarOpen(false);
                      }}
                      className={`flex items-center p-3 sm:p-4 min-h-12 cursor-pointer hover:bg-gray-100 transition-colors duration-200 animate-in fade-in ${
                        selectedUser?._id === user._id
                          ? "bg-blue-50 border-r-2 border-blue-600"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={`${user.name || user.email} avatar`}
                            className="size-8 sm:size-10 rounded-full object-cover ring-2 ring-offset-2 ring-gray-200"
                          />
                        ) : (
                          <div
                            className={`size-8 sm:size-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-medium ring-2 ring-offset-2 ${getAvatarColor(
                              user.email
                            )} ring-gray-200`}
                          >
                            {user.name
                              ? user.name[0].toUpperCase()
                              : user.email[0].toUpperCase()}
                          </div>
                        )}
                        {user.online && (
                          <div className="absolute bottom-0 right-0 size-2 sm:size-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {user.name || user.email}
                          </h3>
                          <span className="text-xs text-gray-600">
                            {user.lastTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {user.lastMessage || "No messages yet"}
                          </p>
                          {user.unread > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center size-4 sm:size-5 bg-blue-600 text-white text-xs rounded-full">
                              {user.unread}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div
            className={`flex-1 flex flex-col bg-white ${
              isSidebarOpen ? "hidden sm:flex" : "flex"
            }`}
          >
            {!selectedUser ? (
              <>
                <Menu
                  className="flex sm:hidden p-2 size-12"
                  onClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-600 text-base sm:text-lg">
                    Select a user to start chatting
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-28 p-3 sm:p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Button
                        variant="ghost"
                        className="sm:hidden text-gray-600 hover:text-blue-600 p-2"
                        onClick={() => setIsSidebarOpen(true)}
                      >
                        <Menu className="size-5" />
                      </Button>
                      <div
                        className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                        onClick={() => navigate(`/profile/${selectedUser._id}`)}
                      >
                        {selectedUser.profileImage ? (
                          <img
                            src={selectedUser.profileImage}
                            alt={`${selectedUser.name || selectedUser.email} avatar`}
                            className="size-8 sm:size-10 rounded-full object-cover ring-2 ring-offset-2 ring-gray-200"
                          />
                        ) : (
                          <div
                            className={`size-8 sm:size-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-medium ring-2 ring-offset-2 ${getAvatarColor(
                              selectedUser.email
                            )} ring-gray-200`}
                          >
                            {selectedUser.name
                              ? selectedUser.name[0].toUpperCase()
                              : selectedUser.email[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            {selectedUser.name || selectedUser.email}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600 capitalize">
                            {selectedUser.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-gray-600 size-5"
                      onClick={() => navigate(`/profile/${selectedUser._id}`)}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-600 text-sm sm:text-base py-6 sm:py-8">
                      No messages yet
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.isOwn ? "justify-end" : "justify-start"
                        } animate-in ${
                          msg.isOwn ? "slide-in-from-right" : "slide-in-from-left"
                        } duration-300`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm ${
                            msg.isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-xs sm:text-sm">{msg.message}</p>
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <p
                              className={`text-xs ${
                                msg.isOwn ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {msg.timestamp}
                            </p>
                            {msg.isOwn && (
                              <span>
                                {msg.isRead ? (
                                  <CheckCheck className="size-4 text-blue-300 animate-pulse" />
                                ) : (
                                  <CheckCheck className="size-4 text-gray-300" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messageEndRef} />
                </div>
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-white relative">
                  {showEmojiPicker && (
                    <div className="absolute bottom-14 left-0 z-30">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setMessageInput((prev) => prev + emojiData.emoji);
                        }}
                        theme="light"
                        height={350}
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-600 hover:text-blue-600 p-2"
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                    >
                      <Smile className="size-6" />
                    </Button>
                    <Input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
                    />
                    <Button
                      onClick={sendMessage}
                      className="p-2 sm:p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="size-4 sm:size-5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};