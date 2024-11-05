import { useAPI } from "../Service/APIContext";

export default function VoucherModal({setShowModalVoucher}) {
    const {listVoucher,addVoucherToCart} = useAPI();
    const mapMemberType = (memberType) => {
        switch (memberType) {
            case 'NONE':
                return 'NORMAL';
            case 'BASIC':
                return 'SILVER';
            case 'ADVANCE':
                return 'GOLDEN';
            case 'PREMIUM':
                return 'DIAMON';
            default:
                return 'UNKNOWN';
        }
    };
    const mapDiscount = (discountType, discountValue) => {
        if (discountType === 'PERCENTAGE') {
            return `Giảm ${discountValue}%`;
        } else if (discountType === 'FIXED_AMOUNT') {
            return `Giảm trực tiếp ${discountValue.toLocaleString()} VND`;
        } else {
            return 'Không xác định';
        }
    };
  return (
    <div
      id="voucherModal"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100000]"
    >
      <div className="bg-white rounded-lg w-120 p-6">
        <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2 border-gray-300">
          Chọn Voucher
        </h2>

        <div className="flex items-center border-b-[2px] border-gray-200 pb-3">
          <input
            type="text"
            placeholder="Mã Voucher"
            className="border border-gray-300 rounded-l-lg p-2 flex-grow focus:outline-none"
          />
          <button className="bg-gray-300 rounded-r-lg px-4 py-2 text-gray-700 font-semibold hover:bg-gray-400">
            Áp Dụng
          </button>
        </div>
        <div className=" h-[600px] w-[380px] px-6 overflow-y-auto mt-2">
        <div> 
        <div className="text-primary font-bold mb-4">Cho mọi người {`(Có thể chọn ${3 - listVoucher?.reduce((totalVoucher, item)=> {
            return item.voucher.public && item.inCart ? totalVoucher + 1 : totalVoucher;
        },0)})`}</div>
        <div className="space-y-3 mb-6">
            {
                listVoucher?.filter((item) => item.voucher.public).map((item,index) => (
<div key={index} className={` relative p-4 border rounded-lg border-gray-500 flex items-center ${item.available || item.inCart  ? '' : 'disable-voucher !border-gray-200'} `}>
            <button className="absolute w-[77px] py-1 px-2 -right-4 top-[10px] rounded overflow-hidden rotate-[40deg]  text-[11px]  bg-primary text-white font-bold">
             {mapMemberType(item?.voucher?.memberType)}
            </button>
            <div className="mr-2">
            <label className="custom-checkbox">
  <input type="checkbox" 
  checked = {item.inCart}
              onChange={() => {addVoucherToCart(item.voucher.id)}}
  />
  <span className="checkmark"></span>
</label>
          </div>
            <div>
              <p className="font-semibold text-gray-800">
                {item?.voucher?.voucherName} | <span className="font-bold text-primary">{mapDiscount(item?.voucher?.discountType,item?.voucher?.discountValue)}</span>
              </p>
              <p className="text-sm text-gray-600">{item?.voucher?.voucherDescription}</p>
            </div>
          </div>
                ))
            }
        
        </div>
        </div>
        <div> 
        <div className="text-primary font-bold mb-4 border-t border-gray-300 pt-4">Dành cho bạn {`(Có thể chọn ${1 - listVoucher?.reduce((totalVoucher, item)=> {
            return !item.voucher.public && item.inCart ? totalVoucher + 1 : totalVoucher;
        },0)})`}</div>
        <div className="space-y-3 mb-6">
        {
                listVoucher?.filter((item) => !item.voucher.public).map((item,index) => (
<div key={index} className={` relative p-4 border rounded-lg flex items-center ${item.available || item.inCart  ? '' : 'disable-voucher'} `}>
            <button className="absolute w-[77px] py-1 px-2 -right-4 top-[10px] rounded overflow-hidden rotate-[40deg]  text-[11px]  bg-primary text-white font-bold">
             {mapMemberType(item?.voucher?.memberType)}
            </button>
            <div className="mr-2">
            <label className="custom-checkbox">
  <input type="checkbox" 
  checked = {item.inCart}
              onChange={() => {addVoucherToCart(item.voucher.id)}}
  />
  <span className="checkmark"></span>
</label>
          </div>
            <div>
              <p className="font-semibold text-gray-800">
                {item?.voucher?.voucherName} | <span className="font-bold text-primary">{mapDiscount(item?.voucher?.discountType,item?.voucher?.discountValue)}</span>
              </p>
              <p className="text-sm text-gray-600">{item?.voucher?.voucherDescription}</p>
            </div>
          </div>
                ))
            }
        </div>
        </div>
      

       
      </div>
      <div className="flex justify-end pt-4 border-t-[2px] border-gray-200">
        
          <button className="px-4 py-2 bg-primary text-white rounded-xl hover:scale-[105%] hover:font-bold trasition-all duration-300"
          onClick={() => setShowModalVoucher(false)}
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}
