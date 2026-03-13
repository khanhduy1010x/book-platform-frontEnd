import Card from "./Card";
import { v4 as uuidv4 } from "uuid";
import CarouselBase from "./Carousel";
import { useScroll } from "@react-spring/web";
import { useEffect, useState } from "react";
import { list } from "@material-tailwind/react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAPI } from "../../Service/APIContext";
import { Link } from "react-router-dom";
import FavoriteNotification from "../../Shared/FavoriteNotification";

export default function Carousel3d({ listBook,isBookTypeFilter }) {
  const {bookType} = useParams();
  const [currentBook, setCurrentBook] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const {addToCart,addFavorite,getDetailBook2,isLogin, setModalStatus,setShowModal} = useAPI();
  const [carouselHeight, setCarouselHeight] = useState("500px");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCarouselHeight("280px");
      else if (window.innerWidth < 1024) setCarouselHeight("380px");
      else setCarouselHeight("500px");
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  let books = [];
  const [currentSlide, setCurrentSlide] = useState();
  const handleAddToFavorite = async (id) => {
    if(!isLogin) {
      setModalStatus('login');
      setShowModal(true)
      return;
    }
    const book = await getDetailBook2(currentSlide);
    console.log(book)
    setShowNotification(true);
    setCurrentBook(book.book)
  await addFavorite(book.book.id)
    setTimeout(() => {
      setShowNotification(false);
    }, 3600);
  };
  listBook &&  listBook?.forEach((item) => {
    if(!isBookTypeFilter){
      item?.listBook?.forEach((item) => {
        books.push({ key: item.id, content: <Card book={item} />, book: item });
      })
    }else {
        books.push({ key: item.id, content: <Card book={item} />, book: item });
      
    }
 
  });
  useEffect(() => {
    if(isBookTypeFilter){
      setCurrentSlide(listBook[0]?.id);
    }else {
      setCurrentSlide(listBook[0]?.listBook[0]?.id);
    }
  }, [listBook]);

  return (
    <div className="mt-6 sm:mt-10 flex flex-col lg:flex-row relative z-1 gap-6 lg:gap-0">
      {showNotification && (
  <FavoriteNotification book={currentBook} showNotification={showNotification} />
)}
      <div className="text-white w-full">
        <span className="text-2xl sm:text-3xl lg:text-[48px] font-bold font-oswald ">{bookType === "EBOOK" ? 'Sách điện tử' : 'Sách Giấy'}</span>
        {books?.map((item, index) => {
          return (
            <div className="mt-5" key={index}>
              {item.book.id === currentSlide && (
                <>
                  <h2 className="text-xl sm:text-2xl lg:text-[28px] mb-3 text-primary font-bold ">
                    {item.book.bookName}
                  </h2>
                  <p className="line-clamp-5 font-rubik text-sm sm:text-base">{item.book.description}</p>
                </>
              )}
            </div>
          );
        })}

        {/* Buttons - desktop only (inside left panel) */}
        <div className="mt-10 hidden lg:flex gap-10 items-center">
           <Link 
                            to={bookType === "EBOOK" ? `/epubread/${currentSlide}` : null}
                            className="px-4 py-2 bg-primary font-rubik text-[22px] rounded-full font-bold cursor-pointer hover:scale-110 hover:bg-white hover:text-primary transition-scale ease-in-out duration-200"
                            onClick={() => {
                              if(bookType === "PAPERBACK")
                                addToCart(currentSlide,1);
                            }}>{bookType === "EBOOK" ? "Đọc sách" : "Thêm vào giỏ hàng "}</Link> 
          
          <i
          onClick={() => { handleAddToFavorite() }}
          className="fa-regular fa-heart-circle-plus text-[32px] bg-primary p-2 mr-[2px] rounded-full cursor-pointer hover:scale-110 trasition-scale duration-200 ease-in-out hover:bg-white hover:text-primary"></i>
          <Link
            to={`/detail/${currentSlide}`}
            className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary font-rubik text-[18px] rounded-full font-bold cursor-pointer hover:scale-110 hover:bg-primary hover:text-white transition-all ease-in-out duration-200"
          >
            <i className="fa-solid fa-circle-info"></i>
            Chi tiết
          </Link>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="py-10 lg:py-0">
          <CarouselBase
            cards={books}
            setCurrentSlide={setCurrentSlide}
            height={carouselHeight}
            width="75%"
            margin="0 auto"
            offset={2}
            showArrows={false}
          />
        </div>
        {/* Buttons - mobile only (below carousel, centered) */}
        <div className="flex lg:hidden justify-center gap-6 mt-4 items-center">
          <Link
            to={bookType === "EBOOK" ? `/epubread/${currentSlide}` : null}
            className="px-4 py-2 bg-primary font-rubik text-base sm:text-lg rounded-full font-bold cursor-pointer hover:scale-110 hover:bg-white hover:text-primary transition-scale ease-in-out duration-200"
            onClick={() => {
              if(bookType === "PAPERBACK")
                addToCart(currentSlide,1);
            }}>{bookType === "EBOOK" ? "Đọc sách" : "Thêm vào giỏ hàng "}</Link>
          <i
          onClick={() => { handleAddToFavorite() }}
          className="fa-regular fa-heart-circle-plus text-2xl sm:text-3xl bg-primary p-2 rounded-full cursor-pointer hover:scale-110 trasition-scale duration-200 ease-in-out hover:bg-white hover:text-primary"></i>
          <Link
            to={`/detail/${currentSlide}`}
            className="flex items-center gap-1.5 px-3 py-2 border-2 border-primary text-primary text-sm rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-200"
          >
            <i className="fa-solid fa-circle-info"></i>
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
