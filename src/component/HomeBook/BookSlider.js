import { useState, useRef, useEffect } from "react";
import freeIcon from "../../assets/image/free.png";
import payIncon from "../../assets/image/paidIcon.png";
import memberIcon from "../../assets/image/meberIcon.png";
import { Link } from "react-router-dom";
import { useAPI } from "../Service/APIContext";
import FavoriteNotification from "../Shared/FavoriteNotification";
export default function BookSlider({scale, listBook}) {
  const {formatNumber,memberMapper,addToCart,isLogin, setModalStatus, setShowModal,addFavorite} = useAPI();
  const [translateX, setTranslateX] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isRightHalf, setIsRightHalf] = useState(false);
  const [maxTranslateX, setMaxTranslateX] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const sliderRef = useRef(null);
  const [book, setBook] = useState();
  const [showNotification,setShowNotification ] = useState(false);
  const numbers = [];

  const handleAddToFavorite = async (book) => {
setBook(book);
    if(!isLogin) {
      setModalStatus('login');
      setShowModal(true)
      return;
    }
    setShowNotification(true);
  await addFavorite(book.id)
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };
  for (let i = 1; i <= 10; i++) {
    numbers.push(i);
  }
  useEffect(() => {
    const sliderWidth = sliderRef.current.scrollWidth;
    const containerWidth = sliderRef.current.offsetWidth;
    const maxScrollWidth = sliderWidth - containerWidth;
    setMaxTranslateX(-Math.max(maxScrollWidth, 0));
    const handleScroll = () => {
      const currentScroll = sliderRef.current.scrollLeft;
      if (currentScroll <= 0) {
        setIsAtStart(true);
      } else {
        setIsAtStart(false);
      }
      if (currentScroll + containerWidth >= sliderWidth) {
        setIsAtEnd(true);
      } else {
        setIsAtEnd(false);
      }
    };

    sliderRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [numbers]);
  const handleLeftClick = () => {
    if (sliderRef.current.scrollLeft > 0) {
      sliderRef.current.scrollBy({ left: -600, behavior: "smooth" });
      const newScrollLeft = sliderRef.current.scrollLeft - 600;
      setTranslateX(newScrollLeft);
    }
  };

  const handleRightClick = () => {
    const slider = sliderRef.current;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft < maxScrollLeft) {
      slider.scrollBy({ left: 600, behavior: "smooth" });
      const newScrollLeft = slider.scrollLeft + 600;
      setTranslateX(newScrollLeft);
    }
  };

  const handleMouseEnter = (index, event) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    if (rect.left + rect.width / 2 > screenWidth / 2) {
      setIsRightHalf(true);
    } else {
      setIsRightHalf(false);
    }
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const aTagContent = (url,id) => (
    <Link to={`/detail/${id}`} className="relative lg:w-48 xl:w-50 2xl:w-60 relative">
                          <div className="absolute top-0 left-0 w-full h-full book-border z-10"></div>

      <img
        src={url}
        alt="Đập nồi bán sắt đi học"
        className="object-cover w-full h-full rounded-xl"
      />
    </Link>
  );
  function getBookDescription(item) {
    if (item.memberType === "NONE" && item.price === 0 && item.bookType === "EBOOK") {
        return "Sách miễn phí";
    }
    if (item.bookType === "PAPERBACK") {
        return "Sách giấy";
    }
    if (item.bookType === "EBOOK" && item.memberType === "NONE" && item.price > 0) {
        return "Sách trả phí";
    }
    return memberMapper(item.memberType);
}

