import React from "react";
import { useAPI } from "../Service/APIContext";
import { Link } from "react-router-dom";

export function ConfirmModal({
  handlePaymentOrder,
  setShowConfirmModal,
  totalPrice,
  invalidAmount,
  setInvalidAmount
}) {
  const { formatNumber } = useAPI();

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Xác nhận thanh toán
        </h2>
        <p className="text-gray-700 text-center mb-6">
          {invalidAmount
            ? "Số tiền không đủ để thanh toán vui lòng nạp thêm hoặc thay đổi phương thức thanh toán"
            : `          Bạn có chắc chắn muốn sử dụng số tiền ${formatNumber(totalPrice)}đ để thanh toán đơn hàng này?
`}
        </p>
      
      {
        invalidAmount ? (
          <div className="flex flex-col gap-5 justify-around">
          <Link
          to="/deposit"
            className="flex-1 flex items-center justify-center py-2 px-3 bg-teal-500 text-white rounded-full font-semibold "

          >
            Nạp tiền vào tài khoản
          </Link>
          <button
            className="flex-1 py-2 px-3 bg-gray-700 text-white rounded-full font-semibold "
            onClick={() => {
              setShowConfirmModal(false)
              setInvalidAmount(false);
            }

            }
          >
            Thay đổi phương thức thanh toán
          </button>
        </div>
        ) : (   <div className="flex justify-around">
          <button
            className="w-1/3 py-2 bg-teal-500 text-white rounded-full font-semibold uppercase"
            onClick={handlePaymentOrder}

          >
            Xác nhận
          </button>
          <button
            className="w-1/3 py-2 bg-gray-700 text-white rounded-full font-semibold uppercase"
            onClick={() => setShowConfirmModal(false)}
          >
            Hủy bỏ
          </button>
        </div>)
      }
     
      </div>
    </div>
  );
}

export default ConfirmModal;
