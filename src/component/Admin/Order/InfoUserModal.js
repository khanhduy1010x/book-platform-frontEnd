import React from "react";
import { useAPI } from "../../Service/APIContext";

const InfoUserModal = ({ user, setShowModalUser }) => {
    const {memberMapper} = useAPI();
  if (!user) return null; 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        <div className="border-b border-gray-300 px-4 py-2 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Thông tin tài khoản</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            {/* Avatar */}
            {user.avatar && (
              <div className="flex justify-center">
                <img
                  src={user.avatar || "data:image/png;base64,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"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            {/* Username */}
            <div>
              <span className="font-semibold">Tên tài khoản:</span>{" "}
              {user.username || "N/A"}
            </div>
            {/* Full Name */}
            <div>
              <span className="font-semibold">Họ và tên:</span>{" "}
              {user.fullName || "N/A"}
            </div>
            {/* Email */}
            <div>
              <span className="font-semibold">Email:</span> {user.email || "N/A"}
            </div>
            {/* Phone */}
            <div>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {user?.phone || "N/A"}
            </div>
            {/* Role */}
            <div>
              <span className="font-semibold">Vai trò:</span>{" "}
              {user.role || "N/A"}
            </div>
            {/* Member Type */}
            <div>
              <span className="font-semibold">Loại thành viên:</span>{" "}
              {memberMapper(user.memberType) || "Chưa đăng kí thành viên"}
            </div>
            {/* Amount */}
            <div>
              <span className="font-semibold">Số tiền:</span>{" "}
              {user.amount?.toLocaleString("vi-VN")} đ
            </div>
            {/* Birth */}
            <div>
              <span className="font-semibold">Ngày sinh:</span>{" "}
              {user.birth
                ? new Date(user.birth).toLocaleDateString("vi-VN")
                : "N/A"}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 px-4 py-2 flex justify-end">
          <button
            onClick={() => setShowModalUser(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoUserModal;
