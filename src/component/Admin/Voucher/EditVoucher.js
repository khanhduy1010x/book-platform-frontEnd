import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";

const EditVoucher = ({ voucher, setShowModalUpdate, setContent, setSuccess }) => {
  const [voucherName, setVoucherName] = useState(voucher?.voucherName || "");
  const [discountType, setDiscountType] = useState(voucher?.discountType || "PERCENTAGE");
  const [isPublic, setIsPublic] = useState(voucher?.public ? true : false);
  const [memberType, setMemberType] = useState(voucher?.memberType || "NONE");
  const [minCartValue, setMinCartValue] = useState(voucher?.minCartValue || 0);
  const [discountValue, setDiscountValue] = useState(voucher?.discountValue || 0);
  const [voucherDescription, setVoucherDescription] = useState(voucher?.voucherDescription || "");
  const { addNewVoucherAdmin } = useAPI();
console.log(isPublic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVoucher = {
      id: voucher?.id, 
      voucherName,
      discountType,
      public: isPublic,
      memberType,
      minCartValue,
      discountValue,
      voucherDescription,
    };

    const resp = await addNewVoucherAdmin(updatedVoucher);
    if (resp) {
        setContent("Cập nhật voucher thành công!")
      setSuccess(true);
      setShowModalUpdate(false);
    }
  };

  useEffect(() => {
    if (discountType === "PERCENTAGE" && discountValue > 100) {
      setDiscountValue(100);  
    }
  }, [discountType, discountValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[52]">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Voucher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Tên Voucher</label>
            <input
              type="text"
              value={voucherName}
              onChange={(e) => setVoucherName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Nhập tên voucher"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Loại Giảm Giá</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="PERCENTAGE">Phần trăm</option>
              <option value="FIXED_AMOUNT">Số tiền cố định</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Công Khai</label>
            <select
              value={isPublic}
              onChange={(e) => setIsPublic(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value={true}>Có</option>
              <option value={false}>Không</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Gói Thành Viên</label>
            <select
              value={memberType}
              onChange={(e) => setMemberType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="NONE">Không</option>
              <option value="BASIC">Thành viên bạc</option>
              <option value="ADVANCE">Thành viên vàng</option>
              <option value="PREMIUM">Thành viên kim cương</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Giá Trị Tối Thiểu Giỏ Hàng</label>
            <input
              type="text"
              value={new Intl.NumberFormat("vi-VN").format(minCartValue || 0)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                setMinCartValue(rawValue);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Nhập giá trị tối thiểu"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Giảm Giá</label>
            <input
              type="text"
              value={
                discountType === "FIXED_AMOUNT"
                  ? new Intl.NumberFormat("vi-VN").format(discountValue || 0)
                  : discountValue
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                if (discountType === "PERCENTAGE") {
                  if (+rawValue <= 100) {
                    setDiscountValue(rawValue);
                  }
                } else {
                  setDiscountValue(rawValue);
                }
              }}
              placeholder={
                discountType === "FIXED_AMOUNT"
                  ? "Nhập số tiền giảm giá"
                  : "Nhập phần trăm giảm giá"
              }
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
            {discountType === "PERCENTAGE" && +discountValue > 100 && (
              <p className="text-red-500 text-sm mt-1">Giảm giá không được vượt quá 100%!</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Mô Tả Voucher</label>
            <textarea
              value={voucherDescription}
              onChange={(e) => setVoucherDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Nhập mô tả voucher"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModalUpdate(false)}
              className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!voucherName || !discountValue || !minCartValue}
              className={`rounded-lg px-4 py-2 ${
                !voucherName || !discountValue || !minCartValue
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoucher;
