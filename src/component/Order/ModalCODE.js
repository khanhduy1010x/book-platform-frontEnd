import { useScroll } from "@react-spring/web";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export function ModalCOD() {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate("/");
    }
    const handleGoOrder = () => {
        navigate("/info/order-history");
    }
  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50 font-oswald overflow-hidden"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white backdrop-blur-50 rounded-lg shadow-xl p-6">
 
        <h2
          id="modal-title"
          className="text-2xl font-bold text-center mb-4 text-gray-900"
        >
          Đặt hàng thành công
        </h2>
        <div className="flex items-center justify-center mb-4"><i className="fa-dounute fa-solid fa-heart fa-beat-fade text-primary text-[24px]"></i></div>
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          Cảm ơn bạn đã tin tưởng và đặt hàng tại Book4.0. Đơn hàng của bạn sẽ
          sớm được xử lý.
        </p>
        <div className="flex justify-around mt-4">
          <button
            onClick={handleGoHome}
            className="px-4 py-2 bg-teal-600 text-white rounded-full font-semibold uppercase tracking-wide hover:bg-teal-700 transition-colors duration-200"
            aria-label="Go to homepage"
          >
            Đi đến trang chủ
          </button>
          <button
            onClick={handleGoOrder}
            className="px-4 py-2 bg-gray-800 text-white rounded-full font-semibold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
            aria-label="View order details"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCOD;
