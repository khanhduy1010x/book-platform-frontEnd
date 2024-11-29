import React, { useState } from "react";
import { useAPI } from "../Service/APIContext";
import { Link, useNavigate } from "react-router-dom";
import gif from '../../assets/image/successQR.gif';

export function ConfirmModalMemberPackage({
  setShowConfirmModal,
  memberPackage,
  totalSale
}) {
  const { formatNumber, paymentOnlineMemberPackage } = useAPI();
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidPackage, setInvalidPackage] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = async () => {
    try {
      const result = await paymentOnlineMemberPackage(memberPackage.id); 
      if (result === 1000) {
        setPurchaseSuccess(true);
      } else if (result === 1057) {
        setInvalidAmount(true);
      } else if (result === 1059) {
        setInvalidPackage(true);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra trong quá trình mua gói:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-primary">
          {purchaseSuccess ? "Mua gói thành công" : "Xác nhận mua gói"}
        </h2>
        {purchaseSuccess ? (
          <div className="flex items-center justify-center flex-col gap-4"> 
            <img src={gif} className="w-[120px] h-[120px] object-cover rounded-full"/>
            <p className="text-green-600 text-center mb-6">
              Bạn đã mua gói thành công! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col gap-4">
            <p className={`${(invalidAmount || invalidPackage) ? '!text-red-500' : ''} text-gray-700 text-center mb-6`}>
              {invalidAmount
                ? "Số tiền không đủ để mua gói. Vui lòng nạp thêm hoặc thay đổi phương thức thanh toán."
                : invalidPackage
                ? "Bạn đang sở hữu gói cao hơn. Không thể mua gói thấp hơn."
                : `Bạn có chắc chắn muốn sử dụng số tiền ${formatNumber(memberPackage.price-totalSale)}đ để mua gói này?`}
            </p>
          </div>
        )}

        {purchaseSuccess ? (
          <button
            className="w-full py-2 bg-teal-500 text-white rounded-full font-semibold uppercase"
            onClick={() => { setShowConfirmModal(false); navigate("/"); }}
          >
            Đóng
          </button>
        ) : (
          <div className="flex flex-col gap-5 justify-around">
            {invalidAmount ? (
              <>
                <Link
                  to="/deposit"
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-teal-500 text-white rounded-full font-semibold"
                >
                  Nạp tiền vào tài khoản
                </Link>
                <button
                  className="flex-1 py-2 px-3 bg-gray-700 text-white rounded-full font-semibold"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setInvalidAmount(false);
                  }}
                >
                  Thay đổi phương thức thanh toán
                </button>
              </>
            ) : invalidPackage ? (
              <button
                className="w-full py-2 bg-gray-700 text-white rounded-full font-semibold uppercase"
                onClick={() => {
                  setShowConfirmModal(false);
                  setInvalidPackage(false);
                }}
              >
                Đóng
              </button>
            ) : (
              <div className="flex justify-around">
                <button
                  className="w-1/3 py-2 bg-teal-500 text-white rounded-full font-semibold uppercase"
                  onClick={handlePurchase}
                >
                  Xác nhận
                </button>
                <button
                  className="w-1/3 py-2 bg-gray-700 text-white rounded-full font-semibold uppercase"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Hủy bỏ
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmModalMemberPackage;
