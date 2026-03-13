import { useState } from "react"
import TransictionTable from "./TransictionTable"

export default function HistoryTransiction() {
    const [isSelectTab, setIsSelectTab] = useState('Mua gói cước')
    return (
        <div className="mt-4 font-rubik text-white ml-0 md:ml-6 relative z-1">
         <h2 className="text-[24px] md:text-[32px] font-bold font-rubik mb-2">
          Lịch sử giao dịch
        </h2>
        <div className="flex overflow-x-auto scrollbar-none font-bold text-[16px] md:text-[18px] gap-5 md:gap-10 text-white pb-1">
        <p className={`${isSelectTab === 'Tất cả' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectTab("Tất cả")}>Tất cả</p>
        <p className={`${isSelectTab === 'Mua gói cước' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectTab("Mua gói cước")}>Mua gói cước</p>
        <p className={`${isSelectTab === 'Mua nội dung' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectTab("Mua nội dung")}>Mua nội dung</p>
        <p className={`${isSelectTab === 'Nạp Tiền' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectTab("Nạp Tiền")}>Nạp Tiền</p>
      </div>
      <div>
        <TransictionTable isSelectTab={isSelectTab}/>
      </div>
        </div>
    )
}