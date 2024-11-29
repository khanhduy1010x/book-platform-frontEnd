import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";

const InfoUser = ({ user, setShowModalUser,handleChangeAccountStatus,handleChangeRole }) => {
  const { memberMapper,  } = useAPI();
  const [role, setRole] = useState(user?.role);
  const [isBanned, setIsBanned] = useState(user?.banned);
  useEffect(() => {
    setRole(user?.role); 
    setIsBanned(user?.banned); 
  }, [user]);
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
            <div className="flex justify-center">
              <img
                src={
                  user.avatar ||
                  `https://vcdn1-vnexpress.vnecdn.net/2022/02/09/jack-6190-1627551850-6785-1644377647.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=zCBvN1V-Bqpp3xe5rmUFmg`
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
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
              <span className="font-semibold">Email:</span>{" "}
              {user.email || "N/A"}
            </div>
            {/* Phone */}
            <div>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {user?.phone || "N/A"}
            </div>
            {/* Role */}
            <div>
              <span className="font-semibold">Vai trò:</span>{" "}
              {role === "ADMIN" ? "Quản trị viên" : "Người dùng" || "N/A"}
              <div className="mt-2">
                <button className="bg-primary text-white p-2 rounded-xl"
                onClick={handleChangeRole}
                >
                  {role === "USER"
                    ? "Thay đổi vai trò thành Quản trị viên"
                    : "Thay đổi vai trò thành người dùng"}{" "}
                </button>
              </div>
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
            {/* Ban Status */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">Trạng thái:</span>{" "}
              {isBanned ? "Đã bị khóa" : "Hoạt động"}
              <button
                className={`ml-2 px-3 py-1 rounded text-white ${
                  isBanned
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={handleChangeAccountStatus}
            >
                {isBanned ? "Mở khóa" : "Khóa"}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 px-4 py-2 flex justify-end">
          <button
            onClick={() => setShowModalUser(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
