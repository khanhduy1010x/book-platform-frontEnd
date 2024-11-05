import React, { useState, useEffect } from "react";
import Loading from "../../assets/image/loading.gif";

export function QrCodeModal() {

  const [showQrCode, setShowQrCode] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [qrPayment, setQrPayment] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png");
  const [loadingQR, setLoadingQR] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };


  const cancelTransaction = () => {
    console.log("Transaction canceled");
    setShowQrCode(false);
  };


  useEffect(() => {
    let timer;
    if (showQrCode && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      cancelTransaction();
    }
    return () => clearInterval(timer);
  }, [showQrCode, timeLeft]);


  useEffect(() => {
    if (qrPayment) {
      const img = new Image();
      img.src = qrPayment;
      img.onload = () => setLoadingQR(false);
    }
  }, [qrPayment]);

  return (
    <>
      {showQrCode && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
            {paymentStatus ? (
              <div className="p-8 text-center">
                <div className="bg-cover bg-center h-64 w-full rounded-t-lg mb-6" style={{ backgroundImage: "url('../img/successPayment.gif')" }}></div>
                <h2 className="text-2xl font-bold text-blue-500 mb-4">Thanh Toán Thành Công</h2>
                <div className="flex justify-center items-center text-pink-500 text-2xl mb-4 space-x-4">
                  <i className="fas fa-smile-beam"></i>
                  <i className="fas fa-smile-beam"></i>
                  <i className="fas fa-smile-beam"></i>
                </div>
                <p className="text-gray-700 mb-6">Cảm ơn bạn đã đặt hàng tại trang web của chúng tôi! Bạn sẽ nhận được hàng trong thời gian sớm nhất.</p>
                <button className="w-full py-2 mb-4 bg-teal-500 text-white rounded-full font-semibold uppercase">
                  Xem đơn hàng
                </button>
                <button onClick={() => setShowQrCode(false)} className="w-full py-2 bg-gray-700 text-white rounded-full font-semibold uppercase">
                  Về trang chủ
                </button>
              </div>
            ) : (
              <div className="p-6">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                  onClick={cancelTransaction}
                >
                  <i className="fas fa-times text-2xl"></i>
                </button>
                <h3 className="text-xl font-semibold text-center mb-4">Quét mã bên dưới</h3>
                <div className="flex justify-center mb-4">
                  <img
                    className="w-64 h-64"
                    src={loadingQR ? Loading : qrPayment}
                    alt="QR Code"
                  />
                </div>
                <div className="text-center mb-4">
                  <p className="text-gray-700">Thời gian thanh toán còn lại</p>
                  <span className="text-2xl font-bold text-red-500">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-sm text-center text-red-600">
                  Lưu ý: Trong thời gian thanh toán vui lòng không đóng trình duyệt và không thay đổi nội dung chuyển khoản.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default QrCodeModal;
