import { useState, useEffect, useRef } from "react";
import {
  database,
  ref,
  storage,
  push,
  onValue,
  update,
  remove,
  onDisconnect,
} from "../../config/firebase.js";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useAPI } from "../Service/APIContext";
import EmojiPicker from "emoji-picker-react";

export default function Chat({userChat=false,setShowModalChat}) {
  const { userInfo } = useAPI();
  const [inputMessage, setInputMessage] = useState("");
  const [message, setMessage] = useState([]);
  const [to, setTo] = useState();
  const [name, setName] = useState();
  const [users, setUsers] = useState([2, 3]); // Mock user list for demo. You can replace this with actual user data.
  const [chatUsers, setChatUsers] = useState([]); // State to store users who have already chatted
  const [unreadMessagesCount, setUnreadMessagesCount] = useState({}); // Track unread messages count for each user
  const messagesEndRef = useRef(null); // Ref cho phần tử cuối của danh sách tin nhắn
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm
  const [files, setFiles] = useState([]); // Lưu trữ danh sách file
  const [tempIMGs, setTempIMGs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [currentChatUser, setCurrentChatUser] = useState();

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files); // Chuyển FileList thành một mảng
    if (filesArray.length > 0) {
      const tempURLs = filesArray.map((file) => URL.createObjectURL(file));
      setTempIMGs((prev) => [...prev, ...tempURLs]); // Thêm URL tạm thời
      setFiles((prev) => [...prev, ...filesArray]); // Thêm file vào danh sách
    }
  };

  // Fetch users who have already chatted from Firebase
  useEffect(() => {
    const chatUsersRef = ref(database, "chatUsers");

    onValue(chatUsersRef, (snapshot) => {
      let userChat = [];

      console.log("Fetching chat users...");

      snapshot.forEach((d) => {
        const user = {
          id: d.key,
          ...d.val(),
        };

        console.log("User data:", user);

        // Lấy tất cả tin nhắn liên quan đến user này
        const userMessages = message.filter(
          (msg) =>
            msg?.chatMessage?.to === user.userInfo.accID || // Tin nhắn gửi đến user này
            msg?.chatMessage?.user?.accID === user.userInfo.accID // Tin nhắn từ user này
        );

        console.log(`Messages for user ${user.userInfo.accID}:`, userMessages);

        // Sắp xếp tin nhắn theo timestamp tăng dần
        const sortedMessages = userMessages.sort(
          (a, b) => a?.chatMessage?.timestamp - b?.chatMessage?.timestamp
        );

        console.log(
          `Sorted messages (ascending) for user ${user.userInfo.accID}:`,
          sortedMessages
        );

        // Lấy tin nhắn mới nhất (vị trí cuối cùng)
        const latestMessage = sortedMessages[sortedMessages.length - 1];

        console.log(
          `Latest message for user ${user.userInfo.accID}:`,
          latestMessage?.chatMessage?.message || "No messages yet..."
        );

        // Gán tin nhắn mới nhất vào lastMessage
        user.lastMessage =
          latestMessage?.chatMessage?.message ||
          latestMessage?.chatMessage?.fileUrls?.length + " Ảnh";

        user.lastMessage = `${latestMessage?.chatMessage?.user.fullName}: ${user.lastMessage}`; // Gắn tên user trước tin nhắn

        userChat.push(user);
      });

      console.log("Final user chat list:", userChat);

      // Đảo ngược danh sách để hiển thị người mới nhất lên trên cùng
      setChatUsers(userChat.reverse());
    });
  }, [message]); // Đảm bảo message là dependency


  useEffect(() => {
    return () => {
      // Giải phóng tất cả URL đã tạo
      tempIMGs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [tempIMGs]);

  useEffect(() => {
    const chatWindow = document.querySelector(".chat-window");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [message]);

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
        if (
          msg?.chatMessage?.to === userInfo?.accID &&
          !msg?.chatMessage?.isRead
        ) {
          const senderId = msg?.chatMessage?.user.accID;
          unreadCount[senderId] = (unreadCount[senderId] || 0) + 1;
        }
      });
      setMessage(getMsg);
      setUnreadMessagesCount(unreadCount); // Set unread messages count
    });
  }, [to, userInfo]);

  // Mark all unread messages from the selected user as read
  const markMessagesAsRead = (chatUserAccID) => { //>?
    const unreadMessages = message.filter(
      //Lọc danh sách tin nhắn, chỉ giữ lại các tin nhắn
      (msg) =>
        //a x b            b         
        msg?.chatMessage?.to === userInfo?.accID &&
        !msg?.chatMessage?.isRead
    );

    // Cập nhật trạng thái isRead thành true trong Firebase để đánh dấu tin nhắn là đã đọc
    unreadMessages.forEach((msg) => {
      update(ref(database, `message/${msg.id}/chatMessage`), { isRead: true });
    });

    // Cập nhật số lượng tin nhắn chưa đọc về 0
    setUnreadMessagesCount((prev) => ({
      ...prev,
      [chatUserAccID]: 0, // Set unread messages count of the selected user to 0
    }));
  };
  const handlePaste = (e) => {
    const clipboardItems = e.clipboardData?.items;
    if (!clipboardItems) return;

    const imageItem = Array.from(clipboardItems).find(
      (item) => item.type.indexOf("image") === 0
    );

    if (imageItem) {
      const imageFile = imageItem.getAsFile();
      if (imageFile) {
        // Tạo một sự kiện giả cho hàm handleFileChange
        const fakeEvent = {
          target: {
            files: [imageFile],
          },
        };
        handleFileChange(fakeEvent);
      }
    }
  };

  // Send message
  const handleSendMessage = async () => {
    const fileUrls = [];
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        uploadFile(file, (url) => {
          if (url) {
            resolve(url);
          } else {
            reject("Upload failed");
          }
        });
      });
    });
    const uploadedFileUrls = await Promise.all(uploadPromises);
    fileUrls.push(...uploadedFileUrls);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    let chatMessage = {
      user: userInfo,
      message: inputMessage,
      time: hours + ":" + minutes,
      like: 0,
      fileUrls,
      to: to || 1,
      isRead: false, // Initially, the message is not read
      deletedFor: [], // Array to track who has deleted this message
    };

    push(ref(database, "message"), { chatMessage });
    // Xóa dữ liệu hình ảnh cũ sau khi gửi
    setFiles([]);
    setTempIMGs([]);
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
  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const uploadFile = (file, callback) => {
    if (!file) return callback(null);

    const fileName = `${uuidv4()}_${file.name}`;
    const fileRef = storageRef(storage, `uploads/${fileName}`);

    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      null,
      (error) => console.error("Upload failed", error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          callback(url);
        });
      }
    );
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
  // Đóng khung khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={`${userChat ? "" : "pt-24 min-h-screen bg-black"} `}>
      {userInfo?.role === "ADMIN" && (
        <button
          className="mr-4 px-2 py-1 bg-gray-300 rounded-md"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          {isSidebarVisible ? "Hide" : "Show"} Users
        </button>
      )}
      <div className="container mx-auto p-4 flex relative">
{
userChat && 
<div className="absolute right-7 cursor-pointer  mt-4"
onClick={() => setShowModalChat(false)}
>X</div>
}        {/* Left Sidebar for user list */}
        {userInfo?.role === "ADMIN" && (
          <div
            className={`w-1/4 bg-gray-200 p-4 rounded-lg shadow-lg ${
              isSidebarVisible ? "" : "hidden"
            }`}
          >
            <h2 className="text-xl font-bold text-gray-700 mb-4">Users</h2>
            {/* Ô tìm kiếm người dùng */}
            <input
              type="text"
              placeholder="Search users..."
              className="px-2 py-1 mb-4 w-full rounded-md border border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} //>?
            />
            <div className="space-y-4 overflow-y-auto h-96 bg-gray-900 p-4 rounded-lg">
              {chatUsers
                .filter(
                  (chatUser) =>
                    chatUser.userInfo?.role !== "ADMIN" && // Loại bỏ admin khỏi danh sách
                    chatUser.userInfo.fullName.includes(searchTerm) // Lọc theo từ khóa tìm kiếm
                )
                .map((chatUser) => (
                  <div
                    key={chatUser.userInfo.accID}
                    className={`min-w-[500px]flex items-center gap-4 p-3 rounded-lg relative ${
                      to === chatUser.userInfo.accID
                        ? "bg-blue-300 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                    onClick={() => {
                      setTo(chatUser.userInfo.accID);
                      setCurrentChatUser(chatUser.userInfo);
                      // Cập nhật người dùng được chọn
                      setName(chatUser.userInfo.username);
                      markMessagesAsRead(chatUser.userInfo.accID); // Đánh dấu tin nhắn là đã đọc
                    }} //>?
                  >
                    {/* Hình đại diện */}
                    <img
                      src={
                        chatUser.userInfo.avatar ||
                        "https://via.placeholder.com/40"
                      }
                      alt={`${chatUser.userInfo.fullName}'s avatar`}
                      className="w-10 h-10 rounded-full"//>?
                    />
                    {/* Thông tin người dùng */}
                    <div className="flex-1">
                      <p className="font-semibold">
                        {chatUser.userInfo.fullName}
                      </p>
                      <p className="text-sm text-gray-400 truncate w-[200px]">
                        {chatUser.lastMessage || "No messages yet..."}
                      </p>
                    </div> 
                    {/* Số tin nhắn chưa đọc */}
                    {unreadMessagesCount[chatUser.userInfo.accID] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadMessagesCount[chatUser.userInfo.accID]}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div
          className={`flex-grow flex-1 transition-all duration-300 ${
            isSidebarVisible ? "ml-4" : ""
          }`}
        >
          {/* <div className={`${isSidebarVisible ? "w-3/4 ml-4" : "w-full"}`}> */}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-700">
                {!to && userInfo?.role === "ADMIN"
                  ? ""
                  : userInfo?.role === "ADMIN"
                  ? `Chat with ${`${name}`}`
                  : "Chat with Admin"}
              </h1>
            </div>

            <div className="chat-window bg-gray-50 p-4 h-96 overflow-y-scroll rounded-lg border">
              {to === undefined && userInfo?.role === "ADMIN" ? ( // Kiểm tra nếu chưa chọn ai để trò chuyện
                <div className="text-center mt-4">
                  <h1 className="text-red-500 text-2xl font-bold">
                    Please select a conversation to start chatting.
                  </h1>
                  <div className="flex justify-center mt-2">
                    <div className="animate-bounce text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : message.length === 0 ? ( // Nếu có người được chọn nhưng chưa có tin nhắn
                <h1 className="text-center text-gray-500">
                  No messages yet. Type something and press Enter.
                </h1>
              ) : (
                filterms.map((item, index) => (
                  <>
                    {/* { && <div>...</div>} */}
                    <div key={index}>
                      {item?.chatMessage?.fileUrls && (
                        <div
                          className={`flex ${
                            item?.chatMessage?.user?.accID === userInfo?.accID
                              ? " justify-end"
                              : " justify-start"
                          } mt-10`}
                        >
                          {" "}
                          {/* Đẩy hình về phía người gửi */}
                          <div
                            className="grid grid-cols-3 mb-2 gap-[1px] max-w-[calc(100%-10rem)]" // Khống chế khung hiển thị không ảnh hưởng danh sách
                            style={{ maxWidth: "50%" }} // Đảm bảo khung không vượt 50% chiều ngang chat
                          >
                            {item?.chatMessage?.fileUrls.map(
                              (fileUrl, index) => (
                                <img
                                  key={index}
                                  src={fileUrl}
                                  alt={`Attachment ${index}`}
                                  className={`h-auto aspect-square object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105`}
                                  onClick={() => handleImageClick(fileUrl)} // Mở modal
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {selectedImage && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                          <div className="relative">
                            <img
                              src={selectedImage}
                              alt="Selected"
                              className="max-w-full max-h-screen rounded-lg"
                            />
                            <button
                              onClick={() => setSelectedImage(null)}
                              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      )}

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
                        <p className="text-gray-800 max-w-[90%] py-2 rounded-md break-words">
                          {item?.chatMessage?.message || ""}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item?.chatMessage?.time}
                        </p>
                      </div>
                      <div className="text-right">
                        {index === filterms.length - 1 &&
                          item?.chatMessage?.user?.accID ===
                            userInfo?.accID && (
                            <p className="text-xs text-green-600">
                              {item?.chatMessage?.isRead ? "Đã xem" : "Đã gửi"}
                            </p>
                          )}
                      </div>
                    </div>
                  </>
                ))
              )}
              {/* Div dùng để cuộn tới cuối của tin nhắn */}
              <div />
            </div>

            {/* Lưu tạm hình */}
            <div className="flex gap-2 mt-3">
              {tempIMGs.map((item1,index1) => (
                <div>
                  <img
                    src={item1}
                    className="w-[80px] h-[80px] rounded-xl object-contain"
                  />
                  <span
                    onClick={(e) =>                                    
                     { setTempIMGs(tempIMGs.filter((item2) => item2 != item1))
                      setFiles(files.filter((_,index) => index != index1))
                     }
                    }
                  >
                    <i
                      className="fas fa-trash-alt"
                      style={{ color: "#9c0d3f" }}
                    ></i>
                  </span>
                </div>
              ))}
            </div>

            {((currentChatUser && userInfo?.role === "ADMIN") ||
              userInfo?.role === "USER") && (
              <div className="mt-4 flex relative">
                <input
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  placeholder={`Nhập tin nhắn mới tới ${
                    currentChatUser ? currentChatUser.fullName : "Admin"
                  }`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  onFocus={() => markMessagesAsRead(to)} // Mark messages as read when focusing on the input field for the current user
                  onPaste={(e) => handlePaste(e)} // Xử lý dán
                />

                {/* Nút gửi file */}
                <label className="flex items-center justify-center bg-gray-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300">
                  <input
                    type="file"
                    multiple
                    className="hidden" //>?
                    onChange={(e) => handleFileChange(e)}
                  />
                  <i className="fas fa-paperclip"></i>
                </label>

                {/* Nút gửi biểu cảm */}
                <button
                  className="ml-2 px-2 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  😊
                </button>

                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef} // Tham chiếu để xử lý click ra ngoài
                    className="absolute bottom-full mb-2 right-0 z-20 bg-white shadow-lg rounded-md p-4"
                    style={{ width: "300px" }}
                  >
                    <EmojiPicker
                      onEmojiClick={(emoji) => {
                        setInputMessage((prev) => prev + emoji.emoji);
                      }}
                    />
                  </div>
                )}

                <button
                  className="ml-2 px-4 py-2 bg-blue-600 text-white disabled:opacity-70 rounded-md disabled:hover:bg-blue-00 hover:bg-blue-700"
                  onClick={handleSendMessage}
                  disabled={tempIMGs.length === 0 && !inputMessage}
                >
                  <i className="fa-sharp-duotone fa-solid fa-paper-plane-top"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
