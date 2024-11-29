import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";

const AddVoucherModal = ({ setShowModal,setSuccess,setContent }) => {
  const [voucherName, setVoucherName] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [isPublic, setIsPublic] = useState(true);
  const [memberType, setMemberType] = useState("NONE");
  const [minCartValue, setMinCartValue] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [voucherDescription, setVoucherDescription] = useState("");
  const {addNewVoucherAdmin} =useAPI()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVoucher = {
      voucherName,
      discountType,
      isPublic,
      memberType,
      minCartValue,
      discountValue,
      voucherDescription,
    };
 const resp = await addNewVoucherAdmin(newVoucher); 
    if(resp) {
        setContent("Thêm mới voucher thành công!")

        setSuccess(true);
    setShowModal(false); 
    }
  };
useEffect(() => {
    if (discountType === "PERCENTAGE") {
        if (discountValue > 100) {
            setDiscountValue(0); 
      }
}
},[discountType])
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center font-oswald justify-center z-[52]">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Thêm Voucher Mới</h2>
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
              onChange={(e) => setIsPublic(e.target.value === "true")}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="true">Có</option>
              <option value="false">Không</option>
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
        }else {

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
              onClick={() => setShowModal(false)}
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
  Thêm
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVoucherModal;
