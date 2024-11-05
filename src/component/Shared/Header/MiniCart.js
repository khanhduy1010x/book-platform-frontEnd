import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAPI } from "../../Service/APIContext";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
const MiniCart = ({isAddCart}) => {
    const cartRef = useRef();
    const {getListCart, listCart,deleteToCart} = useAPI();
    useEffect(() => {
        if(cartRef.current)
        cartRef.current.scroll({ behavior: 'smooth', bottom: 0 })
    },[isAddCart])

    useEffect(() => {
      getListCart();
    },[])
  const handleDeleteCart = (cartID) => {
    deleteToCart(cartID)
  };

  return (
    <div className="relative font-oswald ">
      { listCart?.cartItems?.length > 0 ? (
        <div className="absolute right-0 mt-2 w-[320px]  shadow-lg  !bg-background-book  !backdrop-blur rounded-xl z-10 box-shadow-14
        after:content-[''] after:absolute after:w-[150px] after:h-[20px]  after:-top-4  after:right-0
        ">
      <div className="relative ">
        <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black-rgb  overflow-hidden">
        </div>
      </div>

          <div className="px-4 pt-4 pb-2">
            <h3 className="text-[16px] text-primary font-bold">Giỏ hàng</h3>
          </div>
          <div ref={cartRef} className="p-4 pt-2 max-h-64 text-white overflow-y-auto">
            <ul className="space-y-4">
              {listCart?.cartItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <img
                    src={item?.book.coverImage}
                    alt={item?.book.bookName}
                    className="w-12 h-18 rounded"
                  />
                  <div className="flex-1 px-4">
                    <h4 className="text-sm font-semibold">
                    {item?.book.bookName}
                    </h4>
                    <div className="text-xs text-gray-500 flex flex-col justify-around">
                        <p> {formatPrice(item?.book.price)}
                        </p>
                        <p className="pt-5 font-bold text-primary">x{item?.quantity} Quyển</p>
                    </div>
                    <p className="text-xs text-red-500">
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCart(item.id)}
                    className="text-red-600 flex items-center hover:text-red-800"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t flex justify-between items-center">
            <span className="font-semibold text-primary">{listCart?.cartItems?.length} sản phẩm</span>
            <Link
              to="/cart"
              className="bg-primary font-bold text-white px-4 py-2 rounded-xl text-sm"
            >
              Đến giỏ hàng
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MiniCart;
