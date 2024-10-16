import { useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function ForgotPassword() {

const[username, setUsername] = useState("");
  return (
    <div>
      <span className="text-primary font-bold text-center text-3xl pl-[20px]">
        Quên mật khẩu
      </span>
      <p className="text-white mb-6">Chào mừng bạn đến với Book4.0</p>
          <div className="px-8  border-white-overlay">
          <div className="mb-3">
                      <div className="flex flex-col">
                      <span className="mb-4">Điền số điện thoại hoặc email của bạn để nhận mã xác thực</span>

                        <div className="relative w-full h-14 border rounded-xl border-white-300">
                          <input
                            type="text"
                            className="input-focus-index input-auth text-white-50 bg-transparent w-full h-full top-0 left-0 absolute pt-4-5 outline-none px-3 text-base-16-19"
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                          />
                          {!username && (
                            <label className="absolute select-none pointer-events-none left-3 text-13-13 z-2 block transition-all text-white-300 top-1/2 -translate-y-1/2 text-description z-3">
                              Email/Số điện thoại
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                      <button
                      className="text-white mt-5 text-[22px] py-2 font-bold font-oswald  rounded-2xl cursor-pointer flex items-center justify-center whitespace-nowrap px-10 py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
                    >
                      <span>Tiếp tục </span>
                    </button>
                    </div>
                    </div>
         

         
          </div>
      

    </div>
  );
}