import { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";

export default function NotificationDialog() {
  const [listNoti, setListNoti] = useState([]);
  const {getNotification} = useAPI();
  useEffect(() => {
    const fetchApi = async () => {
      const list = await getNotification();
      setListNoti(list.reverse());
    }
    fetchApi()
  },[])
  const calculateTimeDifference = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    const now = new Date();
    const differenceInMilliseconds = now - date;
    const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    return `${days} ngày trước`;
};

    return (
        <div
        className="w-[450px] pb-6 right-0 backdrop-blur invisible opacity-0 after:content-[''] after:absolute after:w-[450px] after:h-[16px] after:-top-[16px] after:left-0 after:right-0 absolute group-hover:visible group-hover:opacity-100 ease-in-out transition-opacity duration-500 text-white bg-background-book rounded-xl"
        style={{ zIndex: 2188 }}
      >
        <div className="py-2 py-4 pl-2 cursor-default">
          <span className="px-4 text-lg font-bold font-rubik ">
            Thông báo
          </span>
        </div>
        <div className="max-h-[350px] overflow-y-scroll px-4 pb-2 add-scrollbar ">
          {
            listNoti?.length > 0 &&  listNoti?.map((item,index) => (
              <div key={index} className="p-3 rounded-xl hover:bg-background-white flex gap-2 cursor-pointer">
              <div className="bg-white-overlay p-2 rounded-xl w-10 h-10">
                <img
                  src="https://waka.vn/svgs/icon-open-book.svg"
                  alt="icon-open-book"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex-1 gap-1">
                <p className="text-[13px] text-white-300 t-ellipsis-1">
                  {calculateTimeDifference(item.createAt)}
                </p>
                <p className="font-medium text-base text-white-default t-ellipsis-1">
                  {item.title}
                </p>
                <p className="text-[13px] text-white-300 line-clamp-3">
                {item.message}
                </p>
              </div>
            </div>
            ))
          }
      
      
        </div>
      </div>
    );
  }
  