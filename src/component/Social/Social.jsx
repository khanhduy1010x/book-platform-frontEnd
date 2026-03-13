import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ref, push, get, remove, onValue, update } from "firebase/database";
import { database } from "../../config/firebase.js";
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

  // Hàm upload file lên Cloudinary và trả về URL
  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dohwcdeux/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  };
  const emojiPickerRef = useRef(null); // Tạo ref cho bảng emoji
  const emojiButtonRef = useRef(null); // Ref cho button mở emoji
  const [emojiPickerPos, setEmojiPickerPos] = useState({ top: 0, left: 0 });

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
    // Tải lên Cloudinary
    const uploadedFileUrls = await Promise.all(file.map((f) => uploadFile(f)));
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
    // Tải lên Cloudinary
    const uploadedFileUrls = await Promise.all(file.map((f) => uploadFile(f)));
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

    // Tải lên Cloudinary
    try {
      const uploadedFileUrls = await Promise.all(files.map((f) => uploadFile(f)));
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

    // Tải lên Cloudinary
    const uploadedFileUrls = await Promise.all(filesToUpload.map((f) => uploadFile(f)));
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

  const trendingHashtags = (() => {
    const map = {};
    messages.forEach(msg => {
      msg.message?.split(' ').forEach(word => {
        if (word.startsWith('#') && word.length > 1) {
          const tag = word.toLowerCase();
          map[tag] = (map[tag] || 0) + 1;
        }
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  })();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#13131f] to-[#0a0a14] pt-[72px] sm:pt-[100px] lg:pt-[120px] pb-[70px] px-4 sm:px-6 lg:px-8">
      <div className="blur-layer-1 absolute top-[206px] !bg-blur-bg-primary right-1/2 z-[-1]"></div>
      <div className="blur-layer-1 absolute top-[300px] left-[900px] !bg-blur-bg-primary right-1/2 z-[-1]"></div>
      <div className="min-h-screen max-w-6xl mx-auto">
        <div className="flex gap-6 lg:gap-8 items-start">
          <div className="flex-1 min-w-0">

          {/* Phần Post Bài */}
          <div className="bg-[#1e1e2e] shadow-xl rounded-2xl p-4 sm:p-6 mb-6 relative z-[1001] border border-white/10">
            <input
              className="w-full p-3 bg-gray-700 border border-white/10 text-white placeholder:text-gray-400 h-[60px] sm:h-[70px] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm sm:text-base"
              rows="4"
              placeholder="Nhập nội dung bài viết..."
              value={ipMessage}
              onChange={(e) => setIpMessage(e.target.value)}
              ref={input}
            />
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center mt-2">
              <div className="flex flex-wrap gap-2 items-center">
                {tempIMGs.map((img, index) => (
                  <div
                    key={index}
                    className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] relative bg-[#fafafa] border-dotted rounded-xl border-[2px] border-sky-500 flex items-center justify-center transition-transform duration-300 hover:scale-105 overflow-hidden"
                  >
                    <img src={img} alt="Selected preview" className="object-cover w-full h-full rounded-xl" />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] leading-none"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                  <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] relative bg-[#2a2a3e] border-dotted rounded-xl border-[2px] border-sky-500/60 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105">
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer" }}
                  />
                  <i className="fa-solid fa-folder-plus text-gray-300"></i>
                </div>
                <div className="post-container relative z-[50]">
                  <button
                    ref={emojiButtonRef}
                    onClick={() => {
                      if (!showEmojiPicker && emojiButtonRef.current) {
                        const rect = emojiButtonRef.current.getBoundingClientRect();
                        setEmojiPickerPos({
                          top: rect.bottom + window.scrollY + 8,
                          left: rect.left + window.scrollX,
                        });
                      }
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    title="Cảm xúc"
                    className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] bg-gray-600 flex items-center justify-center rounded-xl hover:bg-gray-500 transition-all duration-200 hover:scale-105 text-xl"
                  >
                    😀
                  </button>
                  {showEmojiPicker && createPortal(
                    <div
                      ref={emojiPickerRef}
                      style={{ top: emojiPickerPos.top, left: emojiPickerPos.left }}
                      className="fixed z-[99999] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                      <EmojiPicker onEmojiClick={(emoji) => setIpMessage(ipMessage + emoji.emoji)} theme="dark" />
                    </div>,
                    document.body
                  )}
                </div>
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={handleSendMessage}
                  title="Đăng"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full font-semibold text-sm shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
                >
                  <i className="fad fa-paper-plane text-base"></i>
                  <span>Đăng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tìm kiếm */}
          <div className="mb-4 relative z-[1001]">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchPost}
              onChange={(e) => {
                setSearchPost(e.target.value);
                setCurrentHashtag("");
                setHiddenSearch(true);
              }}
              onKeyDown={(e) => { if (e.key === "Enter") setHiddenSearch(false); }}
              className="w-full p-3 bg-gray-700 border border-white/10 text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            {hiddenSearch && suggestions.length > 0 && (
              <ul className="absolute w-full bg-white shadow-xl rounded-xl mt-2 z-[1001] max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => { handleSuggestionClick(suggestion); setHiddenSearch(false); }}
                    className="p-3 cursor-pointer hover:bg-gray-100 text-sm first:rounded-t-xl last:rounded-b-xl"
                  >
                    {suggestion.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Hashtag banner */}
          {currentHashtag && (
            <div className="bg-yellow-400 text-black p-2 text-center font-bold rounded-lg mb-2 text-sm">
              Hashtag: {currentHashtag}
            </div>
          )}
          {currentHashtag && (
            <div className="bg-yellow-400 text-black p-3 rounded-xl font-bold flex justify-between items-center mb-4 relative z-[1001]">
              <span className="text-sm">Đang ở hashtag: {currentHashtag}</span>
              <button
                onClick={handleResetSearch}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full text-xs font-semibold transition-all"
              >
                <i className="fa-solid fa-xmark text-[10px]"></i> Xóa
              </button>
            </div>
          )}

          {/* Danh sách bài viết */}
          <div className="flex flex-col gap-10 w-full">
            {messages
              .filter((msg) => !msg.hidden || !msg.hidden.includes(userInfo.accID))
              .map((msg, index) => (
                <div
                  key={msg.id}
                  className="relative bg-[#1e1e2e] border border-white/10 text-white shadow-xl rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-colors"
                  style={{ zIndex: `${1000 - index}` }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img className="object-cover w-full h-full" src={msg.userInfo?.avatar} alt="" />
                      </div>
                      <span className="text-white font-semibold text-sm sm:text-base">{msg.userInfo?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {msg?.edited && <span className="text-gray-400 text-xs">(Đã chỉnh sửa)</span>}
                      <div className="text-gray-400 text-xs group relative">
                        <span className="cursor-default">{formatRelativeTime(msg.timestamp)}</span>
                        <div
                          className="absolute right-0 mt-1 w-max bg-white text-black text-xs px-2 py-1 border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ transform: "translateY(100%)" }}
                        >
                          {new Date(msg.timestamp).toLocaleDateString()}{" "}
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          className="text-gray-300 hover:text-white focus:outline-none p-1"
                          onClick={() => { setShowSettings(msg.id); setIsShow(!isShow); }}
                        >
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                        {showSettings === msg.id && isShow && (
                          <div
                            ref={settingsRef}
                            className="absolute right-0 top-8 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                          >
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                            >
                              <i className="fas fa-do-not-enter text-red-500 w-4"></i>
                              <span className="text-gray-700">Ẩn bài viết</span>
                            </button>
                            {(msg?.userInfo?.accID === userInfo?.accID || userInfo?.role === "ADMIN") && (
                              <button
                                onClick={() => handleRemoveMessage(msg.id)}
                                className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                              >
                                <i className="fad fa-trash-alt text-red-500 w-4"></i>
                                <span className="text-gray-700">Xóa bài viết</span>
                              </button>
                            )}
                            {msg?.userInfo?.accID === userInfo?.accID && (
                              <button
                                onClick={() => { setTempImageEditPost(msg.fileUrls); handleEditPost(msg.id); }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                              >
                                <i className="fal fa-file-edit text-blue-500 w-4"></i>
                                <span className="text-gray-700">Chỉnh sửa</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="text-gray-100 text-sm sm:text-base leading-relaxed mb-3">
                    {msg.message.split(" ").map((word, index) => {
                      if (word.startsWith("#")) {
                        return (
                          <span
                            key={index}
                            className="text-blue-400 font-bold cursor-pointer hover:underline"
                            onClick={() => handleHashtagClick(word)}
                          >
                            {word}{" "}
                          </span>
                        );
                      }
                      const highlightedWord =
                        searchPost && word.toLowerCase().includes(searchPost.toLowerCase()) ? (
                          <span key={index} className="bg-red-500 text-white rounded px-0.5">{word}</span>
                        ) : (
                          renderMessageWithLinks(word)
                        );
                      return <span key={index}>{highlightedWord} </span>;
                    })}
                  </div>

                  {/* Chỉnh sửa bài viết */}
                  {editMode[msg.id] ? (
                    <div className="mt-2 mb-3">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tempImageEditPost && tempImageEditPost.length > 0 &&
                          tempImageEditPost.map((item, index) => (
                            <div key={index} className="relative">
                              <img src={item} className="w-[80px] h-[80px] object-cover rounded-xl" />
                              <button
                                onClick={() => handleRemoveEditImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                      </div>
                      <textarea
                        value={editContent[msg.id] || msg.message}
                        onChange={(e) => setEditContent((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-blue-300 text-black resize-none text-sm"
                        rows={3}
                      />
                      <label className="cursor-pointer text-xs text-blue-400 mt-1 block">
                        <input type="file" ref={fileComment} onChange={(e) => { handleAddNewImagePostEdit(e); }} multiple className="hidden" />
                        <i className="fa-regular fa-folder-open mr-1"></i> Thêm ảnh
                      </label>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleSaveEdit(msg.id)} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-all"><i className="fa-solid fa-check text-xs"></i> Lưu</button>
                        <button onClick={() => handleCancelEdit(msg.id)} className="flex items-center gap-1.5 px-4 py-2 bg-[#2a2a3e] border border-white/10 text-gray-300 rounded-full text-sm font-semibold hover:bg-[#35354f] transition-all"><i className="fa-solid fa-xmark text-xs"></i> Hủy</button>
                      </div>
                    </div>
                  ) : null}

                  {/* Ảnh bài viết */}
                  {!editMode[msg.id] && msg.fileUrls && msg?.fileUrls?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 mb-3">
                      {msg.fileUrls
                        .slice(0, !showAllImages[msg.id] && msg?.fileUrls?.length > 3 ? subImg : msg?.fileUrls?.length)
                        .map((url, index) => (
                          <div key={index} className="aspect-square rounded-xl overflow-hidden">
                            <img src={url} alt={`Uploaded file ${index}`} className="object-cover w-full h-full" />
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Toggle ảnh */}
                  {!showAllImages[msg.id] && msg?.fileUrls?.length > subImg ? (
                    <button onClick={() => handleToggleShowImages(msg.id)} className="text-xs text-primary/80 hover:text-primary mt-1 mb-2 flex items-center gap-1 transition-colors">
                      <i className="fa-solid fa-chevron-down text-[10px]"></i> Hiển thị thêm
                    </button>
                  ) : msg?.fileUrls?.length > 3 ? (
                    <button onClick={() => handleToggleShowImages(msg.id)} className="text-xs text-primary/80 hover:text-primary mt-1 mb-2 flex items-center gap-1 transition-colors">
                      <i className="fa-solid fa-chevron-up text-[10px]"></i> Hiển thị bớt
                    </button>
                  ) : null}

                  {/* Reaction count */}
                  {msg.reactions?.length ? (
                    <div className="flex items-center group gap-2 mb-2">
                      <div
                        onMouseEnter={handleMouseEnterr}
                        onMouseLeave={handleMouseLeavee}
                        className="cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                      >
                        {countReactions(msg.reactions)?.count}
                      </div>
                      <div className="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 text-sm">
                        {countReactions(msg.reactions)?.content}
                      </div>
                    </div>
                  ) : null}

                  {/* Action bar */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1 relative">
                      <div
                        className="cursor-pointer"
                        onMouseEnter={() => handleMouseEnter(msg.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {msg.reactions && msg.reactions.length > 0 ? (
                          msg.reactions.find((reaction) => reaction?.accID === userInfo?.accID) ? (
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-white text-sm hover:bg-primary/30 transition-all"
                              onClick={() => handleSelectReaction(msg.id, msg.reactions.find((r) => r?.accID === userInfo?.accID)?.reaction)}
                            >
                              <span>{msg.reactions.find((r) => r?.accID === userInfo?.accID)?.reaction}</span>
                              <span className="text-xs text-gray-300">{msg.reactions.length}</span>
                            </button>
                          ) : (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-all" onClick={() => handleSelectReaction(msg.id, "👍")}>
                              <i className="far fa-thumbs-up text-sm"></i>
                              <span className="text-xs">{msg.reactions.length}</span>
                            </button>
                          )
                        ) : (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-all" onClick={() => handleSelectReaction(msg.id, "👍")}>
                            <i className="far fa-thumbs-up text-sm"></i>
                            <span className="text-xs">Thích</span>
                          </button>
                        )}
                        {showReactions === msg.id && (
                          <div className="absolute bottom-12 left-0 z-10 bg-[#1e1e2e] border border-white/10 shadow-2xl rounded-2xl px-3 py-2 text-2xl flex gap-3">
                            {["👍", "❤️", "😂", "😢", "😡"].map((emoji, i) => (
                              <span
                                key={i}
                                className="cursor-pointer hover:scale-125 transition-transform"
                                role="img"
                                onClick={() => handleSelectReaction(msg.id, emoji)}
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:text-white transition-all"
                      onClick={() => handleToggleCommentBox(msg.id)}
                    >
                      <i className="fad fa-comment-lines text-sm"></i>
                      <span className="text-xs">{msg.comments?.length > 0 ? msg.comments.length : "Bình luận"}</span>
                    </button>
                  </div>

                  {/* Bình luận */}
                  {showCommentBox[msg.id] && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex flex-col gap-3">
                        {msg.comments?.map((comment, index) => (
                          <div key={index} className="bg-[#2a2a3e] border border-white/10 rounded-xl p-3">
                            <div className="flex justify-between items-center mb-1.5">
                              <div className="flex items-center gap-2">
                                <img src={comment.userInfo.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="" />
                                <span className="text-white text-sm font-semibold">{comment.userInfo.fullName}</span>
                              </div>
                              <span className="text-gray-400 text-[11px]">
                                {new Date(comment.timestamp).toLocaleDateString()}{" "}
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            {editCommentMode.postId === msg.id && editCommentMode.commentId === comment.id && comment.userInfo?.accID === userInfo?.accID ? (
                              <>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {currentFileComment?.length > 0 && currentFileComment.map((item, index) => (
                                    <div key={index} className="relative">
                                      <img className="w-[70px] h-[70px] rounded-xl object-cover" src={item} alt="comment attachment" />
                                      <span
                                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] cursor-pointer"
                                        onClick={(e) => handleRemoveEditImageComment(index)}
                                      >
                                        ✕
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <textarea
                                  value={editCommentContent.currentComment || comment.comment}
                                  onChange={(e) => setEditCommentContent({ currentComment: e.target.value })}
                                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-blue-300 text-black resize-none text-sm"
                                  rows={2}
                                />
                                <label className="cursor-pointer text-xs text-blue-400 block mt-1">
                                  <input type="file" ref={fileComment} onChange={(e) => { handleAddNewEditCommentFile(e); }} multiple className="hidden" />
                                  <i className="fa-regular fa-folder-open mr-1"></i> Thêm ảnh
                                </label>
                                <div className="flex gap-2 mt-2">
                                  <button onClick={() => handleSaveEditComment(msg.id, comment.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full text-xs font-semibold hover:opacity-90 transition-all"><i className="fa-solid fa-check text-[10px]"></i> Lưu</button>
                                  <button onClick={() => handleCancelEditComment(comment.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a3e] border border-white/10 text-gray-300 rounded-full text-xs font-semibold hover:bg-[#35354f] transition-all"><i className="fa-solid fa-xmark text-[10px]"></i> Hủy</button>
                                </div>
                              </>
                            ) : (
                              <div>
                                <div className="flex flex-wrap gap-2 mb-1">
                                  {comment?.fileUrls?.length > 0 && comment.fileUrls.map((item, index) => (
                                    <img key={index} className="w-[70px] h-[70px] rounded-xl object-cover" src={item} alt="comment attachment" />
                                  ))}
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                  {comment.comment}
                                  {comment.edited && <span className="text-xs text-gray-400 ml-1">(đã chỉnh sửa)</span>}
                                </p>
                              </div>
                            )}
                            {/* Nút chỉnh sửa chỉ hiển thị nếu là bình luận của người dùng */}
                            {/* {comment.userInfo?.accID === userInfo?.accID && ( //cc
                              <button
                                onClick={() => {
                                  setPrevComment(comment.comment);
                                  setCurrentFileComment(comment?.fileUrls);
                                  console.log("Editing comment:", comment);
                                  handleEditComment(msg.id, comment.id, comment.comment);
                                }}
                                className="text-blue-500 text-sm mt-1"
                              >
                                Chỉnh sửa
                              </button>
                            )} */}
                            {(comment.userInfo?.accID === userInfo?.accID || userInfo?.role === "ADMIN") && (
                              <button
                                onClick={() => deleteComment(msg.id, comment.id)}
                                className="mt-2 flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-400 transition-colors"
                              >
                                <i className="fa-regular fa-trash-can text-[10px]"></i> Xóa
                              </button>
                            )}
                            {comment.fileUrl && <img src={comment.fileUrl} alt="comment attachment" className="mt-2 rounded-lg max-w-full" />}
                          </div>
                        ))}
                      </div>

                      {/* Preview ảnh comment */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tempCommentIMGs[msg.id]?.map((img, index) => (
                          <div key={index} className="w-[52px] h-[52px] relative rounded-xl overflow-hidden border-2 border-sky-500">
                            <img src={img} alt="Selected preview" className="object-cover w-full h-full" />
                            <button
                              onClick={() => handleRemoveCommentImage(msg.id, index)}
                              className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      <textarea
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-blue-300 mt-3 text-black resize-none text-sm"
                        rows="2"
                        placeholder="Nhập bình luận..."
                        value={commentInput[msg.id] || ""}
                        onChange={(e) => setCommentInput((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                      />
                      <div className="flex items-center gap-2 sm:gap-3 mt-2">
                        <label className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                          <i className="fa-regular fa-folder-open text-lg"></i>
                          <input
                            type="file"
                            ref={fileComment}
                            onChange={(e) => { handleCommentFileChange(e, msg.id); setCommentFile((prev) => ({ ...prev, [msg.id]: e.target.files[0] })); }}
                            className="hidden"
                            multiple
                          />
                        </label>
                        <button
                          type="button"
                          className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full text-sm font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition-all flex-shrink-0"
                          onClick={() => handleSendComment(msg.id)}
                        >
                          <i className="fad fa-paper-plane text-sm"></i>
                          <span>Gửi</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          </div>{/* end feed column */}

          {/* Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 w-[260px] xl:w-[300px] flex-shrink-0 sticky top-24">

            {/* User card */}
            <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={userInfo?.avatar} className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="" />
                <div>
                  <div className="text-white font-semibold text-sm">{userInfo?.fullName}</div>
                  <div className="text-gray-400 text-xs">ID: {userInfo?.accID}</div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-center">
                <div>
                  <div className="text-white font-bold text-lg">{messages.filter(m => m.userInfo?.accID === userInfo?.accID).length}</div>
                  <div className="text-gray-400 text-xs">Bài viết</div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{messages.reduce((acc, m) => acc + (m.reactions?.length || 0), 0)}</div>
                  <div className="text-gray-400 text-xs">Lượt thích</div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{messages.reduce((acc, m) => acc + (m.comments?.length || 0), 0)}</div>
                  <div className="text-gray-400 text-xs">Bình luận</div>
                </div>
              </div>
            </div>

            {/* Trending hashtags */}
            {trendingHashtags.length > 0 && (
              <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl p-4">
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <span>🔥</span> Đang thịnh hành
                </h3>
                <div className="flex flex-col gap-2">
                  {trendingHashtags.map(([tag, count]) => (
                    <button
                      key={tag}
                      onClick={() => { setCurrentHashtag(tag); setHiddenSearch(false); }}
                      className="flex justify-between items-center px-3 py-2 rounded-xl bg-[#2a2a3e] hover:bg-[#35354f] transition-colors text-left w-full"
                    >
                      <span className="text-blue-400 text-sm font-medium">{tag}</span>
                      <span className="text-gray-500 text-xs">{count} bài</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gợi ý */}
            <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl p-4">
              <h3 className="text-white font-bold text-sm mb-3">💡 Mẹo hay</h3>
              <ul className="text-gray-400 text-xs flex flex-col gap-2">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Dùng <span className="text-blue-400">#hashtag</span> để phân loại bài viết</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Nhấn vào hashtag để xem bài viết cùng chủ đề</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Hover vào thời gian để xem giờ cụ thể</li>
              </ul>
            </div>

          </div>{/* end sidebar */}

        </div>{/* end flex row */}
      </div>
    </div>
  );
}

export default Social;
