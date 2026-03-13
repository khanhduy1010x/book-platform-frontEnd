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
     const months = Math.floor(days / 30);
     const remainDays = days % 30;
     if(remainDays > 0 ) {
      return months + " Tháng " + remainDays + " Ngày";
     }else {
      return months + " Tháng";
     }
     
    }
    const getMemberTypeBadge = (memberType) => {
      const map = {
        BASIC:   { label: 'Basic',   className: 'bg-sky-500 text-white' },
        ADVANCE: { label: 'Advance', className: 'bg-violet-500 text-white' },
        PREMIUM: { label: 'Premium', className: 'bg-amber-400 text-black' },
      };
      const t = map[memberType] || { label: memberType, className: 'bg-gray-500 text-white' };
      return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.className}`}>{t.label}</span>;
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

        {/* ── HERO INTRO ── */}
        <div className="w-full max-w-6xl mt-6 mb-10 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            {/* Left text */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Book Platform</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-oswald leading-tight mb-4">
                Kho sách điện tử<br />
                <span className="text-primary">không giới hạn</span>
              </h1>
              <p className="text-gray-300 text-[15px] leading-relaxed mb-6">
                Nền tảng đọc sách trực tuyến với hàng nghìn đầu sách từ văn học, lịch sử, triết học đến khoa học &amp; giả tưởng.
                Trải nghiệm đọc sách mọi lúc mọi nơi trên trình duyệt, không cần cài đặt thêm ứng dụng.
              </p>
              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "fa-book-open", text: "1000+ đầu sách EPUB" },
                  { icon: "fa-bolt", text: "Đọc ngay, không chờ" },
                  { icon: "fa-shield-check", text: "Bảo mật tài khoản" },
                  { icon: "fa-gamepad", text: "Minigame thú vị" },
                  { icon: "fa-users", text: "Cộng đồng đọc sách" },
                  { icon: "fa-truck-fast", text: "Giao sách tận nhà" },
                ].map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-gray-700 text-gray-200 text-[13px] px-3 py-1.5 rounded-full">
                    <i className={`fa-solid ${f.icon} text-primary text-[12px]`}></i>
                    {f.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — tier cards */}
            <div className="flex flex-col gap-3 min-w-[220px]">
              {[
                { tier: "BASIC",   color: "from-sky-600 to-sky-400",     icon: "fa-book",       label: "Basic",   desc: "Mở khoá kho sách phổ thông, phù hợp người mới bắt đầu." },
                { tier: "ADVANCE", color: "from-violet-600 to-violet-400", icon: "fa-book-sparkles", label: "Advance", desc: "Truy cập kho sách nâng cao, ưu tiên nội dung mới nhất." },
                { tier: "PREMIUM", color: "from-amber-500 to-yellow-300",  icon: "fa-crown",      label: "Premium", desc: "Toàn quyền truy cập mọi nội dung, ưu đãi cao nhất." },
              ].map((t) => (
                <div key={t.tier} className={`bg-gradient-to-r ${t.color} rounded-xl px-4 py-3 flex items-center gap-3`}>
                  <i className={`fa-solid ${t.icon} text-white text-[20px] w-7 text-center`}></i>
                  <div>
                    <p className="font-bold text-white text-[14px]">{t.label}</p>
                    <p className="text-white/80 text-[12px] leading-snug">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-700">
            {[
              { num: "1,000+", label: "Đầu sách EPUB" },
              { num: "3",      label: "Cấp hội viên" },
              { num: "100%",   label: "Trên trình duyệt" },
              { num: "24/7",   label: "Hỗ trợ đọc sách" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-4">
                <span className="text-2xl font-extrabold text-primary font-oswald">{s.num}</span>
                <span className="text-gray-400 text-[12px] mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2">Gói hội viên</h1>
        <p className="text-center text-gray-400 mb-10">
          Đọc hàng nghìn nội dung trong Kho sách Hội viên — chọn gói phù hợp với nhu cầu của bạn.
        </p>
        <div className="w-full max-w-6xl">
          <h2 className="text-xl font-semibold mb-4">Mua gói theo tháng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
      {
        listMemberShip?.filter((item) => item.durationDays >= 30).reverse().map((item,index) => {
          return ( 
            <div key={index} className="bg-gray-800 p-6 relative rounded-lg border-2 border-primary pt-[45px] flex flex-col">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2 rounded-bl-xl rounded-br-xl inline-block font-bold">
            {item?.packageName}    </div>
              <div className="flex items-center gap-2 mb-1">
                {getMemberTypeBadge(item.memberType)}
              </div>
              <div className="text-xl font-bold"><span className='text-primary'>BOOK4.0 </span> / {formatDateAndMonth(item.durationDays)}</div>
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
                    <div className="mt-2 flex items-center gap-2">
                      {getMemberTypeBadge(item.memberType)}
                      <span className="font-bold text-[18px]"> {formatDateAndMonth(item.durationDays)}</span>
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