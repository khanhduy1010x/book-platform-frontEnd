import { useState } from "react"
import TransictionTable from "./TransictionTable"

export default function HistoryTransiction() {
    const [isSelectTab, setIsSelectTab] = useState('Mua gói cước')
    return (
        <div className="mt-4 font-rubik text-white ml-6 relative z-1">
         <h2 className="text-[32px] font-bold font-rubik mb-2">
          Lịch sử giao dịch
        </h2>
        <div className="flex font-bold text-[18px] gap-10 text-white ">
        <p className={`${isSelectTab === 'Mua gói cước' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectTab("Mua gói cước")}>Mua gói cước</p>
        <p className={`${isSelectTab === 'Mua nội dung' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectTab("Mua nội dung")}>Mua nội dung</p>
        <p className={`${isSelectTab === 'Mua sò' ? 'text-primary' : '' } cursor-pointer`} onClick={() => setIsSelectTab("Mua sò")}>Mua sò</p>
      </div>
      <div>
        <TransictionTable/>
      </div>
        </div>
    )
}