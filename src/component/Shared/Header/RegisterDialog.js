import { useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function RegisterDialog({ setModalStatus }) {
  const {
    sendSMSOTPReg,
    registerAccount,
    error,
    setError,
    success,
    setAccountCreateRequest,
    accountCreatRequest,
  } = useAPI();
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRePasswordFocused, setIsRePasswordFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const[isUsernameFocused, setIsUsernameFocused]= useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterRePassword, setShowRegisterRePassword] = useState(false);
  const handleSendSMSOTP = () => {
    let isValid = true;
  
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(accountCreatRequest.password)) {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            password: "Mật khẩu không hợp lệ",
          },
        },
      }));
      isValid = false;
    } else {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            password: null,
          },
        },
      }));
    }
    if (accountCreatRequest.password !== accountCreatRequest.repassword) {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            repassword: "Mật khẩu không trùng khớp",
          },
        },
      }));
      isValid = false;
    } else {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            repassword: null,
          },
        },
      }));
    }
  
    if (!(/^0\d{9,10}$/.test(accountCreatRequest.phone))) {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            phone: "Số điện thoại không hợp lệ",
          },
        },
      }));
      isValid = false;
    } else {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            phone: null,
          },
        },
      }));
    }

  
    if (/[^\p{L}\s]/u.test(accountCreatRequest.name)) {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            name: "Tên không được chứa số và kí tự đặc biệt",
          },
        },
      }));
      isValid = false;
    } else {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            name: null,
          },
        },
      }));
    }
    if (/[^a-zA-Z0-9]/.test(accountCreatRequest.username) || accountCreatRequest.username.length < 6 || accountCreatRequest.username.length > 12) {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            username: "Tên đăng nhập không hợp lệ",
          },
        },
      }));
      isValid = false;
    } else {
      setError((prevError) => ({
        ...prevError,
        valid: {
          ...prevError.valid,
          register: {
            ...prevError.valid.register,
            username: null,
          },
        },
      }));
    }
  
    if (!isValid) return;
  
    registerAccount();
  };
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-primary font-bold text-3xl pl-[20px]">Đăng ký</h2>
        <div className="text-white mb-6">
          Đăng kí để mua và theo dõi quá trình đọc sách
        </div>
      
    
        {error?.valid?.register?.phone && (
          <div className="text-red-500">{error?.valid?.register?.phone}</div>
        )}
        {error?.register?.exitsPhone && (
          <div className="text-red-500">{error.register?.exitsPhone}</div>
        )}
         {error?.register?.server && (
          <div className="text-red-500">{error.register?.server}</div>
        )}
         {error?.register?.waittingTime && (
          <div className="text-red-500">{error.register?.waittingTime}</div>
        )}

        <form className="mb-4">
          <div className="mb-4">
            <div className="flex flex-col">
              {/* so dien thoai input ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
              <div className={`relative w-full h-14 border rounded-xl `}>
                <input
                  maxLength="20"
                  pattern={"[0-9]*"}
                  value={accountCreatRequest.phone || ""}

                  className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  onChange={(e) => {
                    setAccountCreateRequest({
                      ...accountCreatRequest,
                      phone: e.target.value,
                    });
                  }}
                />
                <label
                  className={`absolute select-none pointer-events-none left-3 text-xs z-2 block transition-all ${
                    isPhoneFocused || accountCreatRequest.phone
                      ? "text-brand top-2.5"
                      : "text-white-300 top-1/2"
                  }  -translate-y-1/2 text-description z-3`}
                >
                  Số điện thoại
                </label>
              </div>
              <div className="mt-4">
              {error?.valid?.register?.username && (
                <div className="text-red-500">{error?.valid?.register?.username}</div>
              )}
                {error?.register?.exitsUsername && (
          <div className="text-red-500">{error.register?.exitsUsername}</div>
        )}
              <div className={`relative w-full  h-14 border rounded-xl`}>               
                <input
                  maxLength="20"
                  type="text"
                  value={accountCreatRequest.username || ""}
                  className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                  onFocus={() => setIsUsernameFocused(true)}
                  onBlur={() => setIsUsernameFocused(false)}
                  onChange={(e) => {
                    setAccountCreateRequest({
                      ...accountCreatRequest,
                      username: e.target.value,
                    });
                  }}
                />
                <label
                  className={`absolute select-none pointer-events-none left-3 text-xs z-2 block  transition-all ${
                    isUsernameFocused || accountCreatRequest.username
                      ? "text-brand top-2.5"
                      : "text-white-300 top-1/2"
                  }  -translate-y-1/2 text-description z-3`}
                >
                  Tên đăng nhập
                </label>
              </div>
              </div>
              <div className="mt-4">
              {error?.valid?.register?.name && (
                <div className="text-red-500">{error?.valid?.register?.name}</div>
              )}
              <div className={`relative w-full  h-14 border rounded-xl`}>               
                <input
                  maxLength="20"
                  type="text"
                  value={accountCreatRequest.name || ""}
                  className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  onChange={(e) => {
                    setAccountCreateRequest({
                      ...accountCreatRequest,
                      name: e.target.value,
                    });
                  }}
                />
                <label
                  className={`absolute select-none pointer-events-none left-3 text-xs z-2 block  transition-all ${
                    isNameFocused || accountCreatRequest.name
                      ? "text-brand top-2.5"
                      : "text-white-300 top-1/2"
                  }  -translate-y-1/2 text-description z-3`}
                >
                  Họ và tên
                </label>
              </div>
              </div>
              {/* mat khau input ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
              <div className="mt-4">
              {error?.valid?.register?.password && (
                <div className="text-red-500">{error?.valid?.register?.password}</div>
              )}
              <div className={`relative w-full  h-14 border rounded-xl`}>
                <input
                  maxLength="20"
                  value={accountCreatRequest.password || ""}
                  type={showRegisterPassword ? "text" : "password"}
                  className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    setAccountCreateRequest({
                      ...accountCreatRequest,
                      password: e.target.value,
                    });
                  }}
                />
                <label
                  className={`absolute select-none pointer-events-none left-3 text-xs z-2 block  transition-all ${
                    isPasswordFocused || accountCreatRequest.password
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
                Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt{" "}
                </p>
              </div>
              {/*Nhap lai mat khau input ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
              <div className="mt-4"
              >
                 {error?.valid?.register?.repassword && (
                <div className="text-red-500">{error?.valid?.register?.repassword}</div>
              )}
             
              <div className={`relative w-full h-14 border rounded-xl`}>
                <input
                  maxLength="20"
                  value={accountCreatRequest.repassword || ""}

                  type={showRegisterRePassword ? "text" : "password"}
                  className="input-focus-index input-auth text-white bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                  onFocus={() => setIsRePasswordFocused(true)}
                  onBlur={() => setIsRePasswordFocused(false)}
                  onChange={(e) => {
                    setAccountCreateRequest({
                      ...accountCreatRequest,
                      repassword: e.target.value,
                    });
                  }}
                />
                <label
                  className={`absolute select-none pointer-events-none left-3 text-xs z-2 block  transition-all ${
                    isRePasswordFocused || accountCreatRequest.repassword
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
        </form>
        {/* ket thuc form dang ki ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
        <div className="mt-5">
          <button
            className="text-white text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
            onClick={handleSendSMSOTP}
            disabled={
              !(
                accountCreatRequest.phone &&
                accountCreatRequest.password &&
                accountCreatRequest.repassword &&
                accountCreatRequest.name
              )
            }
          >
            <span>Đăng ký</span>
          </button>
         
        </div>
        <div className="pt-2 w-full mt-2 border-t border-primary text-center">
          <div className="mt-4">
            <span className="text-sm-15-19 mr-3 text-white-50">
              Bạn đã có tài khoản?{" "}
            </span>
            <span
              className="text-sm-15-19 text-primary cursor-pointer"
              onClick={() => {
                setModalStatus("login");
              }}
            >
              Đăng nhập ngay
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}