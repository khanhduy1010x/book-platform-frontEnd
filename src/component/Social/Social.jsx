import React, { useState, useEffect, useRef } from "react";
import { ref, push, get, remove, onValue, update } from "firebase/database";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { database, storage } from "../../config/firebase.js"; // Import Firebase Database và Storage
import { v4 as uuidv4 } from "uuid"; // Import UUID để tạo tên file duy nhất
import { useAPI } from "../Service/APIContext.js";
function Social({ name }) {
  const [tempIMG, setTempIMG] = useState(null);
  const { userInfo } = useAPI();
  const [ipMessage, setIpMessage] = useState("");
  const [file, setFile] = useState(null); // Lưu trữ file cho phần post
  const [messages, setMessages] = useState([]);
  const [showReactions, setShowReactions] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [commentFile, setCommentFile] = useState({}); // Lưu trữ file cho phần bình luận
  const [showCommentBox, setShowCommentBox] = useState({});
  const input = useRef(null);
  const reactionTimeoutRef = useRef(null);
  const [images, setImages] = useState([]); // Lưu trữ danh sách các hình ảnh
  const [files, setFiles] = useState([]); // Lưu trữ danh sách file
  const [tempIMGs, setTempIMGs] = useState([]); // Lưu trữ các URL tạm thời của ảnh để xem trước
  const [showAllImages, setShowAllImages] = useState({});
  const subImg = 4;
  const [hiddenMessages, setHiddenMessages] = useState([]); // Lưu trữ danh sách bài viết bị ẩn
  const [showOptions, setShowOptions] = useState(false);

  // Load messages from Firebase
  useEffect(() => {
    const messagesRef = ref(database, "messages");
    const unsubscribe = onValue(messagesRef, (data) => {
      let getMsg = [];
      data.forEach((d) => {
        getMsg.push({ id: d.key, ...d.val() });
      });
      setMessages(getMsg.reverse()); // Đặt tin nhắn mới nhất ở đầu
    });

    return () => unsubscribe();
  }, []);
  function formatRelativeTime(dateString) {
    const currentTime = new Date();
    const targetTime = new Date(dateString);
    const differenceInMs = currentTime - targetTime;
    const minutes = Math.floor(differenceInMs / (1000 * 60));
    const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(differenceInMs / (1000 * 60 * 60 * 24 * 365));

    if (minutes < 60) {
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else if (days < 365) {
      return `${days} ngày trước`;
    } else {
      return `${years} năm trước`;
    }
  }
  // Hàm upload file lên Firebase Storage và trả về URL
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
  const handleRemoveMessage = async (messageId) => {
    const messageRef = ref(database, `messages/${messageId}`);
    try {
      await remove(messageRef);
      console.log("Message deleted successfully.");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const handleDeleteMessage = async (messageId) => {
    const messageRef = ref(database, `messages/${messageId}`);

    try {
      const snapshot = await get(messageRef);
      if (snapshot.exists()) {
        const messageData = snapshot.val();
        const hidden = messageData.hidden || [];

        if (!hidden.includes(userInfo.accID)) {
          hidden.push(userInfo.accID);
        }

        await update(messageRef, { hidden });
        console.log("Message updated successfully.");
      } else {
        console.log("No such message exists.");
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempIMGs((prev) => [...prev, URL.createObjectURL(file)]); // Thêm URL tạm thời
      setFiles((prev) => [...prev, file]); // Thêm file vào danh sách
    }
  };
  // Hàm xử lý việc hiển thị thêm hoặc ẩn bớt ảnh
  const handleToggleShowImages = (messageId) => {
    setShowAllImages((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId], // Đảo ngược trạng thái cho bài viết có ID tương ứng
    }));
  };

  // Gửi tin nhắn (bao gồm file nếu có)
  const handleSendMessage = async () => {
    if (!ipMessage && files.length === 0) return;

    const fileUrls = [];
    let uploadCount = 0;

    // Upload từng file lên Firebase và chờ kết quả
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        uploadFile(file, (url) => {
          if (url) {
            resolve(url); // Trả về URL của file đã tải lên thành công
          } else {
            reject("Upload failed");
          }
        });
      });
    });

    // Chờ tất cả các file được tải lên
    try {
      const uploadedFileUrls = await Promise.all(uploadPromises);
      fileUrls.push(...uploadedFileUrls); // Lưu danh sách các URL file đã tải lên

      // Đẩy tin nhắn lên Firebase Database sau khi tất cả file đã được tải xong
      push(ref(database, "messages"), {
        userInfo,
        message: ipMessage,
        fileUrls, // Lưu danh sách URL các file
        timestamp: Date.now(),
      });

      setIpMessage(""); // Reset message và file
      setFiles([]);
      setTempIMGs([]);
      if (input.current) {
        input.current.focus();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // Gửi bình luận (bao gồm file nếu có)
  const handleSendComment = (messageId) => {
    const comment = commentInput[messageId];
    const fileToUpload = commentFile[messageId];
    if (!comment && !fileToUpload) return;

    uploadFile(fileToUpload, (fileUrl) => {
      const messageRef = ref(database, `messages/${messageId}`);
      const newComments = [
        ...(messages.find((msg) => msg.id === messageId).comments || []),
        { userInfo, comment, fileUrl: fileUrl || null, timestamp: Date.now() },
      ];

      update(messageRef, { comments: newComments });

      setCommentInput((prev) => ({ ...prev, [messageId]: "" }));
      setCommentFile((prev) => ({ ...prev, [messageId]: null }));

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, comments: newComments } : msg
        )
      );
    });
  };

  // Chọn biểu cảm
  const handleSelectReaction = (messageId, reaction) => {
    const messageRef = ref(database, `messages/${messageId}`);
    const selectedMessage = messages.find((msg) => msg.id === messageId);

    let reactions = selectedMessage.reactions || [];

    const existingReactionIndex = reactions.findIndex(
      (r) => r?.accID === userInfo?.accID
    );
    console.log(existingReactionIndex);

    if (existingReactionIndex > -1) {
      // Nếu biểu cảm trùng, cập nhật lại biểu cảm
      if (reactions[existingReactionIndex].reaction === reaction) {
        reactions.splice(existingReactionIndex, 1); // Xóa nếu người dùng bỏ chọn biểu cảm
      } else {
        reactions[existingReactionIndex].reaction = reaction;
      }
    } else {
      // Thêm biểu cảm mới
      reactions.push({ accID: userInfo.accID, reaction });
    }

    update(messageRef, { reactions }); // Cập nhật reactions trong Firebase
    setShowReactions(null); // Đóng popup biểu cảm
  };

  const handleMouseEnter = (messageId) => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current); // Xóa timeout nếu chuột quay lại popup
    }
    setShowReactions(messageId); // Hiển thị popup
  };

  const handleMouseLeave = () => {
    reactionTimeoutRef.current = setTimeout(() => {
      setShowReactions(null); // Ẩn popup sau một thời gian ngắn nếu chuột rời khỏi
    }, 300);
  };

  // Hiển thị hoặc ẩn ô bình luận khi nhấn "Comment"
  const handleToggleCommentBox = (messageId) => {
    setShowCommentBox((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };
  const countReactions = (reactions) => {
    if (!reactions) return;
    console.log(reactions);
    let counts = 0;
    reactions.map((_) => {
      counts++;
    });
    return counts;
  };

  return (
    <div
      style={{ padding: "120px 220px 70px 220px", background: "white" }}
      className="px-[72px]"
    >
      <div className="h-screen flex flex-col items-center justify-center bg-">
        <div className="w-full max-w-3xl mx-auto">
          {/* Phần Post Bài */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <input
              className="w-full p-3 border !h-[70px] rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
              placeholder="Nhập tin nhắn..."
              value={ipMessage}
              onChange={(e) => setIpMessage(e.target.value)}
              ref={input}
            />
            <div className="flex gap-4 items-center flex-wrap ">
              <div className="flex gap-2 flex-wrap">
                {tempIMGs.map((img, index) => (
                  <div
                    key={index}
                    className="w-[60px] h-[60px] relative bg-[#fafafa] !border-dotted rounded-xl border-[2px] border-sky-500 flex items-center justify-center"
                  >
                    <img
                      src={img}
                      alt="Selected preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}

                {/* Ô chọn ảnh mới */}
                <div className="w-[60px] h-[60px] relative bg-[#fafafa] !border-dotted rounded-xl border-[2px] border-sky-500 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      opacity: 0,
                      position: "absolute",
                      inset: 0,
                      cursor: "pointer",
                    }}
                  />
                  <i className="fa-solid fa-folder-plus"></i>
                </div>
              </div>

              <div className="flex justify-between  !w-[60px] h-[60px] !bg-blue-500">
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="!bg-blue-500 px-[20px] text-white flex items-center justify-center border-[1px] p-3 rounded-lg shadow-lg hover:bg-blue-400"
                >
                  <i className="fad fa-paper-plane text-black"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex flex-col overflow-y-auto h-96 w-full">
            {messages
              .filter(
                (msg) => !msg.hidden || !msg.hidden.includes(userInfo.accID)
              )
              .map((msg) => (
                <div
                  key={msg.id}
                  className="relative bg-white shadow-lg rounded-lg mb-4 p-4"
                >
                  <div className="pb-[100px]">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                          <img className="object-cover" src={msg.fileUrl} />
                        </div>
                        <div className="text-gray-700 font-semibold">
                          {msg.userInfo?.fullName}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
  <div className="text-gray-400 text-sm group relative text-center">
    {formatRelativeTime(msg.timestamp)}
    <div
      style={{ right: "35px" }}
      className="group-hover:opacity-100 w-100 inline-block absolute opacity-0 transition-all ease-in-out duration-500 top-4  !left-14"
    >
      {new Date(msg.timestamp).toLocaleDateString()}{" "}
      {new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}{" "}
    </div>
  </div>

  {/* Dấu ba chấm */}
  <div className="relative group ml-6">
    <button
      className="text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      <i className="fas fa-ellipsis-h text-lg"></i>
    </button>

    {/* Hiển thị tùy chọn khi nhấp vào dấu ba chấm */}

      <div className="absolute right-0  group-hover:opacity-100 opacity-0 w-[100px] bg-white border rounded-lg shadow-lg z-50">
        {/* Nút ẩn bài viết */}
        <button
          onClick={() => handleDeleteMessage(msg.id)}
          className="block w-full text-left px-4 py-2 "
        >
          <i className="fas fa-do-not-enter hover-red-color" style={{color:"red"}}></i>{" "}
          {/* Ẩn bài viết */}
        </button>

        {/* Nút xóa bài viết (chỉ hiển thị nếu là người dùng hoặc admin) */}
        {(msg?.userInfo?.accID === userInfo?.accID || userInfo?.role === "ADMIN") && (
          <button
            onClick={() => handleRemoveMessage(msg.id)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <i className="fad fa-trash-alt !text-red-300 hover-red-color" style={{color:"red"}}></i>{" "}
            {/* xóa bài viết */}
          </button>
        )}
      </div>

  </div>
</div>

                    </div>
                    <p className="text-gray-800 mt-2">{msg.message}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    {msg.fileUrls && msg?.fileUrls?.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {msg.fileUrls
                          .slice(
                            0,
                            !showAllImages[msg.id] && msg?.fileUrls?.length > 3
                              ? subImg
                              : msg?.fileUrls?.length
                          )
                          .map((url, index) => (
                            <div
                              key={index}
                              style={{ width: "150px", height: "150px" }}
                              className="rounded-lg overflow-hidden"
                            >
                              <img
                                src={url}
                                alt={`Uploaded file ${index}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Nút hiển thị thêm/bớt ảnh */}
                  {!showAllImages[msg.id] && msg?.fileUrls?.length > subImg ? (
                    <button onClick={() => handleToggleShowImages(msg.id)}>
                      Hiển thị thêm
                    </button>
                  ) : msg?.fileUrls?.length > 3 ? (
                    <button onClick={() => handleToggleShowImages(msg.id)}>
                      Hiển thị bớt
                    </button>
                  ) : null}

                  {/* Phần Emoji */}
                  {countReactions(msg.reactions)}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2 relative">
                      <div
                        className="cursor-pointer"
                        onMouseEnter={() => handleMouseEnter(msg.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {msg.reactions && msg.reactions.length > 0 ? (
                          msg.reactions.find(
                            (reaction) => reaction?.accID === userInfo?.accID
                          ) ? (
                            <span
                              className="cursor-pointer text-2xl text-gray-600"
                              role="img"
                              aria-label="reaction"
                              onClick={() =>
                                handleSelectReaction(
                                  msg.id,
                                  msg.reactions.find(
                                    (r) => r?.accID === userInfo?.accID
                                  )?.reaction
                                )
                              }
                            >
                              {
                                msg.reactions.find(
                                  (r) => r?.accID === userInfo?.accID
                                )?.reaction
                              }
                            </span>
                          ) : (
                            <span
                              className="cursor-pointer text-gray-600"
                              role="img"
                              aria-label="like"
                              onClick={() => handleSelectReaction(msg.id, "👍")}
                            >
                              <i className="far fa-thumbs-up text-2xl"></i>
                            </span>
                          )
                        ) : (
                          <span
                            className="cursor-pointer text-gray-600"
                            role="img"
                            aria-label="like"
                            onClick={() => handleSelectReaction(msg.id, "👍")}
                          >
                            <i className="far fa-thumbs-up text-2xl"></i>
                          </span>
                        )}

                        {showReactions === msg.id && (
                          <div className="absolute z-10 bg-white shadow-lg rounded-lg p-2 text-2xl flex space-x-2">
                            {/* Thêm các emoji */}
                            <span
                              className="cursor-pointer"
                              role="img"
                              aria-label="like"
                              onClick={() => handleSelectReaction(msg.id, "👍")}
                            >
                              👍
                            </span>
                            <span
                              className="cursor-pointer"
                              role="img"
                              aria-label="love"
                              onClick={() => handleSelectReaction(msg.id, "❤️")}
                            >
                              ❤️
                            </span>
                            <span
                              className="cursor-pointer"
                              role="img"
                              aria-label="haha"
                              onClick={() => handleSelectReaction(msg.id, "😂")}
                            >
                              😂
                            </span>
                            <span
                              className="cursor-pointer"
                              role="img"
                              aria-label="sad"
                              onClick={() => handleSelectReaction(msg.id, "😢")}
                            >
                              😢
                            </span>
                            <span
                              className="cursor-pointer"
                              role="img"
                              aria-label="angry"
                              onClick={() => handleSelectReaction(msg.id, "😡")}
                            >
                              😡
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-500"></div>
                    </div>
                    <div
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleToggleCommentBox(msg.id)}
                    >
                      <i className="fad fa-comment-lines text-2xl"></i>
                    </div>
                  </div>
                  {/* Dấu ba chấm */}
                  {/* <div className="relative">
                    <button
                      onClick={toggleOptions}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <i className="fas fa-ellipsis-h text-lg"></i>
                    </button>




                  </div> */}

                  {/* Phần bình luận */}
                  {showCommentBox[msg.id] && (
                    <div className="mt-4">
                      <div>
                        {msg.comments?.map((comment, index) => (
                          <div
                            key={index}
                            className="border-t border-gray-200 mt-2 pt-2 relative"
                          >
                            <div className="flex justify-between">
                              <div className="text-gray-600 text-sm font-semibold">
                                {comment.name}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {new Date(
                                  comment.timestamp
                                ).toLocaleDateString()}{" "}
                                {new Date(comment.timestamp).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </div>
                            </div>
                            <p className="text-gray-800 mt-1">
                              {comment.comment}
                            </p>
                            {comment.fileUrl && (
                              <a
                                href={comment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                View File
                              </a>
                            )}
                          </div>
                        ))}
                      </div>

                      <textarea
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 mt-2"
                        rows="2"
                        placeholder="Nhập bình luận..."
                        value={commentInput[msg.id] || ""}
                        onChange={(e) =>
                          setCommentInput((prev) => ({
                            ...prev,
                            [msg.id]: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          setCommentFile((prev) => ({
                            ...prev,
                            [msg.id]: e.target.files[0],
                          }))
                        }
                        className="mt-2"
                      />
                      <button
                        type="button"
                        className="bg-blue-500 text-white p-2 rounded-lg shadow-lg mt-2 hover:bg-blue-400"
                        onClick={() => handleSendComment(msg.id)}
                      >
                        Gửi bình luận
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Social;
