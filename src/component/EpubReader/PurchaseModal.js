import React from "react";
import { useAPI } from "../Service/APIContext";
import { useNavigate } from "react-router-dom";

export default function PurchaseModal({
  setShowPaymentModal,
  bookInfo,
  onClose,
  onBuy,
}) {
  const {memberMapper, formatNumber} = useAPI();
  const navigate = useNavigate();
  const handleClickBuy = () => {
    if(bookInfo.memberType === "NONE" && bookInfo.price > 0) {
      onClose();
      setShowPaymentModal(true);
    } else {
      navigate('/member-ship')
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 font-oswald">
      <div className="bg-background-book border-white border text-white w-[400px] rounded-xl p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
<i className="fa-solid fa-xmark"></i>        </button>

        {/* Modal Title */}
        <h2 className="text-[28px] font-bold text-center mb-4">Thông báo</h2>

        {/* Content */}
        <p className="text-center text-[18px] text-gray-300 mb-4">
       {bookInfo.memberType != "NONE" ? ( 
        <>
         Để đọc hết nội dung cuốn sách này bạn cần trở thành <br></br> <span className="text-primary">"{memberMapper(bookInfo.memberType)}"</span></>
       ) : (
        <>
         Để đọc hết nội dung cuốn sách này bạn cần mua nội dung sách này với giá <br></br> <span className="text-primary font-bold">{formatNumber(bookInfo.price)}đ</span>
         </>
       ) }  
        </p>

        {/* Book Image */}
        <div
        className="flex items-center justify-center"
        >
        <div className="flex justify-center mb-4  w-32 h-50 relative rounded-xl z-10 overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full book-border z-5"></div>
          <img
            src={bookInfo?.coverImage}
            alt={bookInfo?.bookName}
            className="  object-cover "
          />
        </div>
        </div>
<div className="flex justify-center font-bold mb-4">
  <div>{bookInfo.bookName} - {bookInfo.author.name}</div>
</div>
        {/* Buy Button */}
        <button
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
          onClick={() => handleClickBuy()}
        >
          {
            bookInfo.memberType === "NONE" && bookInfo.price > 0 ? "Mua sách ngay" : "Trở thành hội viên"
          }
          </button>
      </div>
    </div>
  );
}