function getButtonClass(item) {
  const description = getBookDescription(item);
  
  if (description === "Sách miễn phí") {
      return "bg-gradient-to-r from-blue-700 to-blue-400"; 
  }
  if (description === "Sách giấy") {
      return "bg-white !text-black"; 
  }
  if (description === "Sách trả phí") {
      return "bg-gradient-to-r from-orange-400 to-orange-700"; 
  }
  if (description === "Thành viên bạc") {
      return "bg-gradient-to-r from-gray-300 to-gray-400"; 
  }
  if (description === "Thành viên vàng") {
      return "bg-gradient-to-r from-yellow-300 to-yellow-600 !text-black"; 
  }
  if (description === "Thành viên kim cương") {
      return "bg-gradient-to-r from-blue-400 to-blue-500 !top-5 !-left-10 "; 
  }
  
  return "bg-gray-200";
}

  return (
    <>
    {showNotification && (
  <FavoriteNotification book={book} showNotification={showNotification} />
)}
 <div className="relative">

{   listBook.length > 4 && !isAtStart && (
  <div
    className="flex justify-center text-center items-center p-[25px] w-[30px] h-[30px] bg-custom-modal-dark-III backdrop-blur hover:bg-custom-modal-dark absolute top-[40%] -left-7 z-[100] cursor-pointer text-[24px] rounded-full"
    onClick={handleLeftClick}
  >
    <i className="fa-solid text-white fa-chevron-left"></i>
  </div>
)}
{  listBook.length > 4 && !isAtEnd && (
  <div
    className="flex justify-center text-center items-center p-[25px] w-[30px] h-[30px] bg-custom-modal-dark-III backdrop-blur hover:bg-custom-modal-dark absolute top-[40%] -right-7 z-[2] cursor-pointer text-[24px] rounded-full"
    onClick={handleRightClick}
  >
    <i className="fa-solid text-white fa-chevron-right"></i>
  </div>
)}

<div
  className="w-[100%] hide-scrollbar relative overflow-x-auto overflow-y-hidden"
  ref={sliderRef}
>
  <div className="w-full max-w-full list-carousel-item  hide-scrollbar transition-transform ease-in-out">
    <div className="w-max ml-8 flex hide-scrollbar pt-4 px-2">
      {listBook.map((item, index) => (
        
        <div
          key={index}
          className={`inline-block relative lg:w-52 group xl:w-56 group 2xl:w-[265px] cursor-pointer float-left mr-[42px] last:mr-[0px] ${'scale-' + scale}`}
          onMouseEnter={(event) => handleMouseEnter(index, event)}
          onMouseLeave={handleMouseLeave}
        >
          <div>
            <div className="relative w-full mt-5 ">
            <button className={`absolute py-1 z-[10] px-3 group-hover:hidden -left-8 top-2 -rotate-[35deg] black_border ${getButtonClass(item)} text-white  font-bold`}>
{getBookDescription(item)}                 
</button>
            
              <div className="relative w-full overflow-hidden pt-[150%] grid-center rounded-xl">
              <div className="absolute top-0 left-0 w-full h-full book-border z-10"></div>
                <img
                  src={item.coverImage}
                  alt={item.bookName}
                  className="absolute top-0 left-0 object-cover w-full  h-full"
                />
              </div>
              {
                item.bookType === "EBOOK" && item.price === 0 && item.memberType === "NONE" 
                &&
                 <div className="absolute top-0 flex right-0 p-2 bg-primary text-white rounded-tr-xl rounded-bl-xl ">
              <p className="text-sm font-bold uppercase ">Miễn phí</p>
            </div> 
              }
             
            {item.price > 0 &&
              <div className="absolute top-0 flex right-0 p-2 bg-cyan-to-lightblue text-white rounded-tr-xl rounded-bl-xl ">
              <p className="text-sm font-oswald !text-[#F5FFFA] px-1 font-bold uppercase ">
              {formatNumber(item.price) +' đ'}
              </p>
            </div>
            }
            
            </div>
            <div className="mt-4 h-[41px]">
              <Link
                to="/detail"
                className="text-white text-base-16-20 font-bold t-ellipsis-2 hover:text-primary"
              >
               {item.bookName}
              </Link>
            </div>
          </div>
          {hoveredIndex === index && (
            <div
              className={`absolute h-[87.5%] effect cursor-pointer animate 
            transition-opacity duration-500 ease-in-out bg-dark-gradient mt-2 border-0.1 border-primary text-white backdrop-blur rounded-xl top-0 z-50 p-4 min-w-[732px] book-content ${
              isRightHalf ? "right-0" : "left-0"
            }`}
            >
              <div className="flex justify-between w-full h-full">
                {!isRightHalf &&
                  aTagContent(
                   `${item.coverImage}`
                  ,item.id)}

                <div className="w-[63%]">
                  <Link
                    to={"/detail"}
                    className="font-bold text-white-default text-2xl t-ellipsis-2"
                  >
                    {item.bookName}
                  </Link>
                  <div>
                    <Link to="/detail">
                      <h2 className="mt-4 font-bold text-white-default text-base">
                      {item?.author?.name}
                      </h2>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="font-bold text-primary text-base">
                        {getBookDescription(item)}
                      </p>
                    </div>
                    <div className="flex">
                      <Link 
                      to={item.bookType === "EBOOK" ? `/epubread/${item.id}` : null}
                      className="flex items-center px-4 py-3 mr-2 rounded-full bg-primary hover:bg-f79"
                      onClick={() => {
                        if(item.bookType === "PAPERBACK")
                          addToCart(item.id,1);
                      }}>
                        <img
                          src="https://waka.vn/svgs/icon-read-book.svg"
                          alt="icon-read-book"
                          className="cursor-pointer"
                        />
                        <button className="ml-2 !cursor-pointer text-white-default text-base"
                   
                        >
                        {item.bookType === "EBOOK" ? "Đọc sách" : "Thêm vào giỏ hàng"}
                        </button>
                      </Link>
                      <div className="p-3 rounded-full bg-background-white text-primary hover:bg-hover-white border-white"
                      onClick={() => handleAddToFavorite(item)}
                      >
                        <img
                          src="https://waka.vn/svgs/icon-heart.svg"
                          alt="icon-heart"
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-hidden">
                    <div className="my-4 text-white font-bold text-sm line-clamp-4">
                      <p>
                   {item.description}
                      </p>
                    </div>
                    <Link
                      to={`/detail/${item.id}`}
                      className="text-primary mt-4 font-bold text-lg"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
                {isRightHalf &&
                  aTagContent(
                   `${item.coverImage}`
                  ,item.id)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>
</div>
    </>
   
  );
}
