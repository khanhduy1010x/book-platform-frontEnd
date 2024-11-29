import { useEffect, useState } from "react";
import { useAPI } from "../Service/APIContext";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../Order/ConfirmModal";
import ConfirmModalMemberPackage from "./ConfirmModalMemberPackage";
import ModalQrMemberShip from "./ModalQrMemberShip";

export default function PaymentMemberShip() {
    const {formatNumber,memberPackage,userInfo,getSaleMemberShipPackage,getQRCodeMemberPackage,checkQRMemberPackage, isLogin} =useAPI();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Quét QR CODE');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false)
    const [qrCode, setQrCode] = useState("");
    const [messageKey, setMessageKey] = useState("");
    const navigate = useNavigate()
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [totalSale, setTotalSale] = useState(0);
   
    const paymentMethods = [
      'Quét QR CODE',
    'Thanh toán bằng số dư trên website'
    ];

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
       const handlePaymentMemberPackage = async () =>  { 
if ( selectedPaymentMethod ===  'Thanh toán bằng số dư trên website'
) {
    console.log("isOk")
    setShowConfirmModal(true);
}else {
    const request = {
        memberShipPackageID : memberPackage.id
    }
   const qrCode = await getQRCodeMemberPackage(request);
   setQrCode(qrCode.qrUrl);
   setMessageKey(qrCode.messageKey);
   checkQRMemberPackage(qrCode.messageKey);
    setShowQrModal(true);

}
       }
       useEffect(() => {
        console.log("here")
        const getSale = async () => {
            const salePrice = await getSaleMemberShipPackage(memberPackage.id);
            console.log(salePrice)
            setTotalSale(salePrice);
        }
        getSale()
       },[])
       const MemberType = ["NONE", "BASIC", "ADVANCE", "PREMIUM"];

function compareMemberType(value1, value2) {
    const index1 = MemberType.indexOf(value1);
    const index2 = MemberType.indexOf(value2);

    if (index1 === -1 || index2 === -1) {
        throw new Error("Invalid MemberType value");
    }

    if (index1 > index2) {
        return false;
    } else if (index1 < index2) {
        return true;
    } else {
        return true;
    }
}

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-oswald">
         {showConfirmModal && <ConfirmModalMemberPackage memberPackage={memberPackage} setShowConfirmModal={setShowConfirmModal} totalSale={totalSale}
   />}
            {showQrModal && <ModalQrMemberShip qrCode={qrCode} messageKey={messageKey}/> }
        <div className="w-full p-6  rounded-lg  px-[65px]">
        <Link to='/member-ship' className=" text-primary cursor-pointer hover:opacity-[0.8]"><i className="fa-solid fa-hand-back-point-left mr-2 text-[24px]"></i>Chọn lại gói khác </Link>
          <h2 className="text-5xl font-bold mb-2 mt-8">Chọn hình thức thanh toán</h2>
          <p className="text-xl text-gray-400 mb-8">An toàn - Nhanh chóng - Bảo mật</p>
          {
           !compareMemberType(userInfo.memberType, memberPackage.memberType) && <div className="text-center mb-2 text-red-500 text-[18px]"> <i class="fa-duotone fa-solid fa-triangle-exclamation mr-2"></i>Bạn đang sử dụng gói cao hơn gói này! Bạn không thể mua gói này.</div> 
          }

          <div className="flex justify-between">
            {/* Phần chọn phương thức thanh toán */}
            <div className="w-full border-t border-gray-500 pr-[65px]">
              <h3 className="text-xl font-semibold mb-4 mt-14">Chọn phương thức thanh toán</h3>
              <ul className="space-y-4">
                {paymentMethods.map((method) => (
                  <li
                    key={method}
                    className={`p-2 rounded-lg cursor-pointer ${
                      selectedPaymentMethod === method ? 'bg-[#2a292b] border border-primary' : 'bg-[#121214] border border-gray-400'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method)}
                  >
                    <div className="flex justify-between items-center">

             
                    <div className="flex gap-5 items-center px-2"> 

                    { 'Quét QR CODE' === method  && <i className="fa-solid fa-qrcode text-[38px] bg-[#403e40] p-2 rounded-xl"></i>}
                    {     'Thanh toán bằng số dư trên website'
 === method  && <i className="fa-solid fa-wallet text-[38px] bg-[#403e40] p-2 rounded-xl"></i>}
         
<span className="text-[24px] font-bold">{method}</span>
   {
    
   }
                    </div>
                    {
                  selectedPaymentMethod === method  && <i className="fa-solid fa-check mr-4 text-[28px] text-primary"></i>
            }

</div>

                               
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Phần thông tin thanh toán */}
            <div className="w-full bg-[#2a292b] p-6">
              <h3 className="text-xl font-semibold pb-4 border-b border-gray-500 ">Thông tin thanh toán</h3>
              <div className="space-y-4 ">
                <div className="flex justify-between mt-4">
                  <span className="text-[18px] font-bold]">Sản phẩm :</span>
                 <div className="bg-gray-700 rounded-xl px-4 overflow-hidden p-2 text-white outline-none"> {memberPackage?.packageName} - {formatDateAndMonth(memberPackage?.durationDays)} </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[18px] font-bold]">Tạm tính :</span>
                  <span className="font-bold  text-primary">{formatNumber(memberPackage?.price)}đ</span>
                </div>
                {
                    totalSale !== 0 && (
                        <div className="flex justify-between">
                       <div className="flex items-center"><span className="text-[18px] font-bold]">Giá giảm (Dựa trên gói đã sở hữu)  :</span><div className="group"><i className="fa-solid fa-circle-info text-white ml-2"></i>
                       <div className="bg-white text-black text-[14px] max-w-[300px] rounded-xl p-3 absolute hidden group-hover:block">
  <p className="italic">Chúng tôi hiểu rằng quý khách vẫn còn thời gian sử dụng gói hiện tại, vì vậy chúng tôi sẽ quy đổi phần thời gian còn lại thành một khoản tiền giảm giá khi quý khách nâng cấp lên gói thành viên cao hơn.</p>
  
  <p className="font-semibold mt-2">Cách tính tiền giảm giá:</p>
  <p>Giá trị giảm được tính dựa trên số ngày còn lại của gói hiện tại và giá mỗi ngày của gói này.</p>
  <p>Khoản giảm giá tối đa là 20% giá trị của gói mới.</p>
  
  <p className="font-semibold mt-2">Ví dụ cách tính:</p>
  <p>Nếu gói hiện tại của quý khách còn lại 10 ngày, và mỗi ngày trị giá 10.000 VND, tổng giá trị giảm là 100.000 VND.</p>
  <p>Trong trường hợp này, nếu 20% giá trị của gói mới là 80.000 VND, khoản giảm giá tối đa của quý khách sẽ là 80.000 VND.</p>
</div>

                        </div></div>
                        <span className="font-bold  text-primary">{formatNumber(totalSale)}đ</span>
                      </div>
                    )
                }
                <div className="flex justify-between">
                  <span className="text-[18px] font-bold]">Hình thức thanh toán :</span>
                  <span className="font-bold">{selectedPaymentMethod}</span>
                </div>
             
            
                <div className="flex justify-between text-lg font-semibold border-t border-gray-500 pt-3">
                  <span className="text-[18px] font-bold]">TỔNG :</span>
                  <span>{formatNumber(memberPackage?.price - totalSale)}đ</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
              <button className=" bg-primary hover:opacity-[0.9] disabled:opacity-[0.5] px-4 text-white font-bold p-3 rounded-xl mt-6"
              disabled ={!compareMemberType(userInfo.memberType, memberPackage.memberType)}
              onClick={() =>  {
                handlePaymentMemberPackage()
              }}
              >
                Thanh toán
              </button>
              </div>
         
            </div>
          </div>
        </div>
      </div>
    );
  }
  
