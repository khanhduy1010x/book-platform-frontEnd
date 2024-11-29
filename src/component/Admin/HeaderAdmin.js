import React from "react";
import logo from '../../assets/image/logo.png'
import { useAPI } from "../Service/APIContext";
const HeaderAdmin = () => {
  const {userInfo} = useAPI()
  return (
    <div className="bg-gray-900 h-[69px]  text-white flex items-center justify-end p-4 font-oswald border-b border-white relative z-10">
      <div className="flex justify-center flex-1 font-bold items-center text-[28px] ">
      <i className="fa-solid fa-gear fa-spin mr-2"></i>
      ADMIN MANAGER BOOK4.0
        </div>     

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center gap-2 ">

    
      
        <img
          src={userInfo?.avatar}
          alt="Avatar"
          className="rounded-full w-8 h-8 object-cover border-[1px] border-white "
        />
                <span className="font-bold ">{userInfo?.fullName}</span>

            </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
