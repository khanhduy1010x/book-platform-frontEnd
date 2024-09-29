import InfoManagement from "./../Infomation/AccountManager/InfoManagement";
import BookShelf from "./Bookshelf/BookShelf";
import HistoryTransiction from "./HistoryTransiction/HistoryTransiction";
import SliderBar from "./SliderBar";
import { useState } from "react"

export default function InfoPage() {
  const [isSelectBar, setIsSelectBar] = useState();

  return (
    <div className="pt-[72px] bg-black px-[62px] relative min-h-screen">
      <div className="blur-layer-1 absolute top-[206px] !bg-blur-bg-primary right-1/2 z-0"></div>
      <div className="mt-[32px] flex">
        <div className="min-w-[330px]">
          <SliderBar isSelectBar={isSelectBar} setIsSelectBar={setIsSelectBar}/>
        </div>
        <div className="flex-2">
          {
            isSelectBar === 'Quản lí thông tin' &&     <InfoManagement />
          }
          {
            isSelectBar === 'Tủ sách cá nhân' &&    <BookShelf/>

          }
           {
            isSelectBar === 'Lịch sử giao dịch' &&    <HistoryTransiction/>

          }
      
        </div>
      </div>
    </div>
  );
}
