import Oyster from "../../assets/image/oyter.png";
import Fish from "../../assets/image/fishicon.png";
import Button from "../Shared/Button/Button";
import { useEffect, useState } from "react";

export default function SliderBar({isSelectBar, setIsSelectBar}) {
  useEffect(() => {
    setIsSelectBar("Quản lí thông tin");
  },[])
  const menuItems = [
    { icon: "fa-solid fa-user", label: "Quản lí thông tin" },
    { icon: "fa-solid fa-user", label: "Tủ sách cá nhân" },
    { icon: "fa-solid fa-trophy-star", label: "Thành tích" },
    { icon: "fa-solid fa-clock-rotate-left", label: "Lịch sử giao dịch" },
    { icon: "fa-solid fa-headset", label: "Hỗ trợ khách hàng" },
  ];
  const handleClick = (label) => {
    setIsSelectBar(label);
  };
  return (
    <div className="inline-block w-100 border-r-0.1 border-gray-500 p-2 pt-[24px] pb-[100%] z-1">
    <div className="inline-block">
      <div className="flex">
        <div className="text-white  mr-3">
          <h2 className="text-[24px] font-bold font-rubik">Nguyễn Khánh Duy</h2>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-[20px] h-[20px] mt-[2px] flex">
                <img className="w-100 object-cover" src={Oyster} />
              </div>
              <div className="mb-[-3px]">
                <span className="text font-bold text-primary font-rubik ml-2">
                  999.999đ
                </span>
              </div>
            </div>
            <div className="flex items-center ml-3">
              <div className="w-[20px] h-[20px] mt-[2px] flex">
                <img className="w-100 object-cover" src={Fish} />
              </div>
              <div className="mb-[-3px]">
                <span className="text font-bold text-primary font-rubik ml-2">
                  999.999đ
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
          <img
            className="w-100 "
            src="https://cdn.vectorstock.com/i/1000v/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-4 border-b border-gray-500 pb-8 relative z-1">
        <Button
          padding="px-2 py-2 flex justify-center items-center w-full"
          text="text-[14px]"
          textColor="text-white"
          name="Nạp sò"
        />
        <Button
          padding="px-2 py-2 flex justify-center items-center w-full z-1"
          text="text-[14px]"
          textColor="text-white"
          name="Trờ thành hội viên"
        />
      </div>
      <div className="mt-4 relative z-1">
      {menuItems.map((item) => (
            <div
              key={item.label}
              className={`text-white font-rubik font-bold cursor-pointer p-2 rounded-xl pl-4 ${
                isSelectBar === item.label ? "bg-gray-500 !text-primary" : ""
              }`}
              onClick={() => handleClick(item.label)}
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.label}
            </div>
          ))}
      </div>
    </div>
    </div>
  );
}
