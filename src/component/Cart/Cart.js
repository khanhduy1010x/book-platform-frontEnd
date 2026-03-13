import React, { useEffect, useState } from "react";
import { useAPI } from "../Service/APIContext";
import { Link, useNavigate } from "react-router-dom";
import VoucherModal from "./VoucherModal";
import emptyCart from "../../assets/image/emptycart.png"
function formatPrice(price) {
  if(price <0) {
    price = 0
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
const Cart = () => {
  const navigate = useNavigate();
  const [originalPriceCart, setOriginalPriceCart  ] =useState(0);
  const [showModalVoucher, setShowModalVoucher] = useState(false);
  const [totalPriceCart, setTotalPriceCart] = useState(0); 
  const { getListCart, listCart, updateCartItem, deleteToCart,getAllVoucher} = useAPI();
  const [isShowMore, setIsShowMore] = useState(true);
  useEffect(() => {
    getListCart(); 
  }, []);
  useEffect(() => {
    if (!listCart || !listCart.cartItems || !listCart.appliedVoucher) return;
      const totalCart = listCart.cartItems.reduce((total, item) => {
      return total + item.book.price * item.quantity;
    }, 0);
    setOriginalPriceCart(totalCart);
    const totalSale = listCart.appliedVoucher.reduce((totalSale, item) => {
      if (item.discountType === "PERCENTAGE") {
        return totalSale + (totalCart * item.discountValue / 100);
      } else {
        return totalSale + item.discountValue;
      }
    }, 0);
    setTotalPriceCart(totalCart - totalSale);
  }, [listCart]);
  
    const handlePaymentCartButton = () => {
      if(!listCart) return;
      navigate('/info-ship');
    }


  const handleDeleteCart = (cartID) => {
    deleteToCart(cartID); 
  };

  const handleUpdateQuantity = (itemID, newQuantity, isInput = false) => {
    if(isInput) {
      if(!newQuantity) 
        newQuantity = 1;
        ;
    }
    if(newQuantity === 999  && !isInput) return;
    updateCartItem(itemID, newQuantity); 
  };
  const handleGetAllVoucher = () => {
    setShowModalVoucher(true);
    getAllVoucher();
}

  return (
    <div className="bg-black relative">
  


    <div className="container mx-auto mt-0 pb-12 min-h-screen pt-[78px] relative  font-oswald">
     



      
       {
          showModalVoucher && <VoucherModal setShowModalVoucher={setShowModalVoucher}/>
        } 
      <a href="/" className="flex items-center text-primary text-lg no-underline mt-4 mb-6">
        <i className="fas fa-arrow-left mr-2"></i>
        Tiếp tục mua sắm
      </a>
   
      <div className="flex flex-col lg:flex-row justify-between gap-6 ">
        <div className="relative flex-1">
      <div className="relative z-10 flex-1 overflow-hidden">
      <div className="w-[150px] h-[150px] absolute bg-primary   rounded-full top-[250px] left-[600px] z-[-1]"></div>
      <div className="w-[150px] h-[150px] absolute bg-primary   rounded-full top-[250px] left-[100px] z-[-1]"></div>
      <div className="w-[150px] h-[150px] absolute bg-primary   rounded-full top-[550px] left-[200px] z-[-1]"></div>
      <div className="w-[150px] h-[150px] absolute bg-primary   rounded-full top-[350px] left-[500px] z-[-1]"></div>
      <div className="w-[150px] h-[150px] absolute bg-primary   rounded-full -top-[50px] left-[800px] z-[-1]"></div>

        <div className="bg-background-white backdrop-blur-50 border-white border-[2px] shadow-md rounded-xl w-full  relative z-20 ">
          <div className="px-4 pt-2">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b font-bold text-white text-[18px]  ">
                  <th>Sách</th>
                  <th className="py-4">Tên Sách</th>
                  <th>Giá thành</th>
                  <th>Số lượng</th>
                  <th className="w-[150px]">Tổng giá</th>
                  <th>Loại bỏ</th>
                </tr>
              </thead>
              <tbody>
                {listCart?.cartItems?.sort().slice(0, isShowMore ? 5 : listCart?.cartItems?.length).map((item, index) => 
                (
                  <tr key={index} className={`border-t ${isShowMore && listCart?.cartItems?.length > 5 ? index === 4 ? "border-b" : "" : index === listCart?.cartItems?.length -1 && listCart?.cartItems?.length > 5 ? "border-b" : ""} text-white !pt-[2px] transition-[width] duration-500 
                ease-in-out`}>
                    <td className="flex py-4 items-center justify-center group">
                      <img
                        className="w-16 h-[95px] box-shadow-1 book-border z-20 rounded-lg object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[400%]  group-hover:translate-x-[550px]"
                        src={item?.book.coverImage}
                        alt={item?.book.bookName}
                      />
                    </td>
                    <td className="font-bold text-lg"><Link className="hover:text-primary" to={`/detail/${item.book.id}`}>{item?.book.bookName}</Link></td>
                    <td>
                      <div className="text-primary font-bold">
                        {formatPrice(item?.book.price)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center">
                        <button
                          className="px-3 py-1 border rounded-l"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <div className="flex justify-center items-center border">
                          <input
                            className="w-14 text-black text-center py-1"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              let quantity = e.target.value 
                              if(e.target.value > 999){
                                quantity =  999;
                              }
                              handleUpdateQuantity(item.id , quantity,true) }
                            }
                          />
                        </div>
                        <button
                          className="px-3 py-1 border rounded-r"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{formatPrice(item.book.price * item.quantity)}</td>
                    <td>
                      <button
                        className="text-red-500 font-bold text-lg"
                        onClick={() => handleDeleteCart(item.id)}
                      >
                        <i className="fa-sharp-duotone fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {  (!listCart?.cartItems || listCart.cartItems.length === 0)  &&
 <tr>

 <td colSpan={6} className="">
   <div className="flex items-center justify-center">
   <img src={emptyCart}/>
   </div>

 </td>
</tr>
                }
               
              </tbody>
            </table>
          </div>

        

          {        listCart.cartItems &&  !(listCart?.cartItems?.length <= 5) &&  
      ( <div className="flex justify-center relative text-white py-3"> 
        {
          <span className="cursor-pointer" onClick={() => setIsShowMore(!isShowMore)}>{ isShowMore ? `Hiển thị toàn bộ (Còn ${listCart?.cartItems?.length - 5 } sản phẩm)` : "Thu gọn"}</span> 
    }
        </div>


            )
}
        </div>
        
        </div>
     
        </div>
        <div className="relative z-10  h-full">
        <div className="box mask absolute  w-[510px] rotate-180 -bottom-[35px] -right-[5px]"></div>
        <div className="w-[100px] h-[100px] absolute bg-primary   rounded-full top-[0px] left-[300px] z-[-1]"></div>

        <div className="relative z-10 w-[510px] ">

        <div className="  border-tl-[2px] bg-background-white backdrop-blur-50  rounded-tl-xl rounded-tr-xl w-full p-4 relative font-oswald ">
          <h5 className="text-center font-bold text-primary mb-4 text-[24px]">Tóm tắt đơn hàng</h5>
          <ul className="list-none p-0">
            <li className="flex font-bold justify-between py-2 text-white">
            <span className="text-[18px]">Tổng tiền{" "}</span>  
              <span>{formatPrice(originalPriceCart)}</span>
            </li>
            { listCart?.appliedVoucher?.length > 0 && <li className="flex justify-between py-2 text-red-500 font-bold text-[18px] border-t !border-gray-50 border-t-[2px] pt-2" style={{ borderColor: "rgba(114, 114, 114, 0.4)" }}>
              Giảm giá{" "}
            </li>}
            {
              listCart?.appliedVoucher?.length > 0 && listCart?.appliedVoucher.map((item, index) => {
                return(
                  <li key={index} className="flex justify-between py-2 text-red-500 ">
                  <span>
              <span className="font-bold">  Voucher -</span> <span className=" italic">{item.voucherName} {item.discountType === "PERCENTAGE" ? `(-${item.discountValue}%)` : ''}</span> </span>
              <span> - {item.discountType === "PERCENTAGE" ? formatPrice((originalPriceCart * item.discountValue/100)) : formatPrice(item.discountValue) }</span>
                            </li>

                )
              
              }) 
            }
        
          
           
            <li className="flex justify-between py-2 font-bold text-white border-t !border-gray-50 border-t-[2px] pt-4" style={{ borderColor: "rgba(114, 114, 114, 0.4)" }}>
             <span className="text-white text-[18px]">  Thành tiền{" "}</span>
              <span>{formatPrice(totalPriceCart)}</span>
            </li>
          </ul>
          <div className="flex items-center border-t border-gray-300 pt-4 justify-between">
            <div className="flex items-center">
            <i className="fa-solid fa-tickets-perforated text-primary text-[20px] mr-1"></i> 
            <span className="text-primary font-bold">BOOK4.0 VOUCHER</span>
            </div>
       <button className="font-bold text-primary hover:scale-[110%] transition-all duration-300 " 
       onClick={() => handleGetAllVoucher()}
       >Chọn voucher  </button> 
       
             </div>
          <button disabled={(!listCart?.cartItems || listCart.cartItems.length === 0)} className="btn btn-primary disabled:opacity-50 w-full mt-6 bg-primary text-white py-2 rounded-full"
          onClick={handlePaymentCartButton}
          >
            Mua hàng
          </button>
        </div>
        </div>
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default Cart;
