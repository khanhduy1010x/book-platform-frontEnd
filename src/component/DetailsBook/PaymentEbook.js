import React, { useEffect, useState } from "react";
import { useAPI } from "../Service/APIContext";
import { Link } from "react-router-dom";
import gif from '../../assets/image/successQR.gif'
function PaymentEbook({bookInfo,setShowPaymentModal,reLoad = false }) {
  const [afterPayment, setAfterPayment] = useState(false);
const {formatNumber, buyEbook,} = useAPI();
const [ errorBuyBook , setErrorBuyBook] = useState(false);
  const handleConfirm = async () => {
const resp = await buyEbook(bookInfo?.book?.id);
if (resp) { 
  setAfterPayment(true);

} else {
  setErrorBuyBook(true)
}
  };


  const handleCancel = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 relative z-[99999]] font-oswald" >
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[99999]">
          
         {
      !afterPayment  ? 
         <div className="bg-background-book backdrop-blur border-yellow-200 border-[1px] rounded-lg shadow-lg p-6 w-[400px] ">
            <div>
            <h2 className="text-xl font-bold text-white text-center">
              Xác Nhận Mua Sách
            </h2>
            <div className="mt-4 text-gray-600 text-center text-white flex items-center justify-center flex-col ">
        { !errorBuyBook ?  ( <div>
              Bạn sẽ sử dụng <span className="font-bold text-primary mx-1"> {formatNumber(bookInfo?.book?.price)}đ</span> trong tài khoản để mua sách
              </div>) : (( <div className="text-red-500">
              Tài khoản của bạn không đủ tiền vui lòng nạp thêm tiền để có thể mua nội dung 
              </div>)) }
        <div className=" rounded-xl overflow-hidden mt-3 relative">
        <div class="absolute top-0 left-0 w-full h-full book-border z-5"></div>
            <img src={bookInfo?.book?.coverImage} className="object-cover w-[100px] "/>
        </div>
        <div className="font-bold text-primary mt-2">{bookInfo?.book?.bookName} - {bookInfo?.book?.author?.name}</div>

            </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <button onClick={handleCancel} className="bg-gray-400 hover:opacity-90 text-[18px] px-4 py-2 rounded-lg font-bold text-white">
                    Quay về 
                </button>
               { !errorBuyBook ? <button
                onClick={handleConfirm}
                className="bg-primary hover:opacity-90 text-[18px] px-4 py-2 rounded-lg font-bold text-white">
                    Thanh Toán
                </button> : (<Link to={"/deposit"}
                className="bg-primary hover:opacity-90 text-[18px] px-4 py-2 rounded-lg font-bold text-white">
                  Nạp tiền ngay 
                </Link> )}
            </div>
          
   
          </div> : (
            <div className="bg-background-book backdrop-blur border-yellow-200 border-[1px] flex flex-col items-center justify-center gap-5  rounded-lg shadow-lg p-6 w-[400px] ">
              <div className="text-primary text-[32px] text-center"> Thanh toán thành công</div>
            <img src={gif} className="rounded-full object-cover w-[120px] h-[120px]"/>
            <div className="text-white"> Cảm ơn bạn đã mua nội dung sách <span className="text-primary">"{bookInfo.book.bookName}"</span></div>
            {reLoad && <div className="text-white">Hãy load (F5) lại trang web để bắt đầu đọc sách</div> }
                <button className="bg-primary px-4 py-2 text-[22px] font-bold text-white rounded-lg  "
                onClick={() => setShowPaymentModal(false)}
                >
                  Xong
                </button>
          </div>)}
        </div>
    </div>
  );
}

export default PaymentEbook;
