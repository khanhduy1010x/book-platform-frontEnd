import { Link } from "react-router-dom";
import { useAPI } from "../../Service/APIContext";

export default function OrderDetailHistory({orderDetail,setIsViewDetail}) {
    const {formatDate,
        mapPaymentStatusToVietnamese,
        mapPaymentMethodToVietnamese,
        mapShipStatusToVietnamese,
        formatNumber,
        getStatusColor
    } = useAPI();
  return (
    <div className="order-detail-page p-5 bg-book backdrop-blur  shadow-white relative z-[10] rounded-xl">
      <div className="container mx-auto">
        <div className="text-primary font-bold cursor-pointer"
    onClick={() => setIsViewDetail(false)}
        >Xem tất cả đơn hàng</div>
        <div className="text-[28px] font-bold mb-3 text-white">
          Chi tiết đơn hàng <span className="text-primary">#{orderDetail.id}</span>
        </div>

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="w-full md:w-2/3 p-5 bg-book backdrop-blur border-[1px] border-white rounded-lg shadow-md mb-5">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  <i className="fas fa-receipt"></i> Đơn hàng ngày {formatDate(orderDetail.date)}
                </h2>
                <p className="text-white">{mapPaymentMethodToVietnamese(orderDetail.paymentMethod)} <span className="text-primary"></span></p>
                <p className="text-white">Trạng thái thanh toán: {mapPaymentStatusToVietnamese(orderDetail.paymentStatus)} <span className="text-primary"></span></p>

              </div>
              <div className=" font-semibold"> <span className={`status-indicator inline-block !w-2.5 !h-2.5  bg-${getStatusColor(orderDetail.shipStatus)}  rounded-full mr-2 animate-blink`}></span>
                <span className={` text-${getStatusColor(orderDetail.shipStatus)}`}>
                  {mapShipStatusToVietnamese(orderDetail.shipStatus)}
                </span></div>
            </div>

            <div className="border-b border-gray-300 mb-4"></div>

            <div>
              <div className="shipping-info mb-5">
                <h4 className="text-primary font-bold text-lg mb-2">
                  <i className="fas fa-truck"></i> Dự kiến nhận hàng
                </h4>
                <h5 className="text-white font-semibold"> {mapShipStatusToVietnamese(orderDetail.shipStatus)}</h5>
                <p className="text-white">Rất vui vì bạn đã tin tưởng và mua hàng.</p>
              </div>
              <div className="flex justify-between items-start">
                <div className="w-1/2">
                  <h5 className="text-primary font-semibold text-lg mb-2">
                    <i className="fas fa-user"></i> Thông tin người nhận
                  </h5>
                  <p className="text-white flex gap-3 flex-col font-semibold">
                    <div className="flex gap-2 items-center "><i className="fas fa-user-circle"></i>{orderDetail.shipInfo.name}<br />
                    </div>
                    <div className="flex gap-2 items-center ">                    <i className="fas fa-phone"></i> 0123456789
                    </div>
                  </p>
                </div>
                <div className="w-1/2 border-l border-gray-300 pl-4">
                  <h5 className="text-primary font-semibold text-lg mb-2">
                    <i className="fas fa-box"></i> Giao hàng tại
                  </h5>
                <div className=" flex text-white gap-4">
                    <div className="flex gap-4 flex-col justify-between">
<div className="flex flex-col"><div className="font-bold">Quốc gia:</div> Việt Nam</div>
<div className="flex flex-col"><div className="font-bold">Quận/Huyện:</div>{orderDetail.shipInfo.district}</div>

                    </div>
                    <div className="flex gap-4 flex-col">
                    <div className="flex flex-col"><span className="font-bold">Tỉnh: </span>{orderDetail.shipInfo.province}</div>
                    <div className="flex flex-col"><div className="font-bold">Phường/Xã:</div>{orderDetail.shipInfo.wards}</div>
                    </div>
                
                </div>
                <div className="text-white mt-4 break-words	 max-w-[250px]"><span className="font-bold">Địa chỉ cụ thể:</span> {orderDetail.shipInfo.shipDetail}</div>
                </div>
              </div>
            </div>

            <h5 className="title-list-detail text-lg font-semibold mt-5 mb-3 text-white">Danh sách sản phẩm</h5>
            <div className="product-list space-y-4">
              {orderDetail?.listBook?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-green-200 border p-3 rounded-lg shadow-sm"
                >
                  <div className="flex items-center ">
                    <div className="rounded-lg overflow-hidden">
                    <img
                      src={item?.book?.coverImage}
                      alt="Product"
                      className="w-full h-[80px]  object-contain"
                    />
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-semibold">{item.book.bookName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-semibold">{formatNumber(item.book.price)}đ</span>
                    <small className="block text-white">x{item.quantity} Quyển</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-full md:w-1/3 p-5 bg-book backdrop-blur border-white border-[1px] rounded-lg shadow-md">
            <h5 className="text-primary font-semibold text-lg mb-4">
              <i className="fas fa-credit-card"></i> Thông tin thanh toán
            </h5>
            <div className="mb-3 flex justify-between">
              <p className="text-white">Tổng tiền:</p>
              <span className="text-primary font-semibold">{formatNumber(orderDetail.totalAmount)}đ</span>
            </div>
            <div className="mb-3  justify-between">
              <p className="text-white">Giảm giá voucher:</p>
{
    orderDetail.vouchers.map((item,index) => (
        <div className="text-primary flex justify-between">

 <span className=" italic">{item.voucherName} {item.discountType === "PERCENTAGE" ? `(-${item.discountValue}%)` : ''}</span> 
              <span> - {item.discountType === "PERCENTAGE" ? formatNumber(((orderDetail.totalAmount) * (item.discountValue/100))) : formatNumber(item.discountValue) }</span>
                            
        </div>
    ))
}
            </div>
            <div className="mb-3 flex justify-between">
              <p className="text-white">Phí vận chuyển:</p>
              <span className="text-primary">15.000đ</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-3">
              <p className="text-white">Thành tiền:</p>
              <span className="text-primary">{formatNumber(orderDetail.totalAmountBefore)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
