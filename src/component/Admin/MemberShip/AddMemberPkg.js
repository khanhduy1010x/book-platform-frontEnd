import React, { useState } from "react";
import { useAPI } from "../../Service/APIContext";

const AddMemberPkg = ({  setShowModalAdd,setSuccess,setContent }) => {
    const {addNewMemberPackage} = useAPI();
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [memberType, setMemberType] = useState("BASIC");
  const [durationDays, setDurationDays] = useState("");
  const [features, setFeatures] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const packageData = {
      packageName,
      price,
      memberType,
      durationDays,
      features,
      description,
    };
    await addNewMemberPackage(packageData);
    
    setContent("Thêm gói thành viên thành công");
    setSuccess(true);
    setShowModalAdd(false)
  };

  return (
    <>
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Thêm Gói Thành Viên</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="packageName" className="block text-sm font-medium text-gray-600 mb-2">
                  Tên Gói
                </label>
                <input
                  type="text"
                  id="packageName"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-2">
                  Giá (VND)
                </label>
                <input
                  type="text"
                  id="price"
                  value={new Intl.NumberFormat("vi-VN").format(price || 0)} 
             onChange={(e) => {
               const rawValue = e.target.value.replace(/[^0-9]/g, ""); 
               setPrice(rawValue); 
             }}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="memberType" className="block text-sm font-medium text-gray-600 mb-2">
                  Loại Thành Viên
                </label>
                <select
                  id="memberType"
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                >
                  <option value="BASIC">Thành viên Bạc</option>
                  <option value="ADVANCE">Thành viên Vàng</option>
                  <option value="PREMIUM">Thành viên Kim Cương</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="durationDays" className="block text-sm font-medium text-gray-600 mb-2">
                  Thời gian (Ngày)
                </label>
                <input
  type="number"
  id="durationDays"
  value={durationDays }
  onBlur={() => {
    if(!durationDays || durationDays ==0) {
        setDurationDays(1)
    }
  }}
  onChange={(e) => {
    const newValue = e.target.value;
    if (newValue === "" || newValue > 0) {
        setDurationDays(newValue);
      }
  }}
  required
  min="1" 
  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
/>
              </div>
              
              <div className="mb-4">
                <label htmlFor="features" className="block text-sm font-medium text-gray-600 mb-2">
                  Tính Năng
                </label>
                <textarea
                  id="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-2">
                  Mô Tả
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModalAdd(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Lưu Gói
                </button>
              </div>
            </form>
          </div>
        </div>
    </>
  );
};

export default AddMemberPkg;
