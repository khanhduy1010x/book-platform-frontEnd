import { useState } from "react";
import BookList from "./BookList";

export default function BookShelf() {
  const [isSelectType, setIsSelectType] = useState("Đang đọc");
  return (
    <div className="pt-[12px] text-white ml-0 md:ml-6 relative z-1 font-oswald">
         <h2 className="text-[24px] md:text-[32px] font-bold mb-2">
          Tủ sách cá nhân
        </h2>
      <div className="flex overflow-x-auto scrollbar-none font-bold text-[16px] md:text-[18px] gap-5 md:gap-10 text-white pb-1">
        <p className={`${isSelectType === 'Đang đọc' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectType("Đang đọc")}>Đang đọc</p>
        <p className={`${isSelectType === 'Sách đã mua' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectType("Sách đã mua")}>Sách đã mua</p>
        <p className={`${isSelectType === 'Sách yêu thích' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectType("Sách yêu thích")}>Sách yêu thích</p>
      </div>
      <BookList isSelectType={isSelectType}/>
    </div>
  );
}
