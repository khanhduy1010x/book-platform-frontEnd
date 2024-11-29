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
import EmojiPicker from "emoji-picker-react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
// import SendMessage from "./component/SendMessage.jsx";

function Social() {
  const [tempImageEditPost, setTempImageEditPost] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileComment = useRef(null);
  const { userInfo } = useAPI();
  const [ipMessage, setIpMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showReactions, setShowReactions] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [commentFile, setCommentFile] = useState({}); // Lưu trữ file cho phần bình luận
  const [showCommentBox, setShowCommentBox] = useState({});
  const input = useRef(null);
  const reactionTimeoutRef = useRef(null);
  const [files, setFiles] = useState([]); // Lưu trữ danh sách file
  const [tempIMGs, setTempIMGs] = useState([]); // Lưu trữ các URL tạm thời của ảnh để xem trước
  const [showAllImages, setShowAllImages] = useState({});
  const subImg = 4;
  const [showOptions, setShowOptions] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [editContent, setEditContent] = useState({});
  const [editCommentMode, setEditCommentMode] = useState({}); // Để theo dõi trạng thái chỉnh sửa của các bình luận
  const [editCommentContent, setEditCommentContent] = useState({}); // Để lưu nội dung đang chỉnh sửa của các bình luận
  const [searchPost, setSearchPost] = useState(null);
  const [resetMSG, setResetMSG] = useState(false);
  const [showSettings, setShowSettings] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [loadComment, setLoadComment] = useState(false);
  const [debouncedSearchPost] = useDebounce(searchPost, 300); // Thêm debounce
  const [suggestions, setSuggestions] = useState([]); // Load messages from Firebase
  const [currentHashtag, setCurrentHashtag] = useState("");
  const [originalMessages, setOriginalMessages] = useState([]);
  const [tempCommentIMGs, setTempCommentIMGs] = useState([]);
  const [commentFiles, setCommentFiles] = useState([]);
  const [showEmojiPickerCmt, setShowEmojiPickerCmt] = useState(-1);
  const [prevComment, setPrevComment] = useState([]);
  const [currentFileComment, setCurrentFileComment] = useState([]);
  const [editFiles, setEditFiles] = useState({}); // Lưu file được chọn
  const [currentFile, setCurrentFile] = useState([]);

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    const unsubscribe = onValue(messagesRef, (data) => {
      let getMsg = [];
      data.forEach((d) => {
        let comments = [];

        if (d.val().comments) {
          Object.keys(d.val().comments).forEach((commentKey) => {
            comments.push({
              id: commentKey,
              ...d.val().comments[commentKey],
            });
          });
        }

        getMsg.push({
          id: d.key,
          ...d.val(),
          comments: comments.reverse(),
        });
      });
      // Lưu danh sách bài viết ban đầu vào `originalMessages`
      setOriginalMessages(getMsg.reverse());
      // Nếu có từ khóa tìm kiếm, lọc bài viết theo từ khóa
      if (debouncedSearchPost) {
        getMsg = getMsg.filter((msg) =>
          msg.message.toLowerCase().includes(debouncedSearchPost.toLowerCase())
        );
      }

      setMessages(getMsg); // Hiển thị tin nhắn mới nhất ở trên cùng
    });

    return () => unsubscribe();
  }, [
    editCommentMode,
    resetMSG,
    loadComment,
    debouncedSearchPost,
    editContent,
  ]); // Thêm debouncedSearchPost vào dependencies

  function formatRelativeTime(dateString) {
    //?>
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
  // State to manage hover status
  const [isHovered, setIsHovered] = useState(false);

  // Function to handle mouse enter and leave events
  const handleMouseEnterr = () => {
    setIsHovered(true);
  };

  const handleMouseLeavee = () => {
    setIsHovered(false);
  };

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
  const emojiPickerRef = useRef(null); // Tạo ref cho bảng emoji

  useEffect(() => {
    const handleClickOutside = (event) => {
      //?>
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false); // Đóng bảng emoji khi click ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const settingsRef = useRef(null); // Tạo ref cho bảng tùy chọn
  //search theo gợi ý tìm kiếm
  useEffect(() => {
    if (searchPost) {
      //?>
      const newSuggestions = messages.filter((msg) =>
        msg.message.toLowerCase().includes(searchPost.toLowerCase())
      );
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]); // Nếu không có từ khóa thì không hiện gợi ý
    }
  }, [searchPost, messages]);

  const handleSuggestionClick = (suggestion) => {
    //?>
    setSearchPost(suggestion.message); // Gán từ khóa bằng nội dung đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý

    // Tìm kiếm chi tiết dựa trên bài viết đã chọn
    const searchResult = messages.filter(
      (msg) => msg.message === suggestion.message
    );

    setMessages(searchResult); // Cập nhật kết quả tìm kiếm với bài viết đã chọn
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      //?>
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsShow(false); // Ẩn bảng khi nhấp bên ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveMessage = async (messageId) => {
    //?>
    const messageRef = ref(database, `messages/${messageId}`);
    try {
      await remove(messageRef);
      console.log("Message deleted successfully.");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleRemoveImages = async (messageId, imagesId) => {
    const messageRef = ref(
      database,
      `messages/${messageId}/fileUrls/${imagesId}`
    );
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
    //?>>
    const file = e.target.files[0];
    if (file) {
      setTempIMGs((prev) => [...prev, URL.createObjectURL(file)]); // Thêm URL tạm thời
      setFiles((prev) => [...prev, file]); // Thêm file vào danh sách
    }
  };
  const handleRemoveImage = (index) => {
    // Xóa hình ảnh từ danh sách tạm thời `tempIMGs`
    setTempIMGs((prev) => prev.filter((_, i) => i !== index));

    // Xóa file từ danh sách file tạm thời `files`
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Hàm xử lý việc hiển thị thêm hoặc ẩn bớt ảnh
  const handleToggleShowImages = (messageId) => {
    setShowAllImages((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId], // Đảo ngược trạng thái cho bài viết có ID tương ứng
    }));
  };
  // Hàm để chuyển sang chế độ chỉnh sửa cho bài viết
  const handleEditPost = (postId) => {
    setEditMode((prev) => ({ ...prev, [postId]: true })); // Thiết lập chế độ chỉnh sửa cho bài viết tương ứng
  };

  // Hàm để hủy chế độ chỉnh sửa
  const handleCancelEdit = (postId) => {
    setEditMode((prev) => ({ ...prev, [postId]: false })); // Đặt lại chế độ chỉnh sửa cho bài viết tương ứng thành false
  };

  // Hàm để lưu nội dung bài viết đã chỉnh sửa
  const handleSaveEdit = async (postId) => {
    const newContent = editContent[postId];
    const newHasTag = extractHashtags(newContent);
    try {
      await updatePost(postId, newContent, newHasTag); // Gọi hàm để cập nhật nội dung bài viết
      setEditMode((prev) => ({ ...prev, [postId]: false })); // Đặt chế độ chỉnh sửa thành false sau khi lưu
      // Có thể cập nhật thêm UI nếu cần
    } catch (error) {
      console.error("Error updating post: ", error); // Ghi lại lỗi nếu có
    }
  };

  // Hàm để thực hiện việc cập nhật nội dung bài viết trong Firebase
  const updatePost = async (postId, newContent, updatedHashtags = null) => {
    console.log("aloalo");
    const fileUrls = []; // Mảng chứa các URL file đã tải lên
    console.log(currentFileComment);
    const file = await fetchMultipleFiles(tempImageEditPost);
    console.log("so luong alo alo  : ", file);
    // Tạo các promise để tải lên từng file
    const uploadPromises = file.map((file) => {
      return new Promise((resolve, reject) => {
        uploadFile(file, (url) => {
          if (url) {
            resolve(url); // Trả về URL của file đã tải lên thành công
          } else {
            reject("Upload failed"); // Thất bại khi tải lên
          }
        });
      });
    });

    // Chờ tất cả các file được tải lên Firebase Storage
    const uploadedFileUrls = await Promise.all(uploadPromises);
    fileUrls.push(...uploadedFileUrls);
    console.log(fileUrls);
    const postRef = ref(database, `messages/${postId}`); // Đường dẫn tới bài viết trong Realtime Database
    try {
      await update(postRef, {
        fileUrls: fileUrls,
        message: newContent, // Cập nhật trường 'message' với nội dung mới
        edited: true, //
        hashTag: updatedHashtags,
      });
    } catch (error) {
      console.error("Error updating post: ", error); // Ghi lại lỗi nếu có
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  const deleteComment = async (postId, commentId) => {
    const commentRef = ref(
      database,
      `messages/${postId}/comments/${commentId}`
    );

    try {
      await remove(commentRef);
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const handleEditComment = (postId, commentId, currentComment) => {
    setEditCommentMode({ postId: postId, commentId: commentId });
    setEditCommentContent({
      currentComment: currentComment,
    });
  };
  const handleCancelEditComment = (commentId) => {
    setEditCommentMode((prev) => ({
      ...prev,
      [commentId]: false, // Tắt chế độ chỉnh sửa cho bình luận cụ thể
    }));
  };
  const handleSaveEditComment = async (postId, commentId) => {
    console.log(commentId);
    const newCommentContent = editCommentContent.currentComment;
    try {
      await updateComment(postId, commentId, newCommentContent); // Hàm cập nhật nội dung bình luận trong Firebase
      setEditCommentMode({}); // Tắt chế độ chỉnh sửa sau khi lưu
      setEditCommentContent({}); // T
    } catch (error) {
      console.error("Error updating comment: ", error);
    }
  };
  async function fetchMultipleFiles(urlList) {
    try {
      const files = await Promise.all(
        urlList.map((url, index) => {
          // Kiểm tra URL là Firebase URL hay Blob URL
          const fileName = `file_${index + 1}`; // Đặt tên file
          return url.startsWith("blob:")
            ? fetchFileFromBlobURL(url, fileName) // Xử lý Blob URL
            : fetchFileFromURL(url, fileName); // Xử lý URL thường
        })
      );
      return files;
    } catch (error) {
      console.error("Error fetching files:", error);
      return [];
    }
  }
  async function fetchFileFromURL(fileUrl, fileName = "downloaded_file") {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }
  async function fetchFileFromBlobURL(blobUrl, fileName = "blob_file") {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

  const handleRemoveEditImageComment = (index) => {
    const newFiles = currentFileComment.filter((file, i) => index !== i);
    setCurrentFileComment(newFiles);
  };

  // Hàm cập nhật bình luận trong Firebase
  const updateComment = async (postId, commentId, newCommentContent) => {
    let edit = true;

    const fileUrls = []; // Mảng chứa các URL file đã tải lên
    console.log(currentFileComment);
    const file = await fetchMultipleFiles(currentFileComment);
    console.log(file);
    // Tạo các promise để tải lên từng file
    const uploadPromises = file.map((file) => {
      return new Promise((resolve, reject) => {
        uploadFile(file, (url) => {
          if (url) {
            resolve(url); // Trả về URL của file đã tải lên thành công
          } else {
            reject("Upload failed"); // Thất bại khi tải lên
          }
        });
      });
    });

    // Chờ tất cả các file được tải lên Firebase Storage
    const uploadedFileUrls = await Promise.all(uploadPromises);
    fileUrls.push(...uploadedFileUrls);
    if (newCommentContent.trim() === prevComment.trim()) {
      edit = false;
    }
    const commentRef = ref(
      database,
      `messages/${postId}/comments/${commentId}`
    );
    try {
      await update(commentRef, {
        comment: newCommentContent, // Cập nhật nội dung bình luận
        edited: edit,
        fileUrls: fileUrls, // Đánh dấu bình luận đã được chỉnh sửa
      });
    } catch (error) {
      console.error("Error updating comment: ", error);
    }
  };
  const extractHashtags = (message) => {
    const regex = /#(\w+)/g; // Biểu thức chính quy để tìm tất cả các hashtag
    const hashtags = [];
    let match;
    while ((match = regex.exec(message)) !== null) {
      hashtags.push(match[0]); // Thêm hashtag vào mảng
    }
    return hashtags;
  };

  // Gửi tin nhắn (bao gồm file nếu có)
  const handleSendMessage = async () => {
    if (!ipMessage && files.length === 0) return;
    const hastag = extractHashtags(ipMessage);
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
        hashTag: hastag,
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
  const handleSendComment = async (messageId) => {
    const comment = commentInput[messageId] || ""; // Lấy nội dung bình luận
    const filesToUpload = commentFiles[messageId] || []; // Lấy danh sách file cần upload
    const messageRef = ref(database, `messages/${messageId}`); // Tham chiếu tới bài viết trong Firebase

    const fileUrls = []; // Mảng chứa các URL file đã tải lên

    // Tạo các promise để tải lên từng file
    const uploadPromises = filesToUpload.map((file) => {
      return new Promise((resolve, reject) => {
        uploadFile(file, (url) => {
          if (url) {
            resolve(url); // Trả về URL của file đã tải lên thành công
          } else {
            reject("Upload failed"); // Thất bại khi tải lên
          }
        });
      });
    });

    // Chờ tất cả các file được tải lên Firebase Storage
    const uploadedFileUrls = await Promise.all(uploadPromises);
    fileUrls.push(...uploadedFileUrls); // Lưu danh sách các URL file đã tải lên vào mảng

    // Lấy danh sách bình luận hiện tại của bài viết
    const newComments = [
      ...(messages.find((msg) => msg.id === messageId).comments || []),
      {
        userInfo, // Thông tin người dùng
        comment, // Nội dung bình luận
        fileUrls: fileUrls.length > 0 ? fileUrls : null, // Các URL file đã tải lên (nếu có)
        timestamp: Date.now(), // Thời gian tạo bình luận
      },
    ];

    // Cập nhật bình luận mới vào Firebase
    await update(messageRef, { comments: newComments });

    // Reset các giá trị
    setCommentInput((prev) => ({ ...prev, [messageId]: "" }));
    setCommentFiles((prev) => ({ ...prev, [messageId]: [] }));
    setTempCommentIMGs((prev) => ({ ...prev, [messageId]: [] }));

    // Cập nhật danh sách tin nhắn trong state
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, comments: newComments } : msg
      )
    );

    setLoadComment(true); // Cập nhật trạng thái load comment
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
    let counts = 0;
    let tim = 0;
    let haha = 0;
    let like = 0;
    let angry = 0;
    let sad = 0;
    reactions.map((o) => {
      if (o.reaction === "👍") {
        like++;
      } else if (o.reaction === "❤️") {
        tim++;
      } else if (o.reaction === "😂") {
        haha++;
      } else if (o.reaction === "😡") {
        angry++;
      } else {
        sad++;
      }
      counts++;
    });
    return {
      content: `👍 ${like} ❤️${tim} 😂${haha} 😢${sad} 😡${angry}`,
      count: counts,
    };
  };
  useEffect(() => {
    if (debouncedSearchPost) {
      let newmsg = messages.filter((msg) =>
        msg.message.toLowerCase().includes(debouncedSearchPost.toLowerCase())
      );
      setMessages(newmsg);
      setResetMSG(false);
    } else {
      setResetMSG(true);
    }
  }, [debouncedSearchPost]); // Thay searchPost bằng debouncedSearchPost
  const [hiddenSearch, setHiddenSearch] = useState(false);
  const handleHashtagClick = (hashtag) => {
    // Lọc các bài viết chứa hashtag tương ứng
    const filteredPosts = messages.filter(
      (msg) => msg.hashTag && msg.hashTag.includes(hashtag)
    );
    setMessages(filteredPosts); // Cập nhật danh sách bài viết theo hashtag

    // Cập nhật hashtag hiện tại để hiển thị thông báo
    setCurrentHashtag(hashtag);
    console.log("Clicked hashtag:", hashtag);
  };
  const handleResetSearch = () => {
    setMessages(originalMessages); // Quay lại danh sách bài viết ban đầu
    setCurrentHashtag(""); // Reset hashtag hiện tại
  };
  //thêm nhiều hình cho comment
  const handleCommentFileChange = (e, messageId) => {
    const selectedFiles = Array.from(e.target.files); // Lấy tất cả file được chọn

    if (selectedFiles.length > 0) {
      // Thêm các URL tạm thời cho các ảnh
      const tempImgUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      // Cập nhật danh sách ảnh tạm thời
      setTempCommentIMGs((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), ...tempImgUrls],
      }));

      // Cập nhật danh sách file
      setCommentFiles((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), ...selectedFiles],
      }));
    }
  };

  const handleRemoveCommentImage = (messageId, index) => {
    setTempCommentIMGs((prev) => ({
      ...prev,
      [messageId]: prev[messageId].filter((_, i) => i !== index),
    }));

    setCommentFiles((prev) => ({
      ...prev,
      [messageId]: prev[messageId].filter((_, i) => i !== index),
    }));
  };



  const renderMessageWithLinks = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[a-z]{2,})/gi;
    const parts = message.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        const formattedLink = part.startsWith("http")
          ? part
          : `https://${part}`;
        return (
          <a
            key={index}
            onClick={() => {
              alert("CHUYEN HUONG DEN TRANG NGUY HIEM");
            }}
            href={formattedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {part}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };
  const handleAddNewImagePostEdit = (e) => {
    console.log(e.target.files[0]);
    setTempImageEditPost((prev) => {
      if (!Array.isArray(prev)) {
        console.error("Previous state is not an array:", prev);
        return [URL.createObjectURL(e.target.files[0])]; // Tạo mảng mới nếu `prev` không hợp lệ
      }
      return [...prev, URL.createObjectURL(e.target.files[0])];
    });
  };
  const handleRemoveEditImage = (index) => {
    const result = tempImageEditPost.filter((_, i) => index !== i);
    setTempImageEditPost(result);
  };
  const handleAddNewEditCommentFile = (e) => {
    console.log(e.target.files[0]);
    setCurrentFileComment((prev) => {
      if (!Array.isArray(prev)) {
        console.error("Previous state is not an array:", prev);
        return [URL.createObjectURL(e.target.files[0])]; // Tạo mảng mới nếu `prev` không hợp lệ
      }
      return [...prev, URL.createObjectURL(e.target.files[0])];
    });
  };
  const handleAddNewEditFile = (e) => {
    console.log(e.target.files[0]);
    setCurrentFileComment((prev) => {
      if (!Array.isArray(prev)) {
        console.error("Previous state is not an array:", prev);
        return [URL.createObjectURL(e.target.files[0])]; // Tạo mảng mới nếu `prev` không hợp lệ
      }
      return [...prev, URL.createObjectURL(e.target.files[0])];
    });
  };
  return (
    <div
      style={{ padding: "120px 220px 70px 220px", background: "black" }}
      className="relative px-[72px] "
    >
      <div className="blur-layer-1 absolute top-[206px] !bg-blur-bg-primary right-1/2 z-[-1]"></div>
      <div className="blur-layer-1 absolute top-[300px] left-[900px] !bg-blur-bg-primary right-1/2 z-[-1]"></div>
      <div className="h-screen flex flex-col items-center justify-center bg-">
        <div className="w-full max-w-3xl mx-auto">
          {/* Phần Post Bài */}
          <div
            className="bg-white shadow-lg rounded-lg p-6 mb-4 relative z-[1001]"
            style={{ zIndex: "10001" }} //>?
          >
            <input
              className="w-full p-3 border !h-[70px] rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
              placeholder="Nhập nội dung bài viết..."
              value={ipMessage} //>?
              onChange={(e) => setIpMessage(e.target.value)}
              ref={input}
            />
            <div className="flex gap-4 items-center flex-nowrap">
              {/* Vùng hiển thị hình ảnh đã chọn */}
              <div className="flex gap-2">
                {tempIMGs.map(
                  (
                    img,
                    index //>?
                  ) => (
                    <div
                      key={index}
                      className="w-[60px] h-[60px] relative bg-[#fafafa] border-dotted rounded-xl border-[2px] border-sky-500 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                    >
                      <img
                        src={img}
                        alt="Selected preview"
                        className="object-cover w-full h-full"
                      />
                      {/* Nút xóa hình ảnh */}
                      <button
                        onClick={() => handleRemoveImage(index)} // Hàm xóa hình ảnh
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                  )
                )}

                {/* Ô chọn ảnh mới */}
                <div className="w-[60px] h-[60px] relative bg-[#fafafa] border-dotted rounded-xl border-[2px] border-sky-500 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105">
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

                <div className="post-container relative z-[50]">
                  {/* Nút chọn emoji */}
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)} //>?
                    title="Cảm xúc"
                    className="w-[60px] h-[60px] bg-gray-200 flex items-center justify-center rounded-lg hover:bg-gray-300 transition-transform duration-300 hover:scale-105"
                  >
                    😀
                  </button>

                  {/* Bảng chọn emoji */}
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute z-[1001]">
                      <EmojiPicker
                        onEmojiClick={
                          (emoji) => setIpMessage(ipMessage + emoji.emoji) //>?
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <>
                <div className="flex justify-between w-full gap-4">
                  <button
                    type="button"
                    onClick={handleSendMessage} //>?
                    title="Đăng"
                    className="w-[60px] h-[60px] bg-blue-500 flex items-center justify-center text-white border rounded-lg shadow-lg transition-transform duration-300 hover:bg-blue-400 hover:scale-105"
                  >
                    <i className="fad fa-paper-plane fa-spin text-black"></i>
                  </button>
                </div>
              </>
            </div>
          </div>

          <div className="mb-4 relative z-[1001]">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchPost}
              onChange={(e) => {
                //>?
                setSearchPost(e.target.value);
                setCurrentHashtag(""); // Reset currentHashtag khi người dùng thay đổi từ khóa tìm kiếm
                setHiddenSearch(true);
              }} // Dùng state searchPost để cập nhật từ khóa tìm kiếm
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setHiddenSearch(false); // Ẩn bảng gợi ý khi nhấn Enter
                }
              }}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />

            {/* Hiển thị gợi ý tìm kiếm */}
            {hiddenSearch && suggestions.length > 0 && (
              <ul
                className="absolute w-full bg-white shadow-lg rounded-lg mt-2 z-10 max-h-60 overflow-y-auto"
                style={{ zIndex: "1001" }}
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleSuggestionClick(suggestion);
                      setHiddenSearch(false);
                    }} // Xử lý khi nhấp vào gợi ý
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Hiển thị thông báo hashtag */}
          {currentHashtag && ( //>?
            <div className="bg-yellow-200 p-2 text-center font-bold text-white">
              Hashtag: {currentHashtag}
            </div>
          )}
          {currentHashtag && (
            <div
              className="bg-yellow-200 p-2 text-center font-bold flex justify-between items-center"
              style={{ zIndex: "1001" }}
            >
              <span>Đang ở hashtag: {currentHashtag}</span>
              <button
                onClick={handleResetSearch} // Reset khi bấm vào nút
                className="text-white bg-red-500 hover:bg-red-600 p-1 rounded-full ml-2"
              >
                Delete
              </button>
            </div>
          )}

          {/* Danh sách tin nhắn */}
          <div className="flex flex-col  overflow-x-hidden w-full h-full relative ">
            {messages
              .filter(
                (msg) => !msg.hidden || !msg.hidden.includes(userInfo.accID)
              )
              .map((msg, index) => (
                <div
                  key={msg.id}
                  className="relative bg-ss	 backdrop-blur border-white border text-white shadow-lg rounded-lg mb-4 p-4"
                  style={{ "z-index": `${1000 - index}` }}
                >
                  <div className="pb-[100px]">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                          <img
                            className="object-cover"
                            src={msg.userInfo?.avatar}
                          />
                        </div>
                        <div className="text-white font-semibold">
                          {msg.userInfo?.fullName}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>{msg?.edited ? "(Đã chỉnh sửa)" : null}</div>

                        {/* Thời gian tương đối (số phút trước) */}
                        <div className="text-white text-sm group relative">
                          <span>{formatRelativeTime(msg.timestamp)}</span>

                          {/* Thời gian chi tiết (hiển thị khi hover vào thời gian tương đối) */}
                          <div
                            className="absolute left-0 mt-1 w-max bg-white text-black text-xs px-2 py-1 border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ transform: "translateY(100%)" }} // Đặt vị trí bên dưới số phút
                          >
                            {new Date(msg.timestamp).toLocaleDateString()}{" "}
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {/* Dấu ba chấm */}
                        <div className="relative group ml-6">
                          <button
                            className="text-white hover:text-white focus:outline-none"
                            onClick={() => {
                              setShowSettings(msg.id);
                              setIsShow(!isShow);
                            }}
                          >
                            <i className="fas fa-ellipsis-h text-lg"></i>
                          </button>

                          {/* Hiển thị tùy chọn khi nhấp vào dấu ba chấm */}
                          {showSettings === msg.id && isShow && (
                            <div
                              ref={settingsRef}
                              className="absolute right-0 w-[100px] bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                            >
                              {/* Nút ẩn bài viết */}
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                <i
                                  className="fas fa-do-not-enter"
                                  style={{ color: "red" }}
                                ></i>{" "}
                                <span className="text-black">Ẩn bài viết</span>
                              </button>

                              {/* Nút xóa bài viết (chỉ hiển thị nếu là người dùng hoặc admin) */}
                              {(msg?.userInfo?.accID === userInfo?.accID ||
                                userInfo?.role === "ADMIN") && (
                                <button
                                  onClick={() => handleRemoveMessage(msg.id)}
                                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                  <i
                                    className="fad fa-trash-alt"
                                    style={{ color: "red" }}
                                  ></i>{" "}
                                  <span className="text-black">
                                    Xóa bài viết
                                  </span>
                                </button>
                              )}

                              {/* Nút chỉnh sửa bài viết */}
                              {msg?.userInfo?.accID === userInfo?.accID && (
                                <div>
                                  <button
                                    onClick={() => {
                                      setTempImageEditPost(msg.fileUrls);
                                      handleEditPost(msg.id);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                  >
                                    <i
                                      className="fal fa-file-edit"
                                      style={{ color: "blue" }}
                                    ></i>{" "}
                                    <span className="text-black">
                                      Chỉnh sửa
                                    </span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      {msg.message.split(" ").map((word, index) => {
                        // Nếu là hashtag
                        if (word.startsWith("#")) {
                          return (
                            <span
                              key={index}
                              className="text-blue-500 font-bold cursor-pointer"
                              style={{ color: "blue" }}
                              onClick={() => handleHashtagClick(word)}
                            >
                              {word}
                            </span>
                          );
                        }

                        // Nếu là từ trùng với từ tìm kiếm
                        const highlightedWord =
                          searchPost &&
                          word
                            .toLowerCase()
                            .includes(searchPost.toLowerCase()) ? (
                            <span
                              key={index}
                              className="bg-red-500  text-white"
                            >
                              {word}
                            </span>
                          ) : (
                            renderMessageWithLinks(word)
                          );

                        return <span key={index}>{highlightedWord} </span>;
                      })}
                    </div>
                  </div>
                  <div className=" items-center justify-center">
                    {editMode[msg.id] ? (
                      <>
                      <div className="flex gap-4">
                        {tempImageEditPost &&
                          tempImageEditPost.length > 0 &&
                          tempImageEditPost.map((item, index) => (
                            <div>
                              {" "}
                              <img key={index} src={item} className="w-[100px] h-[100px] object-cover rounded-xl"/>
                              <button
                                onClick={() => handleRemoveEditImage(index)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          </div>
                        <textarea
                          value={editContent[msg.id] || msg.message}
                          onChange={(e) =>
                            setEditContent((prev) => ({
                              ...prev,
                              [msg.id]: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 mt-2 text-black"
                        />
                        {/* Nút Gửi File */}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            ref={fileComment}
                            onChange={(e) => {
                              handleAddNewImagePostEdit(e);
                            }}
                            multiple
                          />
                        </label>
                        <button
                          onClick={() => handleSaveEdit(msg.id)} // Gọi hàm lưu khi nhấn Lưu
                          className="bg-blue-500 text-white p-2 rounded-lg shadow-lg mt-2 hover:bg-blue-400"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => handleCancelEdit(msg.id)} // Gọi hàm hủy khi nhấn Hủy
                          className="bg-gray-300 text-white p-2 rounded-lg shadow-lg mt-2 hover:bg-gray-400 ml-2"
                        >
                          Hủy
                        </button>
                      </>
                    ) : null}

                    {!editMode[msg.id] && msg.fileUrls && msg?.fileUrls?.length > 0 && (
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
                              {editMode[msg.id] && (
                                <button
                                  onClick={() =>
                                    handleRemoveImages(msg.id, index)
                                  }
                                >
                                  Xóa
                                </button>
                              )}

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
                  {msg.reactions?.length && (
                    <div className="flex items-center group space-x-2">
                      {/* Reaction count with hover effects */}
                      <div
                        onMouseEnter={handleMouseEnterr}
                        onMouseLeave={handleMouseLeavee}
                        className="cursor-pointer text-black font-semibold text-lg p-2 rounded-lg bg-gray-200 transition-all group-hover:shadow-xl"
                      >
                        {countReactions(msg.reactions)?.count}
                      </div>

                      {/* Content that fades in when hovered */}
                      <div className="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                        {countReactions(msg.reactions)?.content}
                      </div>
                    </div>
                  )}
                  {/* Phần biểu cảm */}
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
                              className="cursor-pointer text-2xl text-white"
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
                              className="cursor-pointer text-white"
                              role="img"
                              aria-label="like"
                              onClick={() => handleSelectReaction(msg.id, "👍")}
                            >
                              <i className="far fa-thumbs-up text-2xl"></i>
                            </span>
                          )
                        ) : (
                          <span
                            className="cursor-pointer text-white"
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
                      <div className="text-white"></div>
                    </div>
                    <div
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleToggleCommentBox(msg.id)}
                    >
                      <i className="fad fa-comment-lines text-2xl"></i>
                    </div>
                  </div>

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
                              <div className="flex items-center gap-4">
                              <img src={comment.userInfo.avatar} className="w-[40px] h-[40px] rounded-full object-cover"/>
                              <div className="text-white text-sm font-semibold">
                                {comment.userInfo.fullName}
                              </div>
                              </div>
                        
                              <div className="text-white text-sm">
                                {new Date(
                                  comment.timestamp
                                ).toLocaleDateString()}{" "}
                                {new Date(comment.timestamp).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </div>
                            </div>

                            {/* Kiểm tra nếu đang ở chế độ chỉnh sửa bình luận */}
                            {editCommentMode.postId === msg.id &&
                            editCommentMode.commentId === comment.id &&
                            comment.userInfo?.accID === userInfo?.accID ? (
                              <>
                                <div>
                                  {currentFileComment?.length > 0 &&
                                    currentFileComment.map((item, index) => (
                                      <div>
                                        <img
                                          key={index}
                                          className="w-[80px] h-[80px] rounded-xl object-contain"
                                          src={item}
                                          alt="comment attachment"
                                        />
                                        <span
                                          className=" text-black bg-red-500 text-white rounded-xl p-2"
                                          onClick={(e) =>
                                            handleRemoveEditImageComment(index)
                                          }
                                        >
                                          Xoa
                                        </span>
                                      </div>
                                    ))}
                                </div>
                                <textarea
                                  value={
                                    editCommentContent.currentComment ||
                                    comment.comment
                                  }
                                  onChange={(e) =>
                                    setEditCommentContent({
                                      currentComment: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 mt-2 text-black"
                                />
                                <label className="cursor-pointer">
                                  <input
                                    type="file"
                                    ref={fileComment}
                                    onChange={(e) => {
                                      handleAddNewEditCommentFile(e);
                                    }}
                                    multiple
                                  />
                                </label>
                                <button
                                  onClick={
                                    () =>
                                      handleSaveEditComment(msg.id, comment.id) //cc
                                  }
                                  className="bg-blue-500 text-white p-2 rounded-lg shadow-lg mt-2 hover:bg-blue-400"
                                >
                                  Lưu
                                </button>
                                <button
                                  onClick={() =>
                                    handleCancelEditComment(comment.id)
                                  }
                                  className="bg-gray-300 text-white p-2 rounded-lg shadow-lg mt-2 hover:bg-gray-400 ml-2"
                                >
                                  Hủy
                                </button>
                              </>
                            ) : (
                              <div>
                                {" "}
                                <div className="flex gap-4">
                                  {comment?.fileUrls?.length > 0 &&
                                    comment.fileUrls.map((item, index) => (
                                      <img
                                        key={index}
                                        className="w-[80px] h-[80px] rounded-xl object-contain"
                                        src={item}
                                        alt="comment attachment"
                                      />
                                    ))}
                                </div>
                                <p className="text-white mt-1">
                                  {comment.comment}
                                  {comment.edited && (
                                    <span className="text-sm text-white">
                                      {" "}
                                      (đã chỉnh sửa)
                                    </span>
                                  )}
                                </p>
                              </div>
                            )}

                            {/* Nút chỉnh sửa chỉ hiển thị nếu là bình luận của người dùng */}
                            {/* {comment.userInfo?.accID === userInfo?.accID && ( //cc
                              <button
                                onClick={() => {
                                  setPrevComment(comment.comment);
                                  setCurrentFileComment(comment?.fileUrls);
                                  console.log("Editing comment:", comment); // kiểm tra xem có đủ dữ liệu chưa
                                  handleEditComment(
                                    msg.id,
                                    comment.id,
                                    comment.comment
                                  );
                                }}
                                className="text-blue-500 text-sm mt-1"
                              >
                                Chỉnh sửa
                              </button>
                            )} */}
                            {/* Nút "Xóa bình luận" chỉ hiển thị nếu người dùng là người đăng hoặc là admin */}
                            {comment.userInfo?.accID === userInfo?.accID ||
                            userInfo?.role === "ADMIN" ? (
                              <button
                                onClick={() =>
                                  deleteComment(msg.id, comment.id)
                                }
                                className="text-red-500 text-sm mt-1"
                              >
                                Xóa bình luận
                              </button>
                            ) : null}

                            {comment.fileUrl && (
                              <img
                                src={comment.fileUrl}
                                alt="comment attachment"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      {tempCommentIMGs[msg.id]?.map((img, index) => (
                        <div
                          key={index}
                          className="w-[60px] h-[60px] relative bg-[#fafafa] border-dotted rounded-xl border-[2px] border-sky-500 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                        >
                          <img
                            src={img}
                            alt="Selected preview"
                            className="object-cover w-full h-full"
                          />
                          <button
                            onClick={() =>
                              handleRemoveCommentImage(msg.id, index)
                            } // Thêm hàm xóa ảnh
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            X
                          </button>
                        </div>
                      ))}

                      <textarea
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 mt-2 text-black"
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
                      <div className="flex items-center space-x-4 mt-2">
                        {/* Nút chọn file */}
                        <label className="cursor-pointer">
                          <i className="fa-regular fa-folder-open mr-2"></i>
                          <input
                            type="file"
                            ref={fileComment}
                            onChange={(e) => {
                              handleCommentFileChange(e, msg.id);
                              setCommentFile((prev) => ({
                                ...prev,
                                [msg.id]: e.target.files[0],
                              }));
                            }}
                            className="hidden"
                            multiple
                          />
                        </label>

                        {/* Nút chọn emoji */}
                        <button
                          onClick={() => setShowEmojiPickerCmt(msg.id)}
                          className="w-[60px] h-[60px] bg-gray-200 flex items-center justify-center rounded-lg hover:bg-gray-300 transition-transform duration-300 hover:scale-105"
                        >
                          😀
                        </button>

                        {/* Bảng chọn emoji */}
                        {showEmojiPickerCmt === msg.id && (
                          <div
                            ref={emojiPickerRef}
                            className="absolute z-[99950]"
                          >
                            <EmojiPicker
                              onEmojiClick={(emoji) =>
                                setCommentInput((prev) => ({
                                  ...prev,
                                  [msg.id]: (prev[msg.id] || "") + emoji.emoji, // Thêm chuỗi rỗng nếu undefined
                                }))
                              }
                            />
                          </div>
                        )}

                        {/* Nút gửi bình luận */}
                        <button
                          type="button"
                          className="bg-blue-500 text-white p-2 rounded-lg shadow-lg hover:bg-blue-400"
                          onClick={() => handleSendComment(msg.id)}
                        >
                          <i className="fad fa-paper-plane fa-spin  yellow"></i>
                        </button>
                      </div>
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
