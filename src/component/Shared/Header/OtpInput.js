import { useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function OtpInput({ setModalStatus }) {
  const {
    sendRegisterAccount,
    accountCreatRequest,
    error,
    otpForgotPassword,
    validateOtpForgotPassword,
    invalidOtpResetPassword,
    sendSMSOTPReg,
  } = useAPI();
  const handleValidateOTP = () => {
    const otpString = otp.join("");
    sendRegisterAccount(otpString);
  };
  const handleValidateOTPForgotPassword = () => {
    const otpString = otp.join("");
    validateOtpForgotPassword(otpString);
  }
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const handleChange = (element, index) => {
    if (!isNaN(element.value) && element.value !== "") {
      setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  const handleKeyUp = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] !== "") {
        setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
      } else if (e.target.previousSibling) {
        e.target.previousSibling.focus();
        setOtp([...otp.map((d, idx) => (idx === index - 1 ? "" : d))]);
      }
    } else if (e.key === "ArrowRight") {
      if (e.target.nextSibling) {
        e.target.nextSibling.focus();
      }
    } else if (e.key === "ArrowLeft") {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-black justify-center h-250px pl-4">
      <h2 className="text-2xl text-primary font-semibold mb-2">Nhập mã OTP</h2>
      <span className="text-white mb-4">
        {otpForgotPassword
          ? "Nhập mã OTP để đặt lại mật khẩu"
          : `Mã OTP đã được gửi về số ${accountCreatRequest.phone}
`}
        {error?.register?.waittingTime && (
          <div className="text-red-500">{error.register?.waittingTime}</div>
        )}
     
      </span>

      <div className="flex space-x-2 items-center justify-center">
        {otp.map((data, index) => {
          console.log(!isNaN(data) && data !== "");
          return (
            <input
              className={`w-12 h-12 text-center text-xl ${
                !isNaN(data) && data !== "" ? "border-primary border-[4px]" : ""
              } rounded-lg outline-none`}
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              onKeyUp={(e) => handleKeyUp(e, index)}
            />
          );
        })}
      </div>
      {
          invalidOtpResetPassword && (
            <div className="text-red-500 mt-4">{invalidOtpResetPassword}</div>
          )
        }
      <button
        disabled={otp.some((value) => value === "")}
        onClick={() => {if(!otpForgotPassword) {
          handleValidateOTP()
        }else {
          handleValidateOTPForgotPassword()
        } }}
        className="mt-6 bg-primary hover:opacity-[0.8] text-white px-4 py-2 rounded-lg disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
      >
        Xác nhận OTP
      </button>
      {!otpForgotPassword && <div>
        <span
        onClick={() => sendSMSOTPReg(accountCreatRequest.phone)}
        className="text-xs mt-4 text-primary cursor-pointer"
      >
        {" "}
        <i className="fa-regular fa-arrows-rotate mr-1"></i>Gửi lại OTP
      </span>
      <span
        onClick={() => setModalStatus("")}
        className="text-xs mt-4 text-primary cursor-pointer"
      >
        <i className="fa-duotone fa-solid fa-swap-arrows mr-1"></i>Thay đổi số
        điện thoại
      </span>
        </div>}
   
    </div>
  );
}
