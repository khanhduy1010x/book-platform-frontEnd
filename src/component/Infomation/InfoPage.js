import { useLocation } from "react-router-dom";
import InfoManagement from "./../Infomation/AccountManager/InfoManagement";
import BookShelf from "./Bookshelf/BookShelf";
import HistoryTransiction from "./HistoryTransiction/HistoryTransiction";
import OrderHistory from "./OrderHistory/OrderHistory";
import SliderBar from "./SliderBar";
import { useEffect, useState } from "react"
import OrderDetailHistory from "./OrderHistory/OrderDetailHistory";
import { useAPI } from "../Service/APIContext";

export default function InfoPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const {getOrderDetail} = useAPI();
  const [isSelectBar, setIsSelectBar] = useState();
  const [isViewDetail, setIsViewDetail]=useState(false)
  const [orderDetail, setOrderDetail] = useState();
  const location = useLocation();
  useEffect(() => {
    if(location.pathname === "/info/order-history") {
      setIsSelectBar("Lịch sử mua hàng");
    }
    else if (location.pathname === "/info/book-shelf") {
      setIsSelectBar("Tủ sách cá nhân");

    }else if ( location.pathname === "/info/trans-history") { 
      setIsSelectBar("Lịch sử giao dịch");

    }
    else if ( location.pathname === "/info/order-history") { 
      setIsSelectBar("Lịch sử mua hàng");

    }
    const fetchApi = async () => {
      if (location.pathname.includes("/info/order-history/detail")) {
        console.log("is detail")
        const pathParts = location.pathname.split("/"); 
        const detailIndex = pathParts.indexOf("detail"); 
        if (detailIndex !== -1 && detailIndex + 1 < pathParts.length) {
            const id = pathParts[detailIndex + 1]; 
            if(id) {
              const data = await getOrderDetail(id);
              if(data === -1) return;
              setOrderDetail(data);
              setIsViewDetail(true);
            }
        } else {
          return;
        }
    }
    }
    fetchApi();
  },[location.pathname])
  return (
    <div className="pt-[72px] bg-black px-[62px] relative min-h-screen !font-oswald overflow-hidden">
      <div className="blur-layer-1 absolute top-[206px] !bg-blur-bg-primary right-1/2 z-0"></div>
      <div className="blur-layer-1 absolute top-[300px] left-[900px] !bg-blur-bg-primary right-1/2 z-0"></div>

      <div className="mt-[32px] flex">
        <div className="min-w-[330px] sticky top-[100px]">
          <SliderBar isSelectBar={isSelectBar} setIsSelectBar={setIsSelectBar}/>
        </div>
        <div className="flex-1">
          {
            isSelectBar === 'Quản lí thông tin' &&     <InfoManagement />
          }
          {
            isSelectBar === 'Tủ sách cá nhân' &&    <BookShelf/>

          }
           {
            isSelectBar === 'Lịch sử giao dịch' &&    <HistoryTransiction/>

          }
      
           {
            isSelectBar === 'Lịch sử mua hàng' &&    (isViewDetail ?  <OrderDetailHistory orderDetail={orderDetail} setIsViewDetail={setIsViewDetail}/>  : <OrderHistory currentPage={currentPage} setCurrentPage={setCurrentPage}/>) 

          }
      
        </div>
      </div>
    </div>
  );
}
