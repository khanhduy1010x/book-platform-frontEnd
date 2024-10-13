import { useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function CreatePasswordDialog() {
  const { createPassword } = useAPI();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRePasswordFocused, setIsRePasswordFocused] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterRePassword, setShowRegisterRePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRepassword] = useState("");
  const [error, setError] = useState({
    passwordE: "",
    rePasswordE: "",
  });
  const handleCreatePassword = () => {
    if (!password && !password) return;
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setError({ ...error, passwordE: "Vui lòng điền mật khẩu hợp lệ" });
      return;
    }
    if (password != rePassword) {
      setError({ ...error, rePasswordE: "Mật khẩu không trùng khớp" });
      return;
    }
    createPassword(password);
  };

  return (
    <div>
      <span className="text-primary font-bold text-center text-3xl pl-[20px]">
        Tạo Mật Khẩu
      </span>
      <p className="text-white mb-6">Chào mừng bạn đến với Book4.0</p>
      <div className="px-8  border-white-overlay">
        <h3 className="text-base-16-19 text-white-50">
          Tạo mật khẩu cho những lần đăng nhập sau ( hoặc bỏ qua )
        </h3>
        <div className="mt-2 mb-3">
          <div className="mb-3">
            <div className="flex flex-col">
              <div className="mt-4">
                <div className={`relative w-full  h-14 border rounded-xl`}>
                  <input
                    maxLength="20"
                    value={password || ""}
                    type={showRegisterPassword ? "text" : "password"}
                    className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                  />
                  <label
                    className={`absolute select-none pointer-events-none left-3 text-xs z-2 block  transition-all ${
                      isPasswordFocused || password
                        ? "text-brand top-2.5"
                        : "text-white-300 top-1/2"
                    }  -translate-y-1/2 text-description z-3`}
                  >
                    Mật khẩu
                  </label>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    <span
                      onClick={() => {
                        setShowRegisterPassword(!showRegisterPassword);
                      }}
                    >
                      <div className="cursor-pointer">
                        {showRegisterPassword ? (
                          <i className="fa-regular fa-eyes"></i>
                        ) : (
                          <i className="fa-solid fa-eye-low-vision"></i>
                        )}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="float-left text-sm mt-2 ml-1 text-[#919595]">
                  Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và
                  ký tự đặc biệt{" "}
                </p>
              </div>
              {/*Nhap lai mat khau input ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
              <div className="mt-4">
                <div className={`relative w-full h-14 border rounded-xl`}>
                  <input
                    maxLength="20"
                    value={rePassword || ""}
                    type={showRegisterRePassword ? "text" : "password"}
                    className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                    onFocus={() => setIsRePasswordFocused(true)}
                    onBlur={() => setIsRePasswordFocused(false)}
                    onChange={(e) => {
                        setRepassword(e.target.value)
                    }}
                  />
                  <label
                    className={`absolute select-none pointer-events-none left-3 text-xs z-2 block  transition-all ${
                      isRePasswordFocused || rePassword
                        ? "text-brand top-2.5"
                        : "text-white-300 top-1/2"
                    }  -translate-y-1/2 text-description z-3`}
                  >
                    Nhập lại mật khẩu
                  </label>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    <span
                      onClick={() => {
                        setShowRegisterRePassword(!showRegisterRePassword);
                      }}
                    >
                      <div className="cursor-pointer">
                        {showRegisterRePassword ? (
                          <i className="fa-regular fa-eyes"></i>
                        ) : (
                          <i className="fa-solid fa-eye-low-vision"></i>
                        )}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="float-left text-sm mt-2 ml-1 text-[#919595]">
                  Mật khẩu nhập lại phải trùng mật khẩu
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button className="text-white text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
          onClick={handleCreatePassword}
          disabled={!(password&&rePassword)}
          >
            <span>Tạo mật khẩu</span>
          </button>
        </div>
        <p className="text-sm-15-19 mt-6">Bỏ qua</p>
      </div>
    </div>
  );
}
