import { useEffect, useState } from "react"
import { useAPI } from "../Service/APIContext";
import { Link, useNavigate } from "react-router-dom";

export default function MemberShip() {
  const {getMemberShipPackage,formatNumber,setMemberPackage,isLogin, setShowModal, setModalStatus} = useAPI();
  const [listMemberShip, setListMemberShip] = useState([]);
  const navigate = useNavigate()
  
  useEffect(() => {
  const getList = async() => {
    const listMemberShip = await  getMemberShipPackage();
    setListMemberShip(listMemberShip);
  }
  getList();
  },[])
    const formatDateAndMonth = (days) => {
     if(days < 30 ) {
      return days + " Ngày";

     }
     if(days % 30 > 0 ) {
      return days/30 + " Tháng " + days%30 + " Ngày" 
     }else {
      return days/30 + " Tháng";
     }
     
    }
    const handleBuyPackage = (item) => {
      setMemberPackage(item);
      if(!isLogin) {
        setModalStatus('login');
        setShowModal(true)
        return;
      }
      navigate('/payment-member-package');
    }
    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center py-12 px-4 pt-[72px]">
            <div className="bg-[url('https://waka.vn/target/dist/client/member-package-plan.jpg?v=1729645921556)]"></div>
        <h1 className="text-4xl font-bold mb-2 mt-[20px]">Gói hội viên</h1>
        <p className="text-center text-gray-400 mb-10">
          Nghe và đọc hơn 20,000 nội dung thuộc Kho sách Hội viên (Không bao gồm kho sách Hiệu Số, sách mua lẻ)
        </p>
        <div className="w-full max-w-6xl">
          <h2 className="text-xl font-semibold mb-4">Mua gói theo tháng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
      {
        listMemberShip?.filter((item) => item.durationDays >= 30).reverse().map((item,index) => {
          return ( 
            <div key={index} className="bg-gray-800 p-6 relative rounded-lg border-2 border-primary pt-[45px] flex flex-col">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2 rounded-bl-xl rounded-br-xl inline-block font-bold">
            {item?.packageName}    </div>              <div className="text-xl font-bold"><span className='text-primary'>BOOK4.0 </span> / {formatDateAndMonth(item.durationDays)}</div>
              <p className="text-2xl font-bold my-4">{formatNumber(item.price)}đ</p>
              <p className="text-gray-400 text-[14px] mb-2 italic">{item.description}</p>
              <button 
              onClick ={() => {
                handleBuyPackage(item);
              }}
              className="mt-auto w-full py-2 bg-orange-500 text-white rounded-lg font-semibold ">
                Mua gói
              </button>
            </div>
          )
        })
      }
          </div>
        </div>
       
  
        <div className="w-full max-w-6xl mt-10">
          <h2 className="text-xl font-semibold mb-4">Mua gói theo ngày</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {
              listMemberShip.filter((item) => item.durationDays < 30 ).map((item, index) => { 
                return ( 
                  <div key={index} className="bg-gray-800 p-4 rounded-lg flex flex-col ">
                    <div className="flex flex-col">
                    <p className="text-xl font-bold pb-2 border-b-[2px] border-gray-500"><span className='text-primary'>{item.packageName}</span></p>
                    <div className="mt-2">
                    <span className="font-bold text-[18px] pb-2  border-b-[2px] border-gray-500 "> {formatDateAndMonth(item.durationDays)}</span>
                    </div>
                    </div>
                
                  <p className="text-xl font-bold my-4 text-primary">{formatNumber(item.price)}đ</p>
                  <button 
                    onClick={() => handleBuyPackage(item)}
                  className="mt-auto hover:bg-orange-500  w-full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                  
                    Mua gói
                  </button>
                </div>
                )
              })
            }

         
      
       
          </div>
        </div>
  
     
      </div>
    )
}