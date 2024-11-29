import React, { useState } from "react";
import logo from '../../assets/image/logo.png'

const SlidebarAdmin = ({isSelectTab,setIsSelectTab}) => {
  return (
    <div className="w-64 h-full  bg-gray-900 text-white flex font-oswald flex-col relative z-10 border-r border-white">
      <div className="w-full h-[69px] flex items-center border-b border-white  justify-center">
        <img src={logo} className="w-[150px] object-cover"></img>
        </div>
      <nav className="flex-1 h-full">
        <ul>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'book' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
          onClick={(e) => setIsSelectTab("book")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h11M9 21V3m4 18v-7a3 3 0 013-3h4a3 3 0 013 3v7"
              />
            </svg>
            QUẢN LÝ SÁCH
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'order' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("order")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            QUẢN LÝ ĐƠN HÀNG
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'account' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("account")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            QUẢN LÝ TÀI KHOẢN
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'banner' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("banner")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            QUẢN LÝ BANNER
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'memberShip' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("memberShip")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            QUẢN LÝ GÓI THÀNH VIÊN
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'author' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("author")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            QUẢN LÝ TÁC GIẢ
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'static' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("static")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            THỐNG KÊ
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'voucher' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("voucher")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          QUẢN LÍ VOUCHER
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'trans' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("trans")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          QUẢN LÍ LỊCH SỬ GIAO DỊCH
          </li>
          <li className={`p-2 m-2 rounded-xl hover:bg-gray-700 ${isSelectTab === 'chat' ? 'bg-gray-700' : '' }  cursor-pointer font-bold flex items-center`}
                    onClick={(e) => setIsSelectTab("chat")}

          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          PHẢN HỒI KHÁCH HÀNG
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SlidebarAdmin;
