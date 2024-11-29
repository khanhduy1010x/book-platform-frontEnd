import { useEffect, useState } from "react";
import BookSlider from "../HomeBook/BookSlider";
import { Link, useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";
import ReactModal from "./ReactModal";
import PaymentEbook from "./PaymentEbook";
import FavoriteNotification from "../Shared/FavoriteNotification";

export default function DetailBook() {
  
  const { getDetailBook, memberMapper,formatNumber,addToCart,formatDate,bookDetail,addFavorite,isLogin,setShowModal, setModalStatus,listBookLike} = useAPI();
  const [showNotification, setShowNotification] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [showRating,setShowRating]=useState(false);
  const [showPaymentModal , setShowPaymentModal] = useState(false);
  const [rating, setRating ] = useState(0)
  const [percent,setPercent] = useState({});
  const { id } = useParams();
  const Rate = {
    ONE_STAR: 1,
    TWO_STAR: 2,
    THREE_STAR: 3,
    FOUR_STAR: 4,
    FIVE_STAR: 5
  };
 
  const handleAddToFavorite = async () => {
    if(!isLogin) {
      setModalStatus('login');
      setShowModal(true)
      return;
    }
    setShowNotification(true);
  await addFavorite(bookDetail?.book.id)
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };
  function renderStars(rating) {
    const fullStars = Math.floor(rating); 
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); 
  
    return (
      <div className="flex items-center">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`full-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#FFCC00"
            >
              <path d="M12 .587l3.668 7.429L24 9.748l-6 5.847 1.417 8.266L12 18.896l-7.417 3.965L6 15.595 0 9.748l8.332-1.732L12 .587z" />
            </svg>
          ))}
        {halfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#FFCC00"
          >
            <path d="M12 .587l3.668 7.429L24 9.748l-6 5.847 1.417 8.266L12 18.896l-7.417 3.965L6 15.595 0 9.748l8.332-1.732L12 .587z" />
            <path
              d="M12 .587L8.332 8.016 0 9.748l6 5.847-1.417 8.266L12 18.896V.587z"
              fill="#E0E0E0"
            />
          </svg>
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`empty-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#E0E0E0"
            >
              <path d="M12 .587l3.668 7.429L24 9.748l-6 5.847 1.417 8.266L12 18.896l-7.417 3.965L6 15.595 0 9.748l8.332-1.732L12 .587z" />
            </svg>
          ))}
      </div>
    );
  }
  
  useEffect(() => {
    setPercent(calculatePercentage(bookDetail?.bookRates)); 
    setRating(calculateAverageStars(bookDetail?.bookRates));
  }, [bookDetail]);

