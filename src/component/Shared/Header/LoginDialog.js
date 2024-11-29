import { useRef, useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function LoginDialog({ setModalStatus}) {
  const {success,loginRequest,responseFacebook, error,setShowModal, googleLogin} = useAPI();
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [eyeShowPW, setEyeShowPW] = useState(false);
  const facebookRef = useRef();
  const handleLoginSubmit = () => {
    loginRequest(loginPhone,loginPassword);
  }
  const hanldeLoginGoogle = () => {
    setShowModal(false);
    googleLogin();
  }

  return (
    <div>
                <span className="text-primary font-bold text-center text-3xl pl-[20px]">Đăng Nhập</span>
                <p className="text-white mb-6">
                  Chào mừng bạn đến với Book4.0{" "}
                </p>
                <div className="px-8  border-white-overlay">
                  <h3 className="text-base-16-19 text-white-50">
                    Đăng nhập để nhận thêm quyền lợi
                  </h3>
                  {
                    error.failLogin && (
                      <p className="text-red-500">Tài khoản hoặc số điện thoại không đúng</p>
                    )
                  }
                   {
                    error.isBanned && (
                      <p className="text-red-500">Tài khoản đã bị cấm. Vui lòng liên hệ admin</p>
                    )
                  }
                  {
                    success.successRegistered && (
                      <p className="text-primary">Đăng kí thành công vui lòng đăng nhập</p>
                    )
                  }
                  <div className="mt-2 mb-3">
                    <div className="mb-3">
                      <div className="flex flex-col">
                        <div className="relative w-full h-14 border rounded-xl border-white-300">
                          <input
                            type="text"
                            className="input-focus-index input-auth text-white-50 bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                            onChange={(e) => {
                              setLoginPhone(e.target.value);
                            }}
                          />
                          {!loginPhone && (
                            <label className="absolute select-none pointer-events-none left-3 text-13-13 z-2 block transition-all text-white-300 top-1/2 -translate-y-1/2 text-description z-3">
                              Tên đăng nhập
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="relative w-full h-14 border rounded-xl border-white-300">
                        <input
                          onKeyDown={(e) => {if(e.key === 'Enter') handleLoginSubmit()}}
                          type={eyeShowPW ? "text" : "password"}
                          className="input-focus-index input-auth text-white-50 bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                          onChange={(e) => {
                            setLoginPassword(e.target.value);
                          }}
                        />
                        {!loginPassword && (
                          <label className="absolute select-none pointer-events-none left-3 text-13-13 z-2 block transition-all text-white-300 top-1/2 -translate-y-1/2 text-description z-3">
                            Mật khẩu
                          </label>
                        )}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                          <span
                            onClick={() => {
                              setEyeShowPW(!eyeShowPW);
                            }}
                          >
                            <div className="cursor-pointer">
                              {eyeShowPW ? (
                                <i className="fa-regular fa-eyes"></i>
                              ) : (
                                <i className="fa-solid fa-eye-low-vision"></i>
                              )}
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-primary text-base-16-19 text-right cursor-pointer"
                  onClick={() => setModalStatus("forgotPassword")}
                  >
                    Quên mật khẩu
                  </p>
                  <div className="mt-5">
                    <button
                      onClick={(e) => handleLoginSubmit()}
                      className="text-white text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
                      disabled={!(loginPassword && loginPhone)}
                    >
                      <span>Đăng nhập</span>
                    </button>
                  </div>
                  <p className="text-sm-15-19 mt-6">Hoặc đăng nhập với</p>
  
                  <div className="bg-[#37373a] py-3 text-white-50 rounded-full mt-2 px-8 mb-4 flex items-center justify-center cursor-pointer button-social"
                  onClick={hanldeLoginGoogle} 
                  >
                    <img
                      src="https://waka.vn/svgs/icon-google.svg"
                      className="cursor-pointer"
                    ></img>
                    <span className="text-base-16-19 text-white-50 ml-2">
                      Google
                    </span>
                  </div>
                  <div className="w-full mt-2 border-t border-primary text-center">
                    <div className="mt-2">
                      <span className="text-sm-15-19 mr-1 mt-8 text-white-50">
                        Bạn chưa có tài khoản?
                      </span>
                      <span
                        className="text-sm-15-19 pl-[20px] text-primary cursor-pointer"
                        onClick={() => {
                          setModalStatus("");
                        }}
                      >
                        Đăng kí ngay
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  );
}