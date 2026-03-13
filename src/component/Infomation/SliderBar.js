import Oyster from "../../assets/image/oyter.png";
import Fish from "../../assets/image/fishicon.png";
import Button from "../Shared/Button/Button";
import { useEffect, useState } from "react";
import { useAPI } from "../Service/APIContext";
import { Link } from "react-router-dom";


export default function SliderBar({isSelectBar, setIsSelectBar}) {
  const {userInfo,formatNumber} = useAPI()
  useEffect(() => {
    setIsSelectBar("Quản lí thông tin");
  },[])
  const menuItems = [
    { icon: "fa-solid fa-user", label: "Quản lí thông tin" },
    { icon: "fa-solid fa-user", label: "Tủ sách cá nhân" },
    { icon: "fa-solid fa-trophy-star", label: "Lịch sử mua hàng" },
    { icon: "fa-solid fa-clock-rotate-left", label: "Lịch sử giao dịch" },
    { icon: "fa-solid fa-headset", label: "Hỗ trợ khách hàng" },
  ];
  const handleClick = (label) => {
    setIsSelectBar(label);
  };
  return (
    <>
      {/* ── DESKTOP: vertical sidebar ───────────────────────────── */}
      <div className="hidden md:block w-full pr-6 pt-[24px] pb-[100%] border-r border-gray-700 !font-oswald z-1">
        {/* User info */}
        <div className="text-white mb-6">
          <h2 className="text-[22px] font-bold font-oswald truncate">{userInfo?.fullName}</h2>
          <div className="flex items-center mt-3">
            <div className="w-[18px] h-[18px] flex shrink-0">
              <img className="w-full object-cover" src={Oyster} />
            </div>
            <span className="font-bold text-primary font-oswald ml-2 text-[15px]">
              {formatNumber(userInfo?.amount)}đ
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full border-b border-gray-700 pb-6 mb-2">
          <Link to={'/deposit'} className="flex-1">
            <Button
              padding="px-3 py-2 flex justify-center items-center w-full"
              text="text-[13px] whitespace-nowrap"
              textColor="text-white"
              name="Nạp tiền"
            />
          </Link>
          <Link to={"/member-ship"} className="flex-1">
            <Button
              padding="px-3 py-2 flex justify-center items-center w-full"
              text="text-[13px] whitespace-nowrap"
              textColor="text-white"
              name="Mua hội viên"
            />
          </Link>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-1 mt-3 relative z-1">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`text-white font-oswald font-bold cursor-pointer px-4 py-3 rounded-xl transition-colors duration-150 ${
                isSelectBar === item.label
                  ? "bg-gray-700 !text-primary"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => handleClick(item.label)}
            >
              <i className={`${item.icon} mr-3 w-4 text-center`}></i>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE: compact top info + horizontal scroll tabs ────── */}
      <div className="md:hidden w-full !font-oswald pb-2 border-b border-gray-700 mb-4">
        {/* User info row */}
        <div className="flex items-center justify-between py-3">
          <h2 className="text-[18px] font-bold text-white truncate max-w-[55%]">{userInfo?.fullName}</h2>
          <div className="flex items-center gap-2">
            <div className="w-[16px] h-[16px] flex shrink-0">
              <img className="w-full object-cover" src={Oyster} />
            </div>
            <span className="font-bold text-primary font-oswald text-[13px]">
              {formatNumber(userInfo?.amount)}đ
            </span>
            <Link to={'/deposit'} className="ml-2">
              <Button
                padding="px-3 py-1.5 flex justify-center items-center"
                text="text-[12px] whitespace-nowrap"
                textColor="text-white"
                name="Nạp tiền"
              />
            </Link>
          </div>
        </div>

        {/* Horizontal scrollable tabs */}
        <div className="overflow-x-auto scrollbar-none -mx-1">
          <div className="flex gap-2 px-1 min-w-max">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-bold font-oswald whitespace-nowrap transition-colors duration-150 border ${
                  isSelectBar === item.label
                    ? "bg-gray-700 text-primary border-gray-500"
                    : "text-gray-300 border-gray-700 hover:bg-gray-800"
                }`}
                onClick={() => handleClick(item.label)}
              >
                <i className={`${item.icon} text-[12px]`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
