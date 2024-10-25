import { useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function ForgotPassword() {
  const {
    usernameForgotPassword,
    setUsernameForgotPassword,
    getInfoForgotPassword,
    forgotPasswordInfo,
    chooseMethodSendOTP,
    sendOTPForgotPassword,
    errorUsernameFGP,
  } = useAPI();
  const [isPhone, setIsPhone] = useState(null);
  function maskPhoneNumber(phone) {
    return phone.replace(/(\d{3})\d{3}(\d{3})/, "$1****$2");
  }
  const handleSendOTPForgotPassowrd = () => {
    if (isPhone === null) return;
    sendOTPForgotPassword(isPhone);
  };
  function maskEmail(email) {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 5) + "*****";
    return `${maskedName}@${domain}`;
  }
  return (
    <div>
      <span className="text-primary font-bold text-center text-3xl pl-[20px]">
        Quên mật khẩu
      </span>
      <p className="text-white mb-6">Chào mừng bạn đến với Book4.0</p>
      <div className="px-8  border-white-overlay">
        <div className="mb-3">
          <div className="flex flex-col">
            {chooseMethodSendOTP ? (
              <>
                <span className="mb-4">Chọn phương thức nhận OTP</span>
              {/* -----------------------------------email ----------------------------- */}
                {
                  forgotPasswordInfo?.email && (
                    <div className="inline-flex items-center rounded-xl border-primary border-[2px] p-2">
                    <label
                      className="relative flex cursor-pointer items-center rounded-full p-3"
                      htmlFor="ripple-on"
                      data-ripple-dark="true"
                    >
                      <input
                        id="ripple-on"
                        type="checkbox"
                        checked={isPhone === false}
                        onChange={() => setIsPhone(false)} // Khi chọn email, thiết lập isPhone = false
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-primary shadow  transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary "
                      />
                      <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label>
                    <label
                      className="cursor-pointer   font-bold text-white text-sm mr-8"
                      htmlFor="ripple-on"
                    >
                      Gửi OTP đặt lại mật khẩu qua email:{" "}
                      {maskEmail(forgotPasswordInfo.email)}{" "}
                    </label>
                  </div>
                  )
                }
                {/* ----------------------------------- end - email ----------------------------- */}
                {
                  forgotPasswordInfo?.phone && (
                    <div className="inline-flex items-center rounded-xl border-primary border-[2px] mt-4 p-2">
                    <label
                      className="relative flex cursor-pointer items-center rounded-full p-3"
                      htmlFor="ripple-on"
                      data-ripple-dark="true"
                    >
                      <input
                        id="ripple-on"
                        type="checkbox"
                        checked={isPhone === true}
                        onChange={() => setIsPhone(true)} // Khi chọn email, thiết lập isPhone = false
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-primary shadow  transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary "
                      />
                      <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label>
                    <label
                      className="cursor-pointer   font-bold text-white text-sm mr-8"
                      htmlFor="ripple-on"
                    >
                      Gửi OTP đặt lại mật khẩu qua số điện thoại:{" "}
                      {maskPhoneNumber(forgotPasswordInfo.phone)}{" "}
                    </label>
                  </div>
                  )
                }
                {/* ---------------------------------------- start - phone ----------------------------------------------- */}
              

                {/* ----------------------------------- end - phone ----------------------------- */}
              </>
            ) : (
              <div>
                <span className="mb-4">
                  Điền tên đăng nhập của bạn để đặt lại mật khẩu
                </span>
                <div className="relative w-full h-14 mt-1 border rounded-xl border-white-300">
                  <input
                    type="text"
                    className="input-focus-index input-auth text-white-50 bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                    onChange={(e) => {
                      setUsernameForgotPassword(e.target.value);
                    }}
                  />

                  {!usernameForgotPassword && (
                    <label className="absolute select-none pointer-events-none left-3 text-13-13 z-2 block transition-all text-white-300 top-1/2 -translate-y-1/2 text-description z-3">
                      Tên đăng nhập
                    </label>
                  )}
                </div>
                <div className="text-red-500 mt-2">{errorUsernameFGP}</div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            {chooseMethodSendOTP ? (
              <button
                disabled={isPhone===null}
                onClick={() => {
                  handleSendOTPForgotPassowrd();
                }}
                className="text-white mt-5 text-[22px] py-2 font-bold font-oswald  rounded-2xl cursor-pointer flex items-center justify-center whitespace-nowrap px-10 py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
              >
                <span>Tiếp tục </span>
              </button>
            ) : (
              <button
              disabled={!usernameForgotPassword}
                onClick={() => {
                  getInfoForgotPassword();
                }}
                className="text-white mt-5 text-[22px] py-2 font-bold font-oswald  rounded-2xl cursor-pointer flex items-center justify-center whitespace-nowrap px-10 py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
              >
                <span>Tiếp tục </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
