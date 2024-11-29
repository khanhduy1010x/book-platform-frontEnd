import React, { useState, useEffect } from "react";

function FavoriteNotification({ book }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div
      className={`fixed top-20 right-0 z-50 flex p-4 bg-background-white backdrop-blur text-white border-primary border font-bold rounded-lg shadow-lg items-center gap-4 transform transition-transform duration-500 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col items-center justify-center border p-2 rounded-xl">
        <img
          src={book?.coverImage || "https://via.placeholder.com/50x75"}
          alt="Book Cover"
          className="w-14 h-20 object-cover rounded shadow"
        />
        <p className="text-[12px] mt-2">{book?.bookName || "Tên sách"}</p>
      </div>
      <div className="text-[14px]">
        <p className="text-[18px]">Đã thêm vào yêu thích!</p>
        <p>Ấn vào để xem danh sách yêu thích</p>
      </div>
    </div>
  );
}

export default FavoriteNotification;