function calculatePercentage(bookRates) {
  if (!bookRates || bookRates.length === 0) {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }


  const total = bookRates.length;

  const count = bookRates.reduce((acc, item) => {
    const rateKey = item.rate; 
    acc[rateKey] = (acc[rateKey] || 0) + 1; 
    return acc;
  }, {});

  const percentages = Object.keys(Rate).reduce((acc, rateKey) => {
    const stars = Rate[rateKey]; 
    acc[stars] = ((count[rateKey] || 0) / total) * 100; 
    return acc;
  }, {});

  return percentages;
}
function calculateAverageStars(bookRates) {
  if (!bookRates || bookRates.length === 0) {
    return 0; 
  }

  const totalStars = bookRates.reduce((sum, item) => {
    const stars = Rate[item.rate]; 
    return sum + stars;
  }, 0);

  const totalRatings = bookRates.length;

  return (totalStars / totalRatings).toFixed(1);
}


  
  useEffect(() => {
    if (showRating || showPaymentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showRating]);
 useEffect(() => {
  getDetailBook(id);
 },[])
  const StarRating = ({ stars, percentage }) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-yellow-400">
          <span className="invisible">{"★".repeat(5 - stars)}</span>

          {"★".repeat(stars)}
        </div>{" "}
        <div className="w-40 bg-gray-700 h-2 rounded-full">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };
  function rateToNumber(rate) {
    if (Rate[rate] !== undefined) {
      return Rate[rate];
    } else {
      throw new Error(`Invalid rate: ${rate}`);
    }
  }
  const Review = ({ avatar, name, date, review, rating }) => {
    return (
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            <span className="text-white font-bold">{name}</span>
          </div>
          <span className="text-gray-400 text-sm">{date}</span>
        </div>
        <p className="text-gray-300 mb-2">{review}</p>
        <div className="flex items-center">
          <div className="text-yellow-400">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="pt-[72px] px-[64px] bg-black w-full relative">
{showNotification && (
  <FavoriteNotification book={bookDetail?.book} showNotification={showNotification} />
)}
      {
        showPaymentModal && <PaymentEbook bookInfo={bookDetail} setShowPaymentModal={setShowPaymentModal}/>
      }
      {showRating && isLogin && <ReactModal setShowRating={setShowRating} bookID={id} userComment={bookDetail?.bookRateOfUser} rateToNumber={rateToNumber} id={id}/>}
      <div className="min-h-screen w-full relative pb-[32px]">
        <div className="flex">
          <div className="blur-layer-1 absolute top-[206px] right-1/2 z-0"></div>
          <div className="blur-layer-2 absolute -top-[98px] left-1/2 z-0"></div>
          <div className="flex justify-beetwen mt-3 relative w-[100%]">
            <div className="relative">
              <div className="sticky top-[10%] w-[400px] z-20 mr-15">
                <div className="relative w-full">
                  <div className="pt-[150%] relative rounded-xl overflow-hidden mb-10">
                    <img
                      alt="Nguyện cùng em đi qua gió sương"
                      src={bookDetail?.book?.coverImage}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>{" "}
                  <div className="book-border w-full top-0 left-0 absolute h-full"></div>{" "}
                </div>
              </div>
            </div>
            <div className="px-[32px] text-white font-oswald">
              <h2 className="text-white font-bold text-[32px]">
                {bookDetail?.book?.bookName}
              </h2>
              <div className="flex mt-4">
                <div className="flex items-center mr-6 font-bold">
                  <span className="text-white-50 block mr-1">{rating} </span>{" "}
                  <div className="flex items-center justify-center">
                  {renderStars(rating)}
                  </div>
                </div>{" "}
                <p className="text-white-50">
                  <span className="text-white-400">・</span>{bookDetail?.bookRates?.length} đánh giá
                </p>
              </div>
              <div className="font-rubik">
                <a
                  href="/bang-xep-hang?rank_type=week&amp;content_type=book_all"
                  className="bg-pink-950 flex items-center max-w-fit p-2 rounded-full mt-4 mb-2"
                >
                  {" "}
                  <div className="w-12 h-7-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <p className="text-14-14 font-medium text-white-50">#23</p>
                  </div>{" "}
                  <p className="text-pink-500 mx-1 text-14-14">
                    trong Top xu hướng Sách điện tử
                  </p>{" "}
                  <img
                    src="https://waka.vn/svgs/icon-right-pink.svg"
                    alt="icon-right-pink"
                    className="cursor-pointer w-4 h-4"
                  />
                </a>

                <div className="mt-4 z-30 relative ">
                  <div className="">
                    <p className="text-gray-400 text-16-16">Tác giả</p>{" "}
                    <a href="/author/nardia-le-rXL1" className="">
                      <p className="text-white-500 font-bold text-[16px] cursor-pointer mt-[2px]">
                        {bookDetail?.book?.author?.name}
                      </p>
                    </a>{" "}
                  </div>{" "}
                  <div className="mt-[16px]">
                    <p className="text-gray-400 text-16">Thể loại</p>{" "}
                    <a
                      href="/ebook/phat-trien-ca-nhan-gGn8W.html"
                      className="max-w-[230px] block"
                    >
                      <p className="text-white-50 text-16-16 cursor-pointer font-bold">
                        {bookDetail?.book?.category?.cateName}
                      </p>
                    </a>
                  </div>{" "}
                  <div className="mt-[16px]">
                    <p className="text-gray-400 text-16-16">Kiểu sách</p>{" "}
                    <p className="text-white-50 text-[16px] font-bold">
                     {bookDetail?.book?.bookType === "EBOOK" ? "Sách điện tử" : "Sách giấy"}
                    </p>
                  </div>{" "}
                  {bookDetail?.book?.memberType != "NONE" && bookDetail?.bookType === "EBOOK" && (
                    <div className="mt-[16px]">
                      <p className="text-gray-400 text-16-16 ">Gói cước</p>{" "}
                      <p className="text-white-50 text-16-16 font-bold">
                        {memberMapper(`${bookDetail?.book?.memberType}`)}
                      </p>
                    </div>
                  )}
                      {bookDetail?.book?.memberType === "NONE" && (
                    <div className="mt-[16px]">
                      <p className="text-gray-400 text-16-16 ">{bookDetail?.book?.bookType === "EBOOK" ? "Giá đọc sách" : "Giá mua sách"}</p>{" "}
                      <p className="text-white-50 text-16-16 font-bold">
                        {bookDetail?.book?.price > 0 ? formatNumber(bookDetail?.book?.price) + "đ" : "Miễn phí" }
                      </p>
                    </div>
                  )}
                  
                </div>

                <div className="border-[1px] mt-[24px] border-gray-400 "></div>
              </div>
              <div className="flex justify-around">
            {bookDetail?.book?.bookType === "EBOOK" ?  ( 

<Link
to={`/epubread/${bookDetail?.book?.id}`}
className="bg-primary w-[200px] justify-center items-center font-bold hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200 px-2 py-4 text-[20px] mt-[16px] flex rounded-full cursor-pointer">
<i className="fa-duotone mr-2 fa-solid fa-book-open-reader"></i>{" "}
<span>Đọc sách</span>
</Link>
            ) : 
            <div onClick={()=>addToCart(id,1)} className="bg-primary w-[200px] justify-center items-center font-bold hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200 px-2 py-4 text-[20px] mt-[16px] flex rounded-full cursor-pointer">
            <i className="fa-duotone mr-2 fa-solid fa-book-open-reader"></i>{" "}
            <span>Thêm vào giỏ hàng</span>
          </div>}
          {
            bookDetail?.book?.bookType === "EBOOK" &&  bookDetail?.book?.price > 0 && (
              <div
              onClick={(e) =>
              {
                if(bookDetail?.owned) {
                  return;
                }
                if(!isLogin) {
                  setModalStatus('login');
                  setShowModal(true)
                  return;
                }
                setShowPaymentModal(true)
              }
               }
              className={`${bookDetail?.owned ?  "pointer-events-none	opacity-70 cursor-default" : ""} bg-primary w-[200px] justify-center items-center font-bold hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200 px-2 py-4 text-[20px] mt-[16px] flex rounded-full cursor-pointer`}>
              <i className="fa-duotone mr-2 fa-solid fa-book-open-reader"></i>{" "}
              <span>{bookDetail?.owned ? "Đã sở hữu" : "Mua Nội Dung" }</span>
            </div>
            )

          }
               
            
                <div className="flex justify-center mt-[16px] items-center cursor-pointer " 
                onClick={handleAddToFavorite}
                >
                  <i className="fa-regular fa-heart-circle-plus text-[32px] bg-gray-500 p-2 rounded-full hover:text-primary  hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200"></i>
                </div>
                <div className="flex justify-center mt-[16px] items-center cursor-pointer ">
                  <i className="fa-duotone fa-solid fa-copy text-[32px] bg-gray-500 p-2 rounded-full hover:text-primary  hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200"></i>
                </div>
              </div>
              <div className="mt-3 rounded-lg">
                {/* <div className="mb-4">
                  <label className="text-gray-300 font-semibold mb-2 block">
                    Chọn loại sách
                  </label>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md">
                      Sách điện tử
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                      Sách nói
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                      Sách giấy
                    </button>
                  </div>
                </div> */}
                {/* <div>
                  <label className="text-gray-300 font-semibold mb-2 block">
                    Chọn nội dung
                  </label>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md">
                      Đầy đủ
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                      Tóm tắt
                    </button>
                  </div>
                </div> */}
              </div>
              <div className="mt-4 text-[24px] font-bold">
                Tóm tắt nội dung
                </div>
              <div
                className={`w-[420px] mt-4${showMore ? "" : " line-clamp-3"}`}
              >
               
               {bookDetail?.book?.description}
              </div>
              <span
                className="text-primary cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              >
                {!showMore ? "Xem thêm" : "Rút gọn"}
              </span>

              <div className="mt-3 text-[24px]">
                Độc giả nói gì về “Nguyện cùng em đi qua gió sương”
              </div>
              <div className="p-4 bg-gray-900 rounded-lg mt-2 w-[550px]">
                <div>
                  <div className="flex space-x-4 text-green-400 mb-4">
                
                    <button
                      className={`${
                        !isComment
                          ? "border-b-2 border-primary"
                          : "text-gray-400"
                      }`}
                      onClick={() => setIsComment(!isComment)}
                    >
                      Đánh giá & nhận xét ({bookDetail?.bookRates?.length})
                    </button>
                  </div>
                 
                    <>
                      <div className="p-4 bg-gray-900 rounded-lg">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-white flex items-center text-5xl gap-4  font-bold">
                           <div className=""> {rating} </div>   
                          <div>
                          <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                      fill="#FFCC00"
                    />
                  </svg>
                            </div> 
                            <div className="flex items-center">
                            <span className="text-gray-400 text-[14px]">{bookDetail?.bookRates?.length} đánh giá</span>
                            </div>
                          </div>
                          <div>
                          </div>
                        </div>

                        <div className="space-y-1">
                        {Object.keys(percent)
        .sort((a, b) => b - a) 
        .map((stars) => (
          <StarRating
            key={stars}
            stars={parseInt(stars)} 
            percentage={percent[stars]}
          />
        ))}
                        </div>

                        <div className="mt-4 flex items-center justify-center">
                          <button className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg"
                          onClick={() => {
                            if(!isLogin) {
                              setModalStatus('login');
                              setShowModal(true)
                              return;
                            }
                            setShowRating(true)}}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.211 2.789a2.996 2.996 0 00-4.242 0L2.586 13.172a1 1 0 00-.293.707V17a1 1 0 001 1h3.121a1 1 0 00.707-.293l10.383-10.383a2.996 2.996 0 000-4.242zM13.5 3.5a1 1 0 011.415 0l1.086 1.086a1 1 0 010 1.415l-1.793 1.793-2.5-2.5 1.793-1.793a1 1 0 011.415 0zM5.793 14.5H5v-.793l6.793-6.793 2.5 2.5-6.793 6.793z" />
                            </svg>
                            <span>{bookDetail?.bookRateOfUser ? "Sửa đánh giá" : "Viết đánh giá"} </span>
                          </button>
                        </div>
                        {
                          bookDetail?.bookRates?.map((item,index) => (
                            <Review
                            avatar={item?.account.avatar}
                            name={item?.account.fullName}
                            date={formatDate(item?.date)}
                            review={item?.comment}
                            rating={rateToNumber(item?.rate)}
                          />
                          ))
                        }
                      
                      </div>
                    </>
         
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[24px] font-bold ml-2 mt-4 text-white">
          Có thể bạn thích
        </div>
{ listBookLike &&        <BookSlider listBook={listBookLike}/>}
     </div>
    </div>
  );
}
