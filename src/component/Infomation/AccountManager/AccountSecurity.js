import { useAPI } from "../../Service/APIContext";
import { useEffect, useState } from "react";

export default function AccountSecurity() {
  const { userInfo, changePassword } = useAPI();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.match(/.{8,}/)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return false;
    } else if (!password.match(/(?=.*[a-z])/)) {
      setError("Mật khẩu phải chứa ít nhất 1 chữ cái thường.");
      return false;
    } else if (!password.match(/(?=.*[A-Z])/)) {
      setError("Mật khẩu phải chứa ít nhất 1 chữ cái hoa.");
      return false;
    } else if (!password.match(/(?=.*\d)/)) {
      setError("Mật khẩu phải chứa ít nhất 1 chữ số.");
      return false;
    } else if (!password.match(/(?=.*[@$!%*?&])/)) {
      setError("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@$!%*?&).");
      return false;
    } else if (!regex.test(password)) {
      setError("Mật khẩu không hợp lệ.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) return;
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    await changePassword(password, confirmPassword);
    setSuccess(true);
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  useEffect(() => {
    if (success) {
      const reset = setTimeout(() => {
        setSuccess(false);
      }, 3000);

      return () => clearTimeout(reset);
    }
  }, [success]);

  return (
    <div className="mt-6">
      {/* Email Section */}
      <div className="border-b border-gray-500 pb-2">
        <div className="flex relative">
          <input
            defaultValue={userInfo?.email}
            readOnly
            className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl bg-[#2a2a2c] text-gray-300"
          />
          <span className="absolute font-bold text-[12px] left-[15px] text-gray-500 top-1">
            Email
          </span>
        </div>
        <div className={`font-rubik text-[14px] ml-1 mt-2 ${userInfo?.email ? "text-primary" : "text-gray-500"}`}>
          {userInfo?.email ? "Đã xác thực" : "Chưa liên kết"}
        </div>
      </div>

      {/* Phone Section */}
      <div className="border-b border-gray-500 pb-2">
        <div className="flex relative mt-4">
          <input
            defaultValue={userInfo?.phone}
            readOnly
            className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl bg-[#2a2a2c] text-gray-300"
          />
          <span className="absolute font-bold text-[12px] left-[15px] text-gray-500 top-1">
            Số điện thoại
          </span>
        </div>
        <div className="font-rubik text-primary text-[14px] ml-1 mt-2">
          Đã xác thực
        </div>
      </div>

      {/* Password Change Section */}
      <div className="border-b border-gray-500 pb-4 mt-4">
        {/* Password Input */}
        <div className="flex relative mt-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl bg-[#2a2a2c] text-gray-300"
          />
          <span className="absolute font-bold text-[12px] left-[15px] text-gray-500 top-1">
            Mật khẩu mới
          </span>
          <span
            className="absolute right-[15px] top-[15px] cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirm Password Input */}
        <div className="flex relative mt-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
            className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl bg-[#2a2a2c] text-gray-300"
          />
          <span className="absolute font-bold text-[12px] left-[15px] text-gray-500 top-1">
            Xác nhận mật khẩu
          </span>
          <span
            className="absolute right-[15px] top-[15px] cursor-pointer select-none no-select  text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {!showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {error && (
          <div className="text-red-500 text-[14px] mt-2 ml-1 font-rubik">
            {error}
          </div>
        )}
        <button
          onClick={handlePasswordChange}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-rubik hover:bg-blue-600"
        >
          Lưu mật khẩu
        </button>
        {success && (
          <div className="mt-2 text-primary">Thay đổi mật khẩu thành công</div>
        )}
      </div>

      {/* Account Deletion Section */}
      <div className="font-rubik font-bold mt-4">
        Bạn không có nhu cầu sử dụng tài khoản nữa?{" "}
        <span className="text-red-500 cursor-pointer">Xóa tài khoản</span>
      </div>
    </div>
  );
}
