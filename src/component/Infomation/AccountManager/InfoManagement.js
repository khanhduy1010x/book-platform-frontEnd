import { useState, useEffect, useRef } from "react";

import UserInfo from "./UserInfo";
import AccountSecurity from "./AccountSecurity";
import SocialConnect from "./SocialConnect";

export default function InfoManagement() {
  const taskbarManagements = [
    { label: "Thông tin cá nhân" },
    { label: "Tài khoản và bảo mật" },
    { label: "Tài khoản liên kết" },
  ];
  const [isLabelFocus, setIsLabelFocus] = useState("Thông tin cá nhân");

  const handleClickLabel = (label) => {
    setIsLabelFocus(label);
  };

  return (
    <div className="ml-6 text-white pt-[12px] relative z-1">
      <div>
        <h2 className="text-[32px] font-bold font-rubik">
          Quản lí thông tin cá nhân
        </h2>
        <div className="relative">
          <div className="border-b-[1.5px] absolute top-10 pb-2 w-full border-gray-500"></div>
          <div className="inline-block">
            <div className="">
              <div className="flex gap-5 mt-4 font-rubik font-bold text-[16px]">
                {taskbarManagements.map((item) => (
                  <div
                    key={item.label}
                    className={`cursor-pointer ${
                      isLabelFocus === item.label ? "text-primary" : ""
                    }`}
                    onClick={() => handleClickLabel(item.label)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              {isLabelFocus === "Thông tin cá nhân" && <UserInfo />}
              {isLabelFocus === "Tài khoản và bảo mật" && <AccountSecurity />}
              {isLabelFocus === "Tài khoản liên kết" && <SocialConnect />}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
