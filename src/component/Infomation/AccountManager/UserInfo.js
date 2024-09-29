import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import Button from "../../Shared/Button/Button";
export default function UserInfo() {   
    const [isFocusName, setIsFocusName] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isShowGenderBox, setIsShowGenderBox] = useState(false);
    const [isSelectGender, setIsSelectGender] = useState("Khác");
    const genderBoxRef = useRef(null);
    const [username] = useState("khanhduy1010x");
    const [userId] = useState("10200210");
    const [fullName, setFullName] = useState("Nguyễn Khánh Duy");
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          genderBoxRef.current &&
          !genderBoxRef.current.contains(event.target)
        ) {
          setIsShowGenderBox(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    return (
        <div className="flex gap-10">
<div className="flex flex-col gap-4 font-bold mt-6">
            <div className="flex relative">
              <input
                className="px-4 pb-2 pt-5 border flex-1 border-gray-300 rounded-xl bg-[#2a2a2c] text-gray-300"
                readOnly
                value={username}
              />
              <span className="absolute  text-[12px] left-[15px] text-gray-500 top-1">
                Tên đăng nhập
              </span>
            </div>
            <div className="flex relative">
              <input
                value={userId}
                readOnly
                className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl  bg-[#2a2a2c] text-gray-300"
              />
              <span className="absolute  text-[12px] left-[15px] text-gray-500 top-1">
                ID người dùng
              </span>
            </div>
            <div className="flex relative">
              <input
                onFocus={() => {
                  setIsFocusName(true);
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setIsFocusName(false);
                  }
                }}
                value={fullName}
                className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl bg-[#121214] text-gray-300"
              />
              <span
                className={`absolute ${
                  isFocusName
                    ? "top-1 transform"
                    : "translate-y-[15px] text-[14px]"
                } text-[12px] left-[15px] transition-all duration-300 out-in-ease text-gray-500`}
              >
                Họ và tên
              </span>
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1 flex">
                <div className="date-picker-container">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy/MM/dd"
                    locale={vi}
                    className="px-4 pb-2  border pt-5 w-full border-gray-300 rounded-xl  bg-[#121214] text-gray-300"
                    placeholderText="Chọn ngày"
                    calendarClassName="react-datepicker"
                  />
                </div>
                <span className="absolute  text-[12px] left-[15px] text-gray-500 top-1">
                  Ngày sinh
                </span>
                <i className="absolute right-10 top-[18px] text-[18px] fa-solid fa-calendar-range"></i>
              </div>
              <div
                className="flex relative flex-1"
                onClick={() => {
                  setIsShowGenderBox(!isShowGenderBox);
                }}
              >
                <input
                  readOnly
                  value={isSelectGender}
                  className="px-4 pb-2  border pt-5 w-full border-gray-300 rounded-xl  bg-[#121214] text-gray-300 cursor-pointer"
                />
                <span className="absolute  text-[12px] left-[15px] text-gray-500 top-1">
                  Giới tính
                </span>
                <i className="fa-sharp-duotone fa-solid  fa-caret-down absolute right-3 top-4 text-[26px] text-gray-300"></i>
                {isShowGenderBox && (
                  <div
                    className="absolute bg-[#121214] w-full border-gray-300 top-16 border rounded-xl p-2"
                    ref={genderBoxRef}
                  >
                    <div
                      className={` px-4 py-2 mb-[4px] rounded-xl hover:bg-[#2a2a2c] cursor-pointer ${
                        isSelectGender === "Nam"
                          ? "bg-[#2a2a2c] text-primary "
                          : ""
                      }`}
                      onClick={() => {
                        setIsSelectGender("Nam");
                      }}
                    >
                      Nam
                    </div>
                    <div
                      className={` px-4 py-2 mb-[4px] rounded-xl hover:bg-[#2a2a2c] cursor-pointer ${
                        isSelectGender === "Nữ"
                          ? "bg-[#2a2a2c] text-primary "
                          : ""
                      }`}
                      onClick={() => {
                        setIsSelectGender("Nữ");
                      }}
                    >
                      Nữ
                    </div>
                    <div
                      className={` px-4 py-2 mb-[4px] rounded-xl hover:bg-[#2a2a2c] cursor-pointer ${
                        isSelectGender === "Khác"
                          ? "bg-[#2a2a2c] text-primary "
                          : ""
                      }`}
                      onClick={() => {
                        setIsSelectGender("Khác");
                      }}
                    >
                      Khác
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        <div className="mt-6">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-white border">
                <img className="" src="https://cdn.vectorstock.com/i/1000v/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"/>
            </div>
            <Button name={"Thay ảnh"} padding={'flex justify-center mt-2 items-center px-1 py-1 text-[18px]'}/>
        </div>
          </div>
    );
}