import { useState } from "react";
import { useAPI } from "../../Service/APIContext";
export default function CreatePasswordDialog() {
  const { createPassword, created, setShowModal, skipPasswordPrompt } =
    useAPI();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRePasswordFocused, setIsRePasswordFocused] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterRePassword, setShowRegisterRePassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRepassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState("");
  const [invalidRepassword, setInvalidRepassword] = useState("");
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleSkipButton = () => {
    if (isChecked) {
      skipPasswordPrompt();
    }
    setShowModal(false);
  };

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
      createPassword(password);
    }
  };

  return (
    <div>
      <span className="text-primary font-bold text-center text-3xl pl-[20px]">
        {created ? "Tạo mật khẩu thành công" : "Tạo Mật Khẩu"}
      </span>
      <p className="text-white mb-6">Chào mừng bạn đến với Book4.0</p>
      {!created ? (
        <>
          <div className="px-8  border-white-overlay">
            <h3 className="text-base-16-19 text-white-50">
              Tạo mật khẩu cho những lần đăng nhập sau ( hoặc bỏ qua )
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
            <div className="mt-6">
              <p
                className="text-sm-15-19 hover:text-primary cursor-pointer font-bold "
                onClick={handleSkipButton}
              >
                Bỏ qua
              </p>
              <div class="inline-flex items-center">
                <label
                  class="relative flex cursor-pointer items-center rounded-full p-3"
                  for="ripple-on"
                  data-ripple-dark="true"
                >
                  <input
                    id="ripple-on"
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    class="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-primary shadow  transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary "
                  />
                  <span class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <label
                  class="cursor-pointer font-bold text-white text-sm mr-8"
                  for="ripple-on"
                >
                  Không nhắc lại{" "}
                </label>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[24px] font-bold">
            {" "}
            Giờ đây bạn đã có thể đăng nhập bằng Gmail của bạn và mật khẩu vừa tạo
          </h1>
          <button
            className="text-white mt-6 text-[18px] py-2 font-bold rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3 bg-primary  disabled:bg-[#184443] disabled:text-[#919595] disabled:cursor-not-allowed"
            onClick={() => setShowModal(false)}
          >
            <span>Bắt đầu đọc sách</span>
          </button>
        </>
      )}
    </div>
  );
}