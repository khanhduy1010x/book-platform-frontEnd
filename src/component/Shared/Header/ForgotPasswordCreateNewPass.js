import { useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function ForgotPasswordCreateNewPass() {
  const {resetedPassword,setModalStatus, setShowModal,resetPasswordForForgotPassword} = useAPI();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRePasswordFocused, setIsRePasswordFocused] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterRePassword, setShowRegisterRePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRepassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState("");
  const [invalidRepassword, setInvalidRepassword] = useState("");


  const handleCreatePassword = () => {
    let isOk=true;
    if (!password || !rePassword) return;

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setInvalidPassword("Vui lòng điền mật khẩu hợp lệ");
      isOk=false;
    } else {
      setInvalidPassword(null);
    }

    if (password !== rePassword) {
      setInvalidRepassword("Mật khẩu không trùng khớp");
      isOk=false;
    } else {
      setInvalidRepassword("");
    }
    if(isOk) {
        resetPasswordForForgotPassword(password);
    }
  };

  return (
    <div>
      <span className="text-primary font-bold text-center text-3xl pl-[20px]">
        {resetedPassword ? "Đặt lại mật khẩu thành công" : "Đặt lại mật khẩu"}
      </span>
      <p className="text-white mb-6">Chào mừng bạn đến với Book4.0</p>
      {!resetedPassword ? (
        <>
          <div className="px-8  border-white-overlay">
            <h3 className="text-base-16-19 text-white-50">
              Đặt lại mật khẩu của bạn
            </h3>
            <div className="mt-2 mb-3">
              <div className="mb-3">
                <div className="flex flex-col">
                  <div className="mt-4">
                    {invalidPassword ? (
                      <h1 className="text-red-500 mb-1">{invalidPassword}</h1>
                    ) : null}
                    <div className={`relative w-full  h-14 border rounded-xl`}>
                      <input
                        maxLength="20"
                        value={password || ""}
                        type={showRegisterPassword ? "text" : "password"}
                        className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        onChange={(e) => {
                          setPassword(e.target.value);
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
                      Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số
                      và ký tự đặc biệt{" "}
                    </p>
                  </div>
                  {/*Nhap lai mat khau input ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
                  <div className="mt-4">
                    {invalidRepassword ? (
                      <h1 className="text-red-500 mb-1">{invalidRepassword}</h1>
                    ) : null}

                    <div className={`relative w-full h-14 border rounded-xl`}>
                      <input
                        maxLength="20"
                        value={rePassword || ""}
                        type={showRegisterRePassword ? "text" : "password"}
                        className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                        onFocus={() => setIsRePasswordFocused(true)}
                        onBlur={() => setIsRePasswordFocused(false)}
                        onChange={(e) => {
                          setRepassword(e.target.value);
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
              <button
                className="text-white text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
                onClick={handleCreatePassword}
                disabled={!(password && rePassword)}
              >
                <span>Tạo mật khẩu</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[24px] font-bold">
            {" "}
            Bạn đã đặt lại mật khẩu hãy đăng nhập lại !
          </h1>
          <button
            className="text-white mt-6 text-[18px] py-2 font-bold rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
            onClick={() => setModalStatus("login")}
          >
            <span>Đăng nhập ngay</span>
          </button>
        </>
      )}
    </div>
  );
}