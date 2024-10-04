import { useState, useEffect } from "react";
import {
  database,
  ref,
  push,
  onValue,
  update,
  remove,
} from "../../config/firebase.js";

import { useAPI } from "../Service/APIContext";

export default function Chat() {
  const { userInfo } = useAPI();
  const [inputMessage, setInputMessage] = useState("");
  const [message, setMessage] = useState([]);
  const [to, setTo] = useState();
  const [users, setUsers] = useState([2, 3]); // Mock user list for demo. You can replace this with actual user data.
  const [chatUsers, setChatUsers] = useState([]); // State to store users who have already chatted
  const [unreadMessagesCount, setUnreadMessagesCount] = useState({}); // Track unread messages count for each user

  // Fetch users who have already chatted from Firebase
  useEffect(() => {
    const chatUsersRef = ref(database, "chatUsers");
    onValue(chatUsersRef, (data) => {
      let userChat = [];
      data.forEach((d) => {
        const user = {
          id: d.key,
          ...d.val(),
        };
        userChat.push(user);
      });
      setChatUsers(userChat.reverse());
    });
  }, []);

  // Fetch messages from Firebase
  useEffect(() => {
    const messageRef = ref(database, "message");
    onValue(messageRef, (data) => {
      let getMsg = [];
      let unreadCount = {};

      data.forEach((d) => {
        const msg = {
          id: d.key,
          ...d.val(),
        };
        getMsg.push(msg);

        // Count unread messages for each user
        if (msg.chatMessage.to === userInfo?.accID && !msg.chatMessage.isRead) {
          const senderId = msg.chatMessage.user.accID;
          unreadCount[senderId] = (unreadCount[senderId] || 0) + 1;
        }
      });

      setMessage(getMsg);
      setUnreadMessagesCount(unreadCount); // Set unread messages count
    });
  }, [to, userInfo]);

  // Mark all unread messages from the selected user as read
  const markMessagesAsRead = (chatUserAccID) => {
    const unreadMessages = message.filter(
      (msg) =>
        msg.chatMessage?.to === userInfo?.accID &&
        msg.chatMessage?.user?.accID === chatUserAccID &&
        !msg.chatMessage?.isRead
    );

    // Mark all unread messages as read for the selected user
    unreadMessages.forEach((msg) => {
      update(ref(database, `message/${msg.id}/chatMessage`), { isRead: true });
    });

    // Reset the unread messages count for the selected user
    setUnreadMessagesCount((prev) => ({
      ...prev,
      [chatUserAccID]: 0, // Set unread messages count of the selected user to 0
    }));
  };

  // Send message
  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage === "") return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    let chatMessage = {
      user: userInfo,
      message: inputMessage,
      time: hours + ":" + minutes,
      like: 0,
      to: to || 1,
      isRead: false, // Initially, the message is not read
      deletedFor: [], // Array to track who has deleted this message
    };

    push(ref(database, "message"), { chatMessage });
    setInputMessage("");

    // Check if the user is already in chatUsers, if not, add to database
    const user = chatUsers.find(
      (user) => user.userInfo.accID === userInfo.accID
    );
    if (user) {
      const userRef = ref(database, `chatUsers/${user.id}`);
      remove(userRef);
    }

    push(ref(database, "chatUsers"), { userInfo });
  };

  // Filter messages based on user role and check if they were deleted for the current user
  let filterms = message.filter(
    (item) =>
      (userInfo?.role === "ADMIN"
        ? item?.chatMessage?.to === to || item?.chatMessage?.user?.accID === to
        : item?.chatMessage?.to === userInfo?.accID ||
          item?.chatMessage?.user?.accID === userInfo?.accID) &&
      !item?.chatMessage?.deletedFor?.includes(userInfo?.accID)
  );

  return (
    <div className="pt-24 min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 flex">
        {/* Left Sidebar for user list */}
        {userInfo?.role === "ADMIN" && (
          <div className="w-1/4 bg-gray-200 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Users</h2>
            <div className="space-y-2 overflow-y-auto h-96">
              {chatUsers.map((chatUser) => (
                <div key={chatUser.userInfo.accID} className="relative">
                  <div
                    className={`p-2 cursor-pointer rounded-md flex justify-between items-center ${
                      to === chatUser.userInfo.accID
                        ? "bg-blue-400 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => {
                      setTo(chatUser.userInfo.accID);
                      markMessagesAsRead(chatUser.userInfo.accID); // Mark messages as read on user click
                    }}
                  >
                    <span>
                      User {chatUser.userInfo.accID}:{" "}
                      {chatUser.userInfo.fullName}
                    </span>
                    {/* Display unread messages count */}
                    {unreadMessagesCount[chatUser.userInfo.accID] > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadMessagesCount[chatUser.userInfo.accID]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="w-3/4 ml-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-700">
                {userInfo?.role === "ADMIN"
                  ? `Chat with User ${to ? `User ${to}` : ""}`
                  : "Chat with Admin"}
              </h1>
            </div>

            <div className="chat-window bg-gray-50 p-4 h-96 overflow-y-scroll rounded-lg border">
              {message.length === 0 ? (
                <h1 className="text-center text-gray-500">
                  No messages yet. Type something and press Enter.
                </h1>
              ) : (
                filterms.map((item, index) => (
                  <div key={index}>
                    <div
                      className={`p-4 rounded-lg shadow mb-2 max-w-xs ${
                        item?.chatMessage?.user?.accID === userInfo?.accID
                          ? "ml-auto bg-blue-100"
                          : "mr-auto bg-white"
                      }`}
                    >
                      <h1 className="font-semibold text-blue-600">
                        {item?.chatMessage?.user?.fullName}
                      </h1>
                      <p className="text-gray-800">
                        {item?.chatMessage.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item?.chatMessage.time}
                      </p>
                    </div>
                    <div className="text-right">
                      {index === filterms.length - 1 &&
                        item?.chatMessage?.user?.accID === userInfo?.accID && (
                          <p className="text-xs text-green-600">
                            {item?.chatMessage?.isRead ? "Đã xem" : "Chưa xem"}
                          </p>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex">
              <input
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                onFocus={() => markMessagesAsRead(to)} // Mark messages as read when focusing on the input field for the current user
              />
              <button
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
