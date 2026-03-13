import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import Button from "../../Shared/Button/Button";
import { useAPI } from "../../Service/APIContext";
import AvatarComponent from "../../Shared/Helper/AvatarComponent";
export default function UserInfo() {   
    const {userInfo,editAvatar,editInfor} = useAPI();
    const [isFocusName, setIsFocusName] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [fullName, setFullName] = useState();
    const inputRef = useRef();
    const [error, setError] = useState({})
  useEffect(() => {
    if(userInfo && userInfo.fullName ) {
      setFullName(userInfo.fullName)
    }
    if(userInfo && userInfo.birth ) {
      setSelectedDate(userInfo.birth)
    }
  },[userInfo])
    const handleButtonClick = () => {
      inputRef.current.click();
    };

    const hanldeEditAvatar = async (e) => {
      const file = e.target.files[0]; 
      console.log(file)
      console.log("heelo")

      if (!file) {
        return;
      }
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        return;
      }
    
      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        return;
      }
await editAvatar(file)
    
    }
    const handleEditInfo = async() => { 
      const regex = /^[\p{L} ]{2,50}$/u; 
      setError({})
      let hasError = false;
      const newError = {};

      if (!fullName || !regex.test(fullName.trim())) {
        newError.errorName = "Tên không hợp lệ (2-50 ký tự, không chứa số hoặc ký tự đặc biệt)";
        hasError = true;
      }
      if (!selectedDate) {
        newError.date = "Vui lòng chọn ngày sinh";
        hasError = true;
      } else if (selectedDate > new Date()) {
        newError.date = "Ngày sinh không hợp lệ";
        hasError = true;
      }
      if (hasError) {
        setError(newError);
        return;
      }
      await editInfor(fullName, selectedDate);
    }
    return (
      <div>
<div className="flex flex-col-reverse md:flex-row gap-6 md:gap-10">
<div className="flex flex-col flex-1 gap-4 font-bold mt-6">
            <div className="flex relative">
              <input
                className="px-4 pb-2 pt-5 border flex-1 border-gray-300 rounded-xl bg-[#2a2a2c] text-gray-300"
                readOnly
                defaultValue={userInfo?.username}
              />
              <span className="absolute  text-[12px] left-[15px] text-gray-500 top-1">
                Tên đăng nhập
              </span>
            </div>
            <div className="flex relative">
              <input
                defaultValue={userInfo?.accID}
                readOnly
                className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl  bg-[#2a2a2c] text-gray-300"
              />
              <span className="absolute  text-[12px] left-[15px] text-gray-500 top-1">
                ID người dùng
              </span>
            </div>
            {error && error.errorName && (
                <div className="text-red-500"> {error.errorName} </div>
              ) }
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
                onChange={(e) => setFullName(e.target.value)}
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
            <div className=" w-full gap-4">
            {error && error.date && (
                <div className="text-red-500 mb-4"> {error.date} </div>
              ) }
              <div className="relative flex-1 flex border-gray-300  border rounded-xl flex flex-1  bg-[#121214]">
                
                <div className="!w-full flex !flex-1">
                  <DatePicker
                    selected={ selectedDate}
                    id="DatePicker"
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy/MM/dd"
                    locale={vi}
                    className="px-4 pb-2   pt-5 !w-full rounded-xl flex flex-1  bg-[#121214]  text-gray-300"
                    placeholderText="Chọn ngày"
                    calendarClassName="react-datepicker"
                  />
                </div>
                <span className="absolute  text-[12px] left-[15px] text-gray-500 top-1">
                  Ngày sinh
                </span>
                <i className="absolute right-3 top-[18px] text-[18px] fa-solid fa-calendar-range"></i>
              </div>
           
            </div>
          </div>

        <div className="mt-6 flex flex-col items-center">
            <div className="rounded-full overflow-hidden border-white border w-[120px] h-[120px]">
                <AvatarComponent avatar={userInfo?.avatar} css={"w-full h-full object-cover"} />
            </div>
            <input type="file" className="hidden" ref={inputRef}
            onChange={(e) => {
              hanldeEditAvatar(e);
            }}
            ></input>
            <Button name={"Thay ảnh"} padding={'flex justify-center mt-2 items-center px-1 py-1 text-[18px]'}
           
                handleButtonClick={handleButtonClick}
           />
        </div>
          </div>
          <div className="flex items-center mt-6">

          <button className="bg-primary rounded-xl px-4 py-2 disabled:opacity-70 "
          onClick={handleEditInfo}
          disabled={(fullName === userInfo?.fullName && selectedDate === userInfo?.birth)}
          >Cập nhật</button>

          </div>
      </div>
        
    );
}