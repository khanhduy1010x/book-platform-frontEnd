import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import SuccesChangStatus from "../../Shared/SuccessChangStatus";

const DetailModal = ({ orderDetail, setShowModalOrderDetail, setSuccessUpdate }) => {
  const { formatNumber, mapPaymentMethodToVietnamese,changeStatus,mapPaymentStatusToVietnamese,mapShipStatusToVietnamese } = useAPI();
  const [paymentStatus, setPaymentStatus] = useState(orderDetail.paymentStatus);
  const [shipStatus, setShipStatus] = useState(orderDetail.shipStatus);

   
  const paymentStatusOptions = [
    "PENDING",
    "COMPLETED",
  ];

  const shipStatusOptions = [
    "PENDING",
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
  ];

  const handleSave = async () => {
    const updatedOrder = {
         id : orderDetail.id,
         paymentStatus:paymentStatus ,
         shipStatus:shipStatus,
    };
    console.log(updatedOrder)
   await changeStatus(updatedOrder);
   setSuccessUpdate(true)
    onClose();
  };
  const onClose = () => {
    setShowModalOrderDetail(false);
  };

  if (!orderDetail) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[700px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-300 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">
            Chi tiết đơn hàng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            {/* ID */}
            <div>
              <span className="block font-medium text-gray-600">Mã đơn:</span>
              <span className="text-gray-800">{orderDetail.id}</span>
            </div>

            {/* Date */}
            <div>
              <span className="block font-medium text-gray-600">Ngày đặt:</span>
              <span className="text-gray-800">
                {new Date(orderDetail.date).toLocaleDateString("vi-VN")}
              </span>
            </div>

            {/* Payment Method */}
            <div>
              <span className="block font-medium text-gray-600">
                Phương thức thanh toán:
              </span>
              <span className="text-gray-800">
                {mapPaymentMethodToVietnamese(orderDetail.paymentMethod) ||
                  "N/A"}
              </span>
            </div>

            {/* Payment Status */}
            <div>
              <span className="block font-medium text-gray-600">
                Trạng thái thanh toán:
              </span>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="mt-1 block w-full border-black border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {paymentStatusOptions.map((status, index) => (
                  <option key={index} value={status}>
                  { mapPaymentStatusToVietnamese(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Ship Status */}
            <div>
              <span className="block font-medium text-gray-600">
                Trạng thái giao hàng:
              </span>
              <select
                value={shipStatus}
                onChange={(e) => setShipStatus(e.target.value)}
                className="mt-1 block w-full border-black border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {shipStatusOptions.map((status, index) => (
                  <option key={index} value={status}>
                   {mapShipStatusToVietnamese(status)} 
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="col-span-2">
              <span className="block font-medium text-gray-600">
                Địa chỉ giao hàng:
              </span>
              <span className="text-gray-800">
                {orderDetail.shipInfo
                  ? `${orderDetail.shipInfo.shipDetail}, ${orderDetail.shipInfo.wards}, ${orderDetail.shipInfo.district}, ${orderDetail.shipInfo.province}`
                  : "Chưa cập nhật"}
              </span>
            </div>
          </div>

          {/* List of Books */}
          <div className="mt-6">
            <span className="block font-medium text-gray-600">
              Danh sách sản phẩm:
            </span>
            <ul className="list-disc list-inside text-gray-800">
              {orderDetail.listBook.map((book, index) => (
                <li key={index} className="flex items-center mb-2 gap-2 ">
                  <img
                    src={book.book.coverImage}
                    className="w-8 object-cover rounded-lg"
                  />
                  <div className="flex flex-col">
                    <div className="font-bold">{book.book.bookName} </div>{" "}
                    <div className="flex">
                      <div>
                        {book.quantity} {"Quyển "}x{" "}
                      </div>
                      <div> {formatNumber(book.book.price)}đ</div>{" "}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Vouchers */}
          <div className="mt-4">
            <span className="block font-medium text-gray-600">Voucher:</span>
            <div className="text-gray-800 flex flex-col">
  {orderDetail.vouchers && orderDetail.vouchers.length > 0 ? (
    orderDetail.vouchers.map((v, index) => (
      <div key={index}>{v.voucherName} - {v.discountType === "PERCENTAGE" ? `Giảm giá ${v.discountValue}%`: `Giảm trực tiếp ${formatNumber(v.discountValue)}đ`}</div>
    ))
  ) : (
    "Không có"
  )}
</div>
          </div>

          {/* Amounts */}
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <span className="block font-medium text-gray-600">
                Tổng tiền trước giảm giá:
              </span>
              <span className="text-gray-800">
                {orderDetail.totalAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <div>
              <span className="block font-medium text-gray-600">
                Tổng tiền sau giảm (Phí ship 15.000đ):
              </span>
              <span className="text-gray-800">
                {orderDetail.totalAmountBefore.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
